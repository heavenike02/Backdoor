'use client';

import { z } from 'zod';
import BankLinkPage from './page';

interface LayoutProps {
  children: React.ReactNode;
  params: object;
  navbar: boolean;
}

const paramsSchema = z.object({
  organizationId: z.string(),
});

export default function Layout({ children, params, navbar }: LayoutProps) {
  const { organizationId } = paramsSchema.parse(params);

  return <BankLinkPage />;
}
