import { Router } from 'express';
import { searchQuerySchema } from '@adulis/shared';
import { searchController } from '../controllers/search.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', validate(searchQuerySchema, 'query'), asyncHandler(searchController.search));

export default router;
