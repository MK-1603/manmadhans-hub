import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Fallback to localhost if not specified, since callback needs to be fully qualified
const API_URL_RAW = process.env.API_URL || 'http://localhost:4000';

const normalizeLoopbackHost = (urlValue: string) => {
  try {
    const parsed = new URL(urlValue);
    if (parsed.hostname === '127.0.0.1') {
      parsed.hostname = 'localhost';
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return urlValue.replace(/\/$/, '');
  }
};

const API_URL = normalizeLoopbackHost(API_URL_RAW);

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(null, false, { message: 'No email found in Google profile' });
          }

          // Check if user is pre-authorized
          const result = await query(
            'SELECT id, email, username, role, must_change_password FROM users WHERE email = $1',
            [email]
          );

          if (result.rows.length === 0) {
            return done(null, false, { message: 'Unauthorized account' });
          }

          return done(null, result.rows[0]);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Passport serialization is required even if sessions are disabled in requests,
// as passport might call it internally or if session-less config is skipped.
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await query('SELECT id, email, username, role FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return done(new Error('User not found'), null);
    }
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
