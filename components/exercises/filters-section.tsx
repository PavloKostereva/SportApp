import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ExerciseDifficulty, ExerciseEquipment, ExerciseLocation } from '@/types';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface FiltersSectionProps {
  selectedDifficulty: ExerciseDifficulty | 'all';
  selectedLocation: ExerciseLocation | 'all';
  selectedEquipment: ExerciseEquipment | 'all';
  onDifficultyChange: (difficulty: ExerciseDifficulty | 'all') => void;
  onLocationChange: (location: ExerciseLocation | 'all') => void;
  onEquipmentChange: (equipment: ExerciseEquipment | 'all') => void;
  onClearFilters: () => void;
}

export function FiltersSection({
  selectedDifficulty,
  selectedLocation,
  selectedEquipment,
  onDifficultyChange,
  onLocationChange,
  onEquipmentChange,
  onClearFilters,
}: FiltersSectionProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.filtersContainer}>
      <ThemedText type="defaultSemiBold" style={styles.filtersTitle}>
        Фільтри
      </ThemedText>

      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterLabel}>Рівень складності</ThemedText>
        <ThemedView style={styles.filterGrid}>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                selectedDifficulty === level && { backgroundColor: tintColor },
              ]}
              onPress={() => onDifficultyChange(level)}>
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedDifficulty === level && { color: '#fff' },
                ]}>
                {level === 'all'
                  ? 'Всі'
                  : level === 'beginner'
                  ? 'Початковий'
                  : level === 'intermediate'
                  ? 'Середній'
                  : 'Просунутий'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterLabel}>Місце тренування</ThemedText>
        <ThemedView style={styles.filterGrid}>
          {(['all', 'gym', 'home', 'outdoor', 'anywhere'] as const).map((location) => (
            <TouchableOpacity
              key={location}
              style={[
                styles.filterChip,
                selectedLocation === location && { backgroundColor: tintColor },
              ]}
              onPress={() => onLocationChange(location)}>
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedLocation === location && { color: '#fff' },
                ]}>
                {location === 'all'
                  ? 'Всі'
                  : location === 'gym'
                  ? 'Зал'
                  : location === 'home'
                  ? 'Дома'
                  : location === 'outdoor'
                  ? 'На вулиці'
                  : 'Будь-де'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterLabel}>Інвентар</ThemedText>
        <ThemedView style={styles.filterGrid}>
          {(
            [
              'all',
              'bodyweight',
              'dumbbells',
              'barbell',
              'machine',
              'cable',
              'resistance-band',
              'kettlebell',
              'none',
            ] as const
          ).map((equipment) => (
            <TouchableOpacity
              key={equipment}
              style={[
                styles.filterChip,
                selectedEquipment === equipment && { backgroundColor: tintColor },
              ]}
              onPress={() => onEquipmentChange(equipment)}>
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedEquipment === equipment && { color: '#fff' },
                ]}>
                {equipment === 'all'
                  ? 'Всі'
                  : equipment === 'bodyweight'
                  ? 'Власна вага'
                  : equipment === 'dumbbells'
                  ? 'Гантелі'
                  : equipment === 'barbell'
                  ? 'Штанга'
                  : equipment === 'machine'
                  ? 'Тренажер'
                  : equipment === 'cable'
                  ? 'Трос'
                  : equipment === 'resistance-band'
                  ? 'Резинка'
                  : equipment === 'kettlebell'
                  ? 'Гиря'
                  : 'Без інвентаря'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        style={[styles.clearFiltersButton, { borderColor: tintColor }]}
        onPress={onClearFilters}>
        <ThemedText style={[styles.clearFiltersText, { color: tintColor }]}>
          Скинути фільтри
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

