import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useNutrition } from '@/contexts/nutrition-context';
import { useUser } from '@/contexts/user-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FoodEntry, NutritionRecommendation } from '@/types/nutrition';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const mealIcons: Record<string, string> = {
  breakfast: 'sunrise.fill',
  lunch: 'sun.max.fill',
  dinner: 'moon.fill',
  snack: 'cup.and.saucer.fill',
};

const mealLabels: Record<string, string> = {
  breakfast: 'Сніданок',
  lunch: 'Обід',
  dinner: 'Вечеря',
  snack: 'Перекус',
};

function getRecommendations(
  consumed: number,
  goal: number,
  protein: number,
  proteinGoal: number,
  carbs: number,
  carbsGoal: number,
  fat: number,
  fatGoal: number,
): NutritionRecommendation[] {
  const recommendations: NutritionRecommendation[] = [];
  const remaining = goal - consumed;

  if (remaining < -200) {
    recommendations.push({
      type: 'warning',
      message: 'Ви перевищили денну норму калорій. Рекомендуємо збільшити фізичну активність.',
      icon: 'exclamationmark.triangle.fill',
    });
  } else if (remaining < 0) {
    recommendations.push({
      type: 'warning',
      message: 'Ви майже досягли денної норми калорій. Будьте обережні з наступними прийомами їжі.',
      icon: 'exclamationmark.circle.fill',
    });
  } else if (remaining < 300) {
    recommendations.push({
      type: 'info',
      message: 'У вас залишилось мало калорій на сьогодні. Виберіть легкі та корисні продукти.',
      icon: 'info.circle.fill',
    });
  } else if (consumed < goal * 0.5) {
    recommendations.push({
      type: 'suggestion',
      message: 'Ви спожили менше половини денної норми. Не забувайте про регулярні прийоми їжі!',
      icon: 'lightbulb.fill',
    });
  }

  if (protein < proteinGoal * 0.7) {
    recommendations.push({
      type: 'suggestion',
      message: `Додайте більше білків. Залишилось ${Math.round(
        proteinGoal - protein,
      )}г. Спробуйте куряче філе, яйця або творог.`,
      icon: 'leaf.fill',
    });
  }

  if (carbs < carbsGoal * 0.5) {
    recommendations.push({
      type: 'info',
      message: `Вам потрібно більше вуглеводів для енергії. Залишилось ${Math.round(
        carbsGoal - carbs,
      )}г.`,
      icon: 'bolt.fill',
    });
  }

  if (fat < fatGoal * 0.5) {
    recommendations.push({
      type: 'info',
      message: `Додайте корисні жири. Залишилось ${Math.round(
        fatGoal - fat,
      )}г. Спробуйте авокадо або горіхи.`,
      icon: 'drop.fill',
    });
  }

  if (protein >= proteinGoal && carbs >= carbsGoal * 0.8 && fat >= fatGoal * 0.8 && remaining > 0) {
    recommendations.push({
      type: 'success',
      message: 'Відмінно! Ви добре збалансували своє харчування сьогодні!',
      icon: 'checkmark.circle.fill',
    });
  }

  return recommendations;
}

function groupEntriesByMeal(entries: FoodEntry[]) {
  const grouped: Record<string, FoodEntry[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

  entries.forEach((entry) => {
    if (grouped[entry.mealType]) {
      grouped[entry.mealType].push(entry);
    }
  });

  return grouped;
}

export default function CaloriesScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const router = useRouter();

  const { dailyNutrition, goal, removeFoodEntry } = useNutrition();
  const { userData } = useUser();

  const consumed = dailyNutrition?.totalCalories || 0;
  const burned = dailyNutrition?.burnedCalories || 0;
  const remaining = goal.dailyCalories - consumed + burned;

  const mealsGrouped = useMemo(() => {
    if (!dailyNutrition) return {};
    return groupEntriesByMeal(dailyNutrition.entries);
  }, [dailyNutrition]);

  const recommendations = useMemo(() => {
    if (!dailyNutrition) return [];
    return getRecommendations(
      consumed,
      goal.dailyCalories,
      dailyNutrition.totalProtein,
      goal.protein,
      dailyNutrition.totalCarbs,
      goal.carbs,
      dailyNutrition.totalFat,
      goal.fat,
    );
  }, [consumed, goal, dailyNutrition]);

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert('Видалити продукт?', 'Ви впевнені, що хочете видалити цей продукт?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          await removeFoodEntry(entryId);
        },
      },
    ]);
  };

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
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={() => router.push('/(tabs)/add-food')}
          activeOpacity={0.8}>
          <IconSymbol size={20} name="plus" color="#fff" />
        </TouchableOpacity>
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
            style={[
              styles.progressFill,
              {
                width: `${Math.min((consumed / goal.dailyCalories) * 100, 100)}%`,
                backgroundColor: consumed > goal.dailyCalories ? '#FF6B6B' : tintColor,
              },
            ]}
          />
        </ThemedView>
        <ThemedText style={styles.goalText}>Мета: {goal.dailyCalories} ккал</ThemedText>

        <ThemedView style={styles.macrosContainer}>
          <ThemedView style={styles.macroItem}>
            <ThemedText style={styles.macroLabel}>Білки</ThemedText>
            <ThemedText style={styles.macroValue}>
              {dailyNutrition?.totalProtein.toFixed(1) || 0} / {goal.protein}г
            </ThemedText>
            <ThemedView style={styles.macroBar}>
              <ThemedView
                style={[
                  styles.macroBarFill,
                  {
                    width: `${Math.min(
                      ((dailyNutrition?.totalProtein || 0) / goal.protein) * 100,
                      100,
                    )}%`,
                    backgroundColor: '#4CAF50',
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.macroItem}>
            <ThemedText style={styles.macroLabel}>Вуглеводи</ThemedText>
            <ThemedText style={styles.macroValue}>
              {dailyNutrition?.totalCarbs.toFixed(1) || 0} / {goal.carbs}г
            </ThemedText>
            <ThemedView style={styles.macroBar}>
              <ThemedView
                style={[
                  styles.macroBarFill,
                  {
                    width: `${Math.min(
                      ((dailyNutrition?.totalCarbs || 0) / goal.carbs) * 100,
                      100,
                    )}%`,
                    backgroundColor: '#FF9800',
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.macroItem}>
            <ThemedText style={styles.macroLabel}>Жири</ThemedText>
            <ThemedText style={styles.macroValue}>
              {dailyNutrition?.totalFat.toFixed(1) || 0} / {goal.fat}г
            </ThemedText>
            <ThemedView style={styles.macroBar}>
              <ThemedView
                style={[
                  styles.macroBarFill,
                  {
                    width: `${Math.min(((dailyNutrition?.totalFat || 0) / goal.fat) * 100, 100)}%`,
                    backgroundColor: '#2196F3',
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {recommendations.length > 0 && (
        <ThemedView style={styles.recommendationsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Рекомендації
          </ThemedText>
          {recommendations.map((rec, index) => (
            <ThemedView
              key={index}
              style={[
                styles.recommendationCard,
                {
                  backgroundColor:
                    rec.type === 'warning'
                      ? '#FFF3E0'
                      : rec.type === 'success'
                      ? '#E8F5E9'
                      : rec.type === 'suggestion'
                      ? '#E3F2FD'
                      : '#F5F5F5',
                  borderColor:
                    rec.type === 'warning'
                      ? '#FF9800'
                      : rec.type === 'success'
                      ? '#4CAF50'
                      : rec.type === 'suggestion'
                      ? '#2196F3'
                      : borderColor,
                },
              ]}>
              <IconSymbol
                size={24}
                name={rec.icon as any}
                color={
                  rec.type === 'warning'
                    ? '#FF9800'
                    : rec.type === 'success'
                    ? '#4CAF50'
                    : rec.type === 'suggestion'
                    ? '#2196F3'
                    : iconColor
                }
              />
              <ThemedText style={styles.recommendationText}>{rec.message}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Прийоми їжі
      </ThemedText>
      <ScrollView style={styles.list}>
        {Object.entries(mealsGrouped).map(([mealType, entries]) => {
          if (entries.length === 0) return null;
          const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
          return (
            <ThemedView key={mealType} style={styles.mealSection}>
              <ThemedView style={styles.mealHeader}>
                <IconSymbol
                  size={24}
                  name={mealIcons[mealType] as any}
                  color={iconColor}
                  style={styles.mealIcon}
                />
                <ThemedText type="defaultSemiBold" style={styles.mealTitle}>
                  {mealLabels[mealType]}
                </ThemedText>
                <ThemedText style={styles.mealCalories}>{totalCalories} ккал</ThemedText>
              </ThemedView>
              {entries.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={[styles.itemCard, { borderColor }]}
                  onLongPress={() => handleDeleteEntry(entry.id)}
                  activeOpacity={0.7}>
                  <ThemedView style={styles.itemContent}>
                    <ThemedText type="defaultSemiBold" style={styles.itemName}>
                      {entry.productName}
                    </ThemedText>
                    <ThemedText style={styles.itemDetails}>
                      {entry.amount.toFixed(0)}
                      {entry.productName.includes('г') ? 'г' : 'шт'}
                    </ThemedText>
                    <ThemedText style={styles.itemCalories}>{entry.calories} ккал</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.itemMacros}>
                    <ThemedText style={styles.itemMacroText}>
                      Б: {entry.protein.toFixed(1)}
                    </ThemedText>
                    <ThemedText style={styles.itemMacroText}>
                      В: {entry.carbs.toFixed(1)}
                    </ThemedText>
                    <ThemedText style={styles.itemMacroText}>Ж: {entry.fat.toFixed(1)}</ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          );
        })}
        {dailyNutrition?.entries.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>Немає записів про їжу</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Натисніть кнопку + щоб додати продукт
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  goalText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  macrosContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  macroItem: {
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  macroBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  macroBarFill: {
    height: '100%',
  },
  recommendationsContainer: {
    marginBottom: 24,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  mealSection: {
    marginBottom: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  mealIcon: {
    marginRight: 4,
  },
  mealTitle: {
    flex: 1,
    fontSize: 18,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  itemCalories: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  itemMacroText: {
    fontSize: 11,
    opacity: 0.6,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
