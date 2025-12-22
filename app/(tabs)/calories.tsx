import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet } from 'react-native';

export default function CaloriesScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const dailyGoal = 2000;
  const consumed = 1450;
  const burned = 320;
  const remaining = dailyGoal - consumed + burned;

  const meals: Array<{
    id: number;
    name: string;
    calories: number;
    icon: 'sunrise.fill' | 'sun.max.fill' | 'moon.fill';
  }> = [
    { id: 1, name: 'Сніданок', calories: 450, icon: 'sunrise.fill' },
    { id: 2, name: 'Обід', calories: 650, icon: 'sun.max.fill' },
    { id: 3, name: 'Вечеря', calories: 350, icon: 'moon.fill' },
  ];

  const activities: Array<{
    id: number;
    name: string;
    calories: number;
    icon: 'figure.run' | 'figure.strengthtraining.traditional';
  }> = [
    { id: 1, name: 'Біг', calories: 180, icon: 'figure.run' },
    { id: 2, name: 'Тренування', calories: 140, icon: 'figure.strengthtraining.traditional' },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4ECDC4', dark: '#00695C' }}
      headerImage={
        <IconSymbol size={310} color="#FFFFFF" name="flame.fill" style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Калорії
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
          Сьогодні
        </ThemedText>
        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Спожито:</ThemedText>
          <ThemedText style={styles.summaryValue}>{consumed} ккал</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Спалено:</ThemedText>
          <ThemedText style={[styles.summaryValue, styles.burnedValue]}>{burned} ккал</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Залишилось:</ThemedText>
          <ThemedText
            style={[
              styles.summaryValue,
              remaining > 0 ? styles.remainingPositive : styles.remainingNegative,
            ]}>
            {remaining} ккал
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.progressBar}>
          <ThemedView
            style={[styles.progressFill, { width: `${(consumed / dailyGoal) * 100}%` }]}
          />
        </ThemedView>
        <ThemedText style={styles.goalText}>Мета: {dailyGoal} ккал</ThemedText>
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Прийоми їжі
      </ThemedText>
      <ScrollView style={styles.list}>
        {meals.map((meal) => (
          <ThemedView key={meal.id} style={styles.itemCard}>
            <IconSymbol size={24} name={meal.icon} color={iconColor} style={styles.itemIcon} />
            <ThemedView style={styles.itemContent}>
              <ThemedText type="defaultSemiBold">{meal.name}</ThemedText>
              <ThemedText style={styles.itemCalories}>{meal.calories} ккал</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Активність
      </ThemedText>
      <ScrollView style={styles.list}>
        {activities.map((activity) => (
          <ThemedView key={activity.id} style={styles.itemCard}>
            <IconSymbol size={24} name={activity.icon} color={iconColor} style={styles.itemIcon} />
            <ThemedView style={styles.itemContent}>
              <ThemedText type="defaultSemiBold">{activity.name}</ThemedText>
              <ThemedText style={[styles.itemCalories, styles.burnedValue]}>
                -{activity.calories} ккал
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  burnedValue: {
    color: '#4ECDC4',
  },
  remainingPositive: {
    color: '#4CAF50',
  },
  remainingNegative: {
    color: '#FF6B6B',
  },
  progressBar: {
    height: 8,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
  },
  goalText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCalories: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
