import { z } from 'zod';

export const ApplicationSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  occupantsCount: z.number(),
  desiredMoveInDate: z.date(),
  applicationDate: z.date(),
  lastUpdated: z.date(),
});

export type Application = z.infer<typeof ApplicationSchema>;
