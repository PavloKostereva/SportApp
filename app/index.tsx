import { Redirect } from 'expo-router';
import { useUser } from '@/contexts/user-context';

export default function Index() {
  const { userData } = useUser();

  if (!userData.hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/exercises" />;
}

