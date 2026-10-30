import express from 'express';
import { ingestMetaEvents } from '../controllers/metaEventsController.js';

const router = express.Router();

router.post('/events', ingestMetaEvents);

export default router;
