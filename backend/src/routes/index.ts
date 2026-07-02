import { Router } from 'express';
import authRoutes from './authRoutes.js';
import electionRoutes from './electionRoutes.js';
import positionRoutes from './positionRoutes.js';
import candidateRoutes from './candidateRoutes.js';
import voteRoutes from './voteRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import importRoutes from './importRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/elections', electionRoutes);
router.use('/positions', positionRoutes);
router.use('/candidates', candidateRoutes);
router.use('/votes', voteRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/import', importRoutes);

export default router;
