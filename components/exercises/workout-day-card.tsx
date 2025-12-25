import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseDifficulty, ExerciseLocation, WorkoutDay } from '@/types';
import { Alert, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface WorkoutDayCardProps {
  day: WorkoutDay;
  dayExercises: Exercise[];
  onPress: () => void;
}

export function WorkoutDayCard({ day, dayExercises, onPress }: WorkoutDayCardProps) {
  const iconColor = useThemeColor({}, 'icon');
  const isLocked = !day.unlocked;

  const handlePress = () => {
    if (isLocked) {
      Alert.alert(
        'День заблоковано',
        `Завершіть день ${day.dayNumber - 1}, щоб розблокувати цей день.`,
        [{ text: 'ОК' }],
      );
    } else {
      onPress();
    }
  };

  const difficulties = dayExercises
    .map((e) => e.difficulty)
    .filter((d): d is ExerciseDifficulty => d !== undefined);
  const uniqueDifficulties = [...new Set(difficulties)];
  const locations = dayExercises
    .map((e) => e.location)
    .filter((l): l is ExerciseLocation => l !== undefined);
  const uniqueLocations = [...new Set(locations)];

  return (
    <TouchableOpacity
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
      onPress={handlePress}>
      <ThemedView
        style={[
          styles.dayCard,
          day.completed && styles.dayCardCompleted,
          isLocked && styles.dayCardLocked,
        ]}>
        <ThemedView style={styles.dayHeader}>
          <ThemedView style={styles.dayInfo}>
            <ThemedView style={styles.dayNameRow}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.dayName, isLocked && styles.dayNameLocked]}>
                {day.name}
              </ThemedText>
              {isLocked && <IconSymbol size={20} name="lock.fill" color={iconColor} />}
            </ThemedView>
            <ThemedText
              style={[
                styles.dayExercisesCount,
                isLocked && styles.dayExercisesCountLocked,
              ]}>
              {isLocked
                ? 'Заблоковано'
                : `${dayExercises.length} ${
                    dayExercises.length === 1 ? 'вправа' : 'вправ'
                  }`}
            </ThemedText>
            {!isLocked && dayExercises.length > 0 && (
              <ThemedView style={styles.dayTags}>
                {uniqueDifficulties.length > 0 && (
                  <ThemedView style={styles.dayTag}>
                    <ThemedText style={styles.dayTagText}>
                      {uniqueDifficulties[0] === 'beginner'
                        ? 'Початковий'
                        : uniqueDifficulties[0] === 'intermediate'
                        ? 'Середній'
                        : 'Просунутий'}
                    </ThemedText>
                  </ThemedView>
                )}
                {uniqueLocations.length > 0 && (
                  <ThemedView style={styles.dayTag}>
                    <ThemedText style={styles.dayTagText}>
                      {uniqueLocations[0] === 'gym'
                        ? 'Зал'
                        : uniqueLocations[0] === 'home'
                        ? 'Дома'
                        : uniqueLocations[0] === 'outdoor'
                        ? 'На вулиці'
                        : 'Будь-де'}
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            )}
          </ThemedView>
          {day.completed && !isLocked && (
            <IconSymbol size={24} name="checkmark.circle.fill" color="#4CAF50" />
          )}
        </ThemedView>
        {dayExercises.length > 0 && (
          <ThemedView style={styles.dayExercisesPreview}>
            {dayExercises.slice(0, 3).map((exercise) => (
              <ThemedView key={exercise.id} style={styles.dayExerciseBadge}>
                <ThemedText style={styles.dayExerciseBadgeText}>{exercise.name}</ThemedText>
              </ThemedView>
            ))}
            {dayExercises.length > 3 && (
              <ThemedText style={styles.dayMoreExercises}>
                +{String(dayExercises.length - 3)} ще
              </ThemedText>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

