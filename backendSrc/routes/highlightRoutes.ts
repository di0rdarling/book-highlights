import express from 'express';
import mongoose from 'mongoose';
import { postHighlight, getHighlightById, getHighlights } from '../controllers/highlightsController'

export const router = express.Router();
mongoose.set('bufferCommands', false)

router.route('/').post(postHighlight);

router.route('/').get(getHighlights);

router.route('/:_id').get(getHighlightById);

