import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';
import { LoadingSpinner } from './loading-spinner';

interface LoadingOverlayProps {
  message?: string;
  visible: boolean;
}

export function LoadingOverlay({ message, visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <ThemedView style={styles.overlay}>
      <ThemedView style={styles.container}>
        <LoadingSpinner size="large" />
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});
