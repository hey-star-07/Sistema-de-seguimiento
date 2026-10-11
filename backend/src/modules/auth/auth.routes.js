import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../../utils/asyncHandler.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { loginSchema } from './auth.schemas.js';
import * as c from './auth.controller.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
});

const r = Router();
r.post('/login', loginLimiter, validate(loginSchema), h(c.login));
r.get('/me', authenticate, h(c.me));
export default r;
