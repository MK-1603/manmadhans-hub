import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logSecurityEvent } from '../lib/logger.js';
import passport from 'passport';
import { io } from '../lib/socket.js';
import rateLimit from 'express-rate-limit';
import { authorize } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL: SESSION_SECRET is missing. Authentication cannot proceed securely.");
  process.exit(1);
}

// Rate limiting for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST /api/v1/auth/login
 * @desc  Authenticate user with email and passkey
 */

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  const { email, passkey } = req.body;

  if (!email || !passkey) {
    return res.status(400).json({ error: 'Email and passkey are required' });
  }

  try {
    const result = await query(
      'SELECT id, email, username, passkey, role, must_change_password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      await logSecurityEvent('Failed Login Attempt', 'High', `IP: ${req.ip || 'Unknown'}`, email || 'anonymous');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // Verify passkey with bcrypt
    const isMatch = await bcrypt.compare(passkey, user.passkey);
    if (!isMatch) {
      await logSecurityEvent('Failed Login Attempt', 'High', `IP: ${req.ip || 'Unknown'}`, user.username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '100y' }
    );

    await logSecurityEvent('Successful Authentication', 'Low', `IP: ${req.ip || 'Unknown'}`, user.username);

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        mustChangePassword: user.must_change_password
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check-email', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await query('SELECT id, username, role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auto-recover', authLimiter, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await query('SELECT id, username, role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const recoveryPass = `Recover@${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const hashedPass = await bcrypt.hash(recoveryPass, 10);

    await query(
      'UPDATE users SET passkey = $1, must_change_password = TRUE WHERE email = $2',
      [hashedPass, email]
    );

    await logSecurityEvent('Auto Recovery Triggered', 'High', `IP: ${req.ip || 'Unknown'}`, result.rows[0].username);

    return res.status(200).json({ success: true, recoveryPassword: recoveryPass, user: result.rows[0] });
  } catch (error) {
    console.error('Auto recover error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', authLimiter, async (req: Request, res: Response) => {
  const { email, oldPasskey, newPasskey } = req.body;

  if (!email || !oldPasskey || !newPasskey) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Verify current passkey first
    const userRes = await query('SELECT username, passkey FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const isMatch = await bcrypt.compare(oldPasskey, userRes.rows[0].passkey);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid current credentials' });
    }

    // Hash new passkey
    const hashedNewPass = await bcrypt.hash(newPasskey, 10);

    // Update password and clear must_change_password flag
    await query(
      'UPDATE users SET passkey = $1, must_change_password = FALSE WHERE email = $2',
      [hashedNewPass, email]
    );

    const updatedUserRes = await query(
      'SELECT id, email, username, role, must_change_password FROM users WHERE email = $1',
      [email]
    );
    const updatedUser = updatedUserRes.rows[0];

    // Generate JWT Token
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '100y' }
    );

    await logSecurityEvent('Passkey Reset Synchronized', 'Medium', `IP: ${req.ip || 'Unknown'}`, updatedUser.username || email);

    res.json({
      message: 'Passkey updated successfully',
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        mustChangePassword: updatedUser.must_change_password
      }
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/v1/auth/create-user
 * @desc  Create a new user/admin (Super Admin can create Admin/User, Admin can create User)
 */
router.post('/create-user', authorize(['owner']), async (req: Request, res: Response) => {
  const { email, username, passkey, role } = req.body;
  const creatorRole = (req as any).user.role;

  if (!email || !username || !passkey || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // RBAC Validation for Creation
  if (creatorRole === 'owner' && !['owner', 'member'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role assignment' });
  }

  try {
    const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already in use by another node.' });
    }

    const usernameCheck = await query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already in use by another node.' });
    }

    const hashedPass = await bcrypt.hash(passkey, 10);
    const result = await query(
      'INSERT INTO users (email, username, passkey, role, must_change_password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, username, hashedPass, role, true] // Force change password for new accounts
    );

    if (io) {
      io.emit('notification', {
        title: 'Identity Synced',
        desc: `New node ${username} successfully registered.`,
        type: 'user',
        roles: ['owner']
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      userId: result.rows[0].id
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/update-profile', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authentication required' });

  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Check if email is in use by another user
    const emailCheck = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, decoded.id]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already in use by another node.' });
    }

    // Check if username is in use by another user
    const usernameCheck = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, decoded.id]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already in use by another node.' });
    }

    // Update in DB
    await query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3',
      [username, email, decoded.id]
    );

    // Write security event
    await logSecurityEvent('Profile Updated', 'Low', `IP: ${req.ip || 'Unknown'}`, username);

    res.json({
      success: true,
      message: 'Profile credentials updated successfully',
      user: {
        id: decoded.id,
        email,
        username,
        role: decoded.role
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authentication required' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Fetch latest user details from DB
    const result = await query(
      'SELECT id, email, username, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
});

/**
 * @route POST /api/v1/auth/google
 * @desc  Authenticate user with Google OAuth Access Token (Pre-authorized account verification)
 */
router.post('/google', async (req: Request, res: Response) => {
  const { accessToken, mockEmail } = req.body;

  try {
    let email = '';

    if (process.env.NODE_ENV === 'development' && mockEmail) {
      email = mockEmail;
    } else {
      if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
      }

      // Query Google userInfo endpoint
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      if (!response.ok) {
        return res.status(401).json({ error: 'Invalid Google credentials' });
      }

      const googleUser = (await response.json()) as { email?: string };
      email = googleUser.email || '';
    }

    if (!email) {
      return res.status(400).json({ error: 'Google account email not verified or missing' });
    }

    // Check if user is pre-authorized (email exists in users db)
    const result = await query(
      'SELECT id, email, username, role, must_change_password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      await logSecurityEvent('Failed Google Auth (Unauthorized Account)', 'High', `IP: ${req.ip || 'Unknown'}`, email);
      return res.status(403).json({ error: 'This Google account is not authorized to access this platform. Please contact a Super Admin.' });
    }

    const user = result.rows[0];

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '100y' }
    );

    await logSecurityEvent('Successful Google Authentication', 'Low', `IP: ${req.ip || 'Unknown'}`, user.username);

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        mustChangePassword: user.must_change_password
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Internal server error during Google validation' });
  }
});

/**
 * @route GET /api/v1/auth/google
 * @desc  Redirect user to Google Consent Screen via Passport.js
 */
router.get('/google', (req: Request, res: Response, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({ error: 'Google OAuth is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

/**
 * @route GET /api/v1/auth/google/callback
 * @desc  Google OAuth callback handler. Communicates credentials back to the opener window.
 */
router.get('/google/callback', (req: Request, res: Response, next) => {
  const clientUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
  passport.authenticate('google', { session: false }, async (err: any, user: any, info: any) => {
    if (err || !user) {
      const errMsg = info?.message || (err as Error)?.message || 'Google authentication failed';
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Auth Failed</title></head>
        <body>
          <script>
            try {
              var msg = { type: 'GOOGLE_AUTH_FAILURE', error: ${JSON.stringify(errMsg)} };
              if (window.opener) {
                window.opener.postMessage(msg, '${clientUrl}');
              }
            } catch(e) {}
            setTimeout(function() { window.close(); }, 100);
          </script>
        </body>
        </html>
      `);
    }

    try {
      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '100y' }
      );

      await logSecurityEvent('Successful Google Authentication', 'Low', `IP: ${req.ip || 'Unknown'}`, user.username);

      const userData = JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        mustChangePassword: user.must_change_password
      });

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Auth Success</title></head>
        <body>
          <script>
            try {
              var msg = {
                type: 'GOOGLE_AUTH_SUCCESS',
                token: ${JSON.stringify(token)},
                user: ${userData}
              };
              if (window.opener) {
                window.opener.postMessage(msg, '${clientUrl}');
              }
            } catch(e) {}
            setTimeout(function() { window.close(); }, 100);
          </script>
        </body>
        </html>
      `);
    } catch (error: any) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Auth Error</title></head>
        <body>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_FAILURE', error: 'Internal token generation error' }, '${clientUrl}');
              }
            } catch(e) {}
            setTimeout(function() { window.close(); }, 100);
          </script>
        </body>
        </html>
      `);
    }
  })(req, res, next);
});

export default router;
