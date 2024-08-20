'use client';
import { z } from 'zod';
import BankSelectorPage from './institutions';

interface LayoutProps {
  params: object;
}

const paramsSchema = z.object({
  organizationId: z.string(),
});

export default function Layout({ params }: LayoutProps) {
  const { organizationId } = paramsSchema.parse(params);
  const coookie = document.cookie = `organizationId=${organizationId}; path=/`;
  return <BankSelectorPage />;
}
