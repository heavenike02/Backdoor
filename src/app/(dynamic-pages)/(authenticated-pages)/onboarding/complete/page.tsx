import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';
import { getUserType } from '@/data/user/user';
import { redirect } from 'next/navigation';

export default async function OnboardingCompletePage() {
  const user = await serverGetLoggedInUser();
  const userType = await getUserType(user.id);

  if (userType === 'tenant') {
    redirect('/tenant/dashboard');
  } else {
    redirect('/dashboard');
  }
}
