import type { RequestHandler } from 'express';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SellerRegisterInput,
} from '@adulis/shared';
import { authService } from '../services/auth.service.js';
import { clearAuthCookie, setAuthCookie } from '../services/cookies.service.js';

export const authController = {
  register: (async (req, res) => {
    const input = req.body as RegisterInput;
    const { user } = await authService.register(input);
    res.status(201).json({ user });
  }) as RequestHandler,

  registerSeller: (async (req, res) => {
    const input = req.body as SellerRegisterInput;
    const result = await authService.registerSeller(input);
    res.status(201).json(result);
  }) as RequestHandler,

  login: (async (req, res) => {
    const input = req.body as LoginInput;
    const { user, token } = await authService.login(input);
    setAuthCookie(res, token);
    res.json({ user, token });
  }) as RequestHandler,

  logout: (async (_req, res) => {
    clearAuthCookie(res);
    res.json({ ok: true });
  }) as RequestHandler,

  me: (async (req, res) => {
    const user = await authService.getMe(req.user!.sub);
    res.json({ user });
  }) as RequestHandler,

  updateMe: (async (req, res) => {
    const input = req.body as { name?: string; phone?: string; avatarUrl?: string };
    const user = await authService.updateMe(req.user!.sub, input);
    res.json({ user });
  }) as RequestHandler,

  forgotPassword: (async (req, res) => {
    const input = req.body as ForgotPasswordInput;
    const result = await authService.forgotPassword(input);
    res.json(result);
  }) as RequestHandler,

  resetPassword: (async (req, res) => {
    const input = req.body as ResetPasswordInput;
    await authService.resetPassword(input);
    res.json({ ok: true });
  }) as RequestHandler,
};
