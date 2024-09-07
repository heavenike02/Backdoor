import { z } from 'zod';
import { Login } from './Login';
import { AuthLayout } from '@/components/Auth/auth-layout';

const SearchParamsSchema = z.object({
  next: z.string().optional(),
  nextActionType: z.string().optional(),
});




export default function LoginPage({ searchParams }: { searchParams: unknown }) {
  const { next, nextActionType } = SearchParamsSchema.parse(searchParams);

  return (
    <>
    <AuthLayout  link="/landlord/login" text="Log In as Landlord"> 
      
      <Login next={next} nextActionType={nextActionType}  />
      
      
    </AuthLayout>
    
    
    </>
  )
  
  
  
  
}
