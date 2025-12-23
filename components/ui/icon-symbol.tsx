// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'figure.strengthtraining.traditional': 'fitness-center',
  'flame.fill': 'local-fire-department',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'person.fill': 'person',
  'person.circle.fill': 'account-circle',
  'star.fill': 'star',
  'trophy.fill': 'emoji-events',
  'medal.fill': 'military-tech',
  'sunrise.fill': 'wb-sunny',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
  'figure.run': 'directions-run',
  'bell.fill': 'notifications',
  'speaker.wave.2.fill': 'volume-up',
  'ruler.fill': 'straighten',
  'info.circle.fill': 'info',
  'paintbrush.fill': 'brush',
  'questionmark.circle.fill': 'help',
  'envelope.fill': 'email',
  'lock.shield.fill': 'lock',
  'gearshape.fill': 'settings',
  target: 'gps-fixed',
  'heart.fill': 'favorite',
  'arrow.down.circle.fill': 'download',
  'arrow.up.circle.fill': 'upload',
  'icloud.fill': 'cloud',
  'key.fill': 'vpn-key',
  'chart.bar.fill': 'bar-chart',
  globe: 'language',
  'arrow.clockwise': 'refresh',
  'equal.circle.fill': 'drag-handle',
  'plus.circle.fill': 'add-circle',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  pencil: 'edit',
  'trash.fill': 'delete',
  timer: 'timer',
  'list.bullet': 'list',
  'arrow.triangle.2.circlepath': 'swap-horiz',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
