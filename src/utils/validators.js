import { z } from 'zod';
import { QUESTION_DIFFICULTY, QUESTION_CATEGORIES } from './constants.js';

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  isCorrect: z.boolean().optional()
});

export const questionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(6),
  body: z.string().min(12),
  explanation: z.string().optional(),
  answer: z.string().optional(),
  options: z.array(optionSchema).optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(QUESTION_DIFFICULTY),
  category: z.enum(QUESTION_CATEGORIES),
  references: z.string().optional(),
  is_private: z.boolean(),
  status: z.string().optional()
});

export const questionSetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(4),
  description: z.string().optional(),
  is_private: z.boolean(),
  tags: z.array(z.string()).optional()
});
