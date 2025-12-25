import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory, WorkoutDay } from '@/types';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface WorkoutModeProps {
  visible: boolean;
  day: WorkoutDay | null;
  dayExercises: Exercise[];
  currentExerciseIndex: number;
  completedSets: Record<string, number>;
  startTimer: number | null;
  restTimer: number | null;
  workoutStarted: boolean;
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onSkipRest: () => void;
  onCompleteSet: (exerciseId: string) => void;
  onFinishWorkout: () => void;
}

export function WorkoutMode({
  visible,
  day,
  dayExercises,
  currentExerciseIndex,
  completedSets,
  startTimer,
  restTimer,
  workoutStarted,
  getCategoryName,
  onClose,
  onSkipRest,
  onCompleteSet,
  onFinishWorkout,
}: WorkoutModeProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  if (!day) return null;

  if (dayExercises.length === 0) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
        <ThemedView style={styles.workoutModeContainer}>
          <ThemedView style={styles.workoutHeader}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.workoutTitle}>
              {day.name}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>Немає вправ для тренування</ThemedText>
            <TouchableOpacity
              style={[styles.finishWorkoutButton, { backgroundColor: tintColor }]}
              onPress={onClose}
              activeOpacity={0.8}>
              <ThemedText style={styles.finishWorkoutButtonText}>Закрити</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    );
  }

  const currentExercise = dayExercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === dayExercises.length - 1;
  const currentCompletedSets = completedSets[currentExercise?.id || ''] || 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        Alert.alert('Завершити тренування?', 'Ви впевнені, що хочете вийти з режиму тренування?', [
          { text: 'Скасувати', style: 'cancel' },
          {
            text: 'Вийти',
            style: 'destructive',
            onPress: onClose,
          },
        ]);
      }}>
      <ThemedView style={styles.workoutModeContainer}>
        <ThemedView style={styles.workoutHeader}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Завершити тренування?', 'Ви впевнені, що хочете вийти?', [
                { text: 'Скасувати', style: 'cancel' },
                {
                  text: 'Вийти',
                  style: 'destructive',
                  onPress: onClose,
                },
              ]);
            }}
            activeOpacity={0.7}>
            <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.workoutTitle}>
            {day.name}
          </ThemedText>
          <ThemedView style={styles.workoutProgress}>
            <ThemedText style={styles.workoutProgressText}>
              {currentExerciseIndex + 1} / {dayExercises.length}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {startTimer !== null && startTimer > 0 ? (
          <ThemedView style={styles.startTimerContainer}>
            <ThemedText type="title" style={styles.startTimerLabel}>
              Готовність
            </ThemedText>
            <ThemedText type="title" style={[styles.startTimerValue, { color: tintColor }]}>
              {startTimer}
            </ThemedText>
          </ThemedView>
        ) : workoutStarted && currentExercise && dayExercises.length > 0 ? (
          <>
            {restTimer !== null && restTimer > 0 && (
              <ThemedView style={styles.restTimerBar}>
                <ThemedView style={styles.restTimerBarContent}>
                  <IconSymbol size={20} name="timer" color={tintColor} />
                  <ThemedText style={[styles.restTimerBarText, { color: tintColor }]}>
                    Відпочинок: {Math.floor(restTimer / 60)}:
                    {(restTimer % 60).toString().padStart(2, '0')}
                  </ThemedText>
                  <TouchableOpacity
                    style={[styles.skipRestBarButton, { backgroundColor: tintColor }]}
                    onPress={onSkipRest}
                    activeOpacity={0.7}>
                    <ThemedText style={styles.skipRestBarButtonText}>Пропустити</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            )}
            <ScrollView style={styles.workoutContent}>
              <ThemedView style={styles.workoutExerciseCard}>
                <ThemedText type="title" style={styles.workoutExerciseName}>
                  {currentExercise.name}
                </ThemedText>
                <ThemedText style={styles.workoutExerciseCategory}>
                  {getCategoryName(currentExercise.category)}
                </ThemedText>

                <ThemedView style={styles.workoutSetsInfo}>
                  <ThemedText style={styles.workoutSetsLabel}>
                    Підхід {Math.min(currentCompletedSets + 1, currentExercise.sets)} з{' '}
                    {currentExercise.sets}
                  </ThemedText>
                  <ThemedText style={styles.workoutRepsLabel}>
                    {currentExercise.reps} повторень
                    {currentExercise.weight ? ` × ${currentExercise.weight} кг` : ''}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.workoutSetsProgress}>
                  {Array.from({ length: currentExercise.sets }).map((_, index) => (
                    <ThemedView
                      key={index}
                      style={[
                        styles.workoutSetDot,
                        index < currentCompletedSets && { backgroundColor: tintColor },
                      ]}
                    />
                  ))}
                </ThemedView>

                <TouchableOpacity
                  style={[styles.completeSetButton, { backgroundColor: tintColor }]}
                  onPress={() => onCompleteSet(currentExercise.id)}
                  activeOpacity={0.8}>
                  <ThemedText style={styles.completeSetButtonText}>
                    {currentCompletedSets >= currentExercise.sets
                      ? 'Завершити вправу'
                      : 'Завершити підхід'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ScrollView>
          </>
        ) : workoutStarted ? (
          <ThemedView style={styles.workoutComplete}>
            <IconSymbol size={80} name="checkmark.circle.fill" color="#4CAF50" />
            <ThemedText type="title" style={styles.workoutCompleteText}>
              Тренування завершено!
            </ThemedText>
            <TouchableOpacity
              style={[styles.finishWorkoutButton, { backgroundColor: tintColor }]}
              onPress={onFinishWorkout}
              activeOpacity={0.8}>
              <ThemedText style={styles.finishWorkoutButtonText}>Готово</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : null}
      </ThemedView>
    </Modal>
  );
}
