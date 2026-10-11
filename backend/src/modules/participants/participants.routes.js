import { Router } from 'express';
import { asyncHandler as h } from '../../utils/asyncHandler.js';
import { validate } from '../../middlewares/validate.js';
import { participantSchema, listQuerySchema, idParamSchema } from './participants.schemas.js';
import * as c from './participants.controller.js';

const r = Router();
r.get('/', validate(listQuerySchema, 'query'), h(c.list));
r.post('/', validate(participantSchema), h(c.create));
r.get('/:id', validate(idParamSchema, 'params'), h(c.get));
r.put('/:id', validate(idParamSchema, 'params'), validate(participantSchema), h(c.update));
r.delete('/:id', validate(idParamSchema, 'params'), h(c.remove));
export default r;
