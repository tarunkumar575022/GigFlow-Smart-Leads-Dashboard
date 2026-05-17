import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';
import { protect, admin } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createLeadSchema, updateLeadSchema } from '../validators/leadValidators';

const router = express.Router();

router.use(protect);

router.get('/export', admin, exportLeads);

router
  .route('/')
  .post(validate(createLeadSchema), createLead)
  .get(getLeads);

router
  .route('/:id')
  .get(getLeadById)
  .patch(validate(updateLeadSchema), updateLead)
  .delete(admin, deleteLead);

export default router;
