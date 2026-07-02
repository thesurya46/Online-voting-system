import { Router } from 'express';
import authRoutes from './authRoutes.js';
import electionRoutes from './electionRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/elections', electionRoutes);

export default router;
