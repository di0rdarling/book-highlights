import express from 'express';
import { postHighlight, getHighlightById, getHighlights, syncReadwiseHighlights, deleteHighlightById, deleteHighlights, sendHighlights, editHighlightById } from '../controllers/highlightsController'

export const router = express.Router();

router.route('/').post(postHighlight);

router.route('/').get(getHighlights);

router.route('/sync').get(syncReadwiseHighlights);

router.route('/:_id').get(getHighlightById);

router.route('/:_id').put(editHighlightById);

router.route('/').delete(deleteHighlights);

router.route('/:_id').delete(deleteHighlightById);

router.route('/mail').post(sendHighlights);
