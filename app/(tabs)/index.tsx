import { useUser } from '@/contexts/user-context';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const { userData } = useUser();

  useEffect(() => {
    if (!userData.hasCompletedOnboarding) {
    }
  }, [userData.hasCompletedOnboarding]);

  if (!userData.hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/exercises" />;
}
