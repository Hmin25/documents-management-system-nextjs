import { z } from 'zod';

export const itemNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required.')
  .max(255, 'Name must be 255 characters or fewer.')
  .regex(/^[^/\\]+$/, 'Name cannot contain / or \\.');
