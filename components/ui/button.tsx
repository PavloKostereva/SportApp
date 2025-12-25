import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: tintColor };
      case 'secondary':
        return { ...baseStyle, backgroundColor: borderColor };
      case 'outline':
        return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 2, borderColor: tintColor };
      case 'danger':
        return { ...baseStyle, backgroundColor: '#FF6B6B' };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    if (variant === 'outline') return tintColor;
    if (variant === 'danger') return '#fff';
    return variant === 'primary' ? '#fff' : iconColor;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && <ThemedText style={{ color: getTextColor() }}>{icon}</ThemedText>}
          <ThemedText
            style={[
              styles.buttonText,
              {
                color: getTextColor(),
              },
            ]}>
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

