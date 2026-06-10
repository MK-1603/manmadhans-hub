import { Router } from 'express';
import authRouter from './auth.js';
import adminRouter from './admin.js';
import toolsRouter from './tools.js';
import userToolsRouter from './user-tools.js';
import categoriesRouter from './categories.js';
const router = Router();

// Authentication Subsystem
router.use('/auth', authRouter);

// Governance Subsystem
router.use('/admin', adminRouter);

// Neural Catalog Subsystem
router.use('/tools', toolsRouter);

// User Contribution Catalog Subsystem
router.use('/user-tools', userToolsRouter);

// Taxonomy Subsystem
router.use('/categories', categoriesRouter);

// Global Compare Engine
import compareRouter from './compare.js';
router.use('/engine/compare', compareRouter);

// Web Push Notifications
import pushRouter from './push.js';
router.use('/push', pushRouter);


// Example Route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Manmadhan Hub API v1' });
});

export default router;
