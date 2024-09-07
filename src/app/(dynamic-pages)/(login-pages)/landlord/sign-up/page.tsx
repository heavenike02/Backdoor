import { z } from 'zod';
import { SignUp } from './Signup';
import { AuthLayout } from '@/components/Auth/auth-layout';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
  nextActionType: z.string().optional(),
});

export default function SignupPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const { next, nextActionType } = SearchParamsSchema.parse(searchParams);
  return (
    <>
      <AuthLayout link="/tenant/sign-up" text="Sign Up as Tenant">
        <SignUp next={next} nextActionType={nextActionType} />
      </AuthLayout>
      
    </>
    
  );
}
