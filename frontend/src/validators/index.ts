import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['spectator', 'volunteer', 'security', 'organizer'])
});

export const alertSchema = z.object({
  sector: z.string().min(1, 'Sector is required'),
  congestion_level: z.enum(['low', 'medium', 'high']),
  spectator_count: z.number().nonnegative(),
  capacity: z.number().positive(),
  message: z.string().optional()
});

export const incidentSchema = z.object({
  sector: z.string().min(1, 'Sector is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required')
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assigned_to: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed'])
});

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  language: z.string().default('en'),
  conversation_id: z.string().optional(),
  user_role: z.string().optional()
});
