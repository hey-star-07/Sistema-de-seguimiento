import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import * as repo from './auth.repository.js';

const sign = user => jwt.sign({ role: user.role }, env.jwtSecret, { subject: user.id, expiresIn: env.jwtExpiresIn });

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await repo.findByEmail(email);
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new AppError(401, 'Correo o contraseña incorrectos');
  const { passwordHash, ...safe } = user;
  res.json({ token: sign(user), user: safe });
}

export async function me(req, res) {
  const user = await repo.findById(req.user.id);
  if (!user) throw new AppError(401, 'Usuario no encontrado');
  res.json(user);
}
