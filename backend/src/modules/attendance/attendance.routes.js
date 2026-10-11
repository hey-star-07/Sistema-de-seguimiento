import { Router } from 'express';
import { asyncHandler as h } from '../../utils/asyncHandler.js';
import { validate } from '../../middlewares/validate.js';
import { dateQuerySchema, bulkSchema } from './attendance.schemas.js';
import * as c from './attendance.controller.js';

const r = Router();
r.get('/', validate(dateQuerySchema, 'query'), h(c.list));
r.put('/', validate(bulkSchema), h(c.saveBulk)); // botón general "Guardar Asistencia"
export default r;
