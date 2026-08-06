import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export const requestInviteSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  portfolioUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  reason: z.string().min(10, { message: 'Please tell us why you want to join.' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RequestInviteInput = z.infer<typeof requestInviteSchema>;