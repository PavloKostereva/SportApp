import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ size = 'large', color }: LoadingSpinnerProps) {
  const tintColor = useThemeColor({}, 'tint');
  return (
    <ActivityIndicator
      size={size}
      color={color || tintColor}
      style={styles.spinner}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    padding: 8,
  },
});

