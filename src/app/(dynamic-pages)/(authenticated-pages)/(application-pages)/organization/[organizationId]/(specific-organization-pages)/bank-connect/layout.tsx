'use client';
import { z } from 'zod';
import BankLinkPage from './page';

interface LayoutProps {
  params: object;
}

const paramsSchema = z.object({
  organizationId: z.string(),
});

export default function Layout({ params }: LayoutProps) {
  const { organizationId } = paramsSchema.parse(params);
  document.cookie = `organizationId=${organizationId}; path=/`;
  return <BankLinkPage />;
}
