import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory, WorkoutDay } from '@/types';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface DayModalProps {
  visible: boolean;
  day: WorkoutDay | null;
  dayExercises: Exercise[];
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onEditName: () => void;
  onStartWorkout: () => void;
  onAddExercise: () => void;
  onCompleteDay: () => void;
  onUncompleteDay: () => void;
  onExercisePress: (exercise: Exercise) => void;
  onReplaceExercise: (exercise: Exercise) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

export function DayModal({
  visible,
  day,
  dayExercises,
  getCategoryName,
  onClose,
  onEditName,
  onStartWorkout,
  onAddExercise,
  onCompleteDay,
  onUncompleteDay,
  onExercisePress,
  onReplaceExercise,
  onRemoveExercise,
}: DayModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  if (!day || !day.unlocked) return null;

  const totalSets = dayExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalReps = dayExercises.reduce((sum, ex) => sum + ex.reps * ex.sets, 0);
  const totalWeight = dayExercises.reduce((sum, ex) => sum + (ex.weight || 0) * ex.sets, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedView style={styles.dayModalHeader}>
              <ThemedView style={styles.dayTitleRow}>
                <ThemedText type="title" style={styles.modalTitle}>
                  {day.name}
                </ThemedText>
                <TouchableOpacity onPress={onEditName}>
                  <IconSymbol size={20} name="pencil" color={iconColor} />
                </TouchableOpacity>
              </ThemedView>
              {day.completed && day.date && (
                <ThemedView style={styles.completedBadge}>
                  <IconSymbol size={20} name="checkmark.circle.fill" color="#4CAF50" />
                  <ThemedText style={styles.completedText}>
                    Завершено {new Date(day.date).toLocaleDateString('uk-UA')}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          {dayExercises.length > 0 && (
            <ThemedView style={styles.dayStats}>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Вправ</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {dayExercises.length}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Підходів</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {totalSets}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Повторень</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {totalReps}
                </ThemedText>
              </ThemedView>
              {totalWeight > 0 && (
                <ThemedView style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Вага (кг)</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.statValue}>
                    {totalWeight.toFixed(0)}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          )}

          <ScrollView style={styles.dayExercisesList}>
            {dayExercises.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>Немає вправ у цьому дні</ThemedText>
                <ThemedText style={styles.emptySubtext}>Додайте вправи зі списку</ThemedText>
              </ThemedView>
            ) : (
              dayExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  activeOpacity={0.7}
                  onPress={() => onExercisePress(exercise)}>
                  <ThemedView style={styles.dayExerciseCard}>
                    <ThemedView style={styles.dayExerciseHeader}>
                      <IconSymbol
                        size={32}
                        name="figure.strengthtraining.traditional"
                        color={iconColor}
                        style={styles.exerciseIcon}
                      />
                      <ThemedView style={styles.dayExerciseInfo}>
                        <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
                          {exercise.name || ''}
                        </ThemedText>
                        <ThemedText style={styles.exerciseCategory}>
                          {getCategoryName(exercise.category) || ''}
                        </ThemedText>
                      </ThemedView>
                      {!day.completed && (
                        <ThemedView style={styles.exerciseActionsRow}>
                          <TouchableOpacity
                            style={styles.replaceExerciseButton}
                            onPress={() => onReplaceExercise(exercise)}>
                            <IconSymbol
                              size={20}
                              name="arrow.triangle.2.circlepath"
                              color={iconColor}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.removeExerciseButton}
                            onPress={() => onRemoveExercise(exercise.id)}>
                            <IconSymbol size={20} name="trash.fill" color="#FF6B6B" />
                          </TouchableOpacity>
                        </ThemedView>
                      )}
                    </ThemedView>
                    <ThemedView style={styles.exerciseDetails}>
                      <ThemedView style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Підходи</ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={[styles.detailValue, { marginLeft: 6 }]}>
                          {String(exercise.sets)}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={[styles.detailItem, { marginLeft: 16 }]}>
                        <ThemedText style={styles.detailLabel}>Повторення</ThemedText>
                        <ThemedText
                          type="defaultSemiBold"
                          style={[styles.detailValue, { marginLeft: 6 }]}>
                          {String(exercise.reps)}
                        </ThemedText>
                      </ThemedView>
                      {exercise.weight && (
                        <ThemedView style={[styles.detailItem, { marginLeft: 16 }]}>
                          <ThemedText style={styles.detailLabel}>Вага</ThemedText>
                          <ThemedText
                            type="defaultSemiBold"
                            style={[styles.detailValue, { marginLeft: 6 }]}>
                            {String(exercise.weight)} кг
                          </ThemedText>
                        </ThemedView>
                      )}
                    </ThemedView>
                  </ThemedView>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <ThemedView style={styles.dayModalActions}>
            {!day.completed ? (
              <>
                {dayExercises.length > 0 && (
                  <TouchableOpacity
                    style={[styles.startWorkoutButton, { backgroundColor: tintColor }]}
                    onPress={onStartWorkout}>
                    <IconSymbol size={24} name="figure.run" color="#fff" />
                    <ThemedText style={styles.startWorkoutButtonText}>Почати тренування</ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.addExerciseToDayButton, { borderColor: tintColor }]}
                  onPress={onAddExercise}
                  activeOpacity={0.7}>
                  <IconSymbol size={20} name="plus.circle.fill" color={tintColor} />
                  <ThemedText style={[styles.addExerciseToDayText, { color: tintColor }]}>
                    Додати вправу
                  </ThemedText>
                </TouchableOpacity>
                {dayExercises.length > 0 && (
                  <TouchableOpacity
                    style={[styles.completeButton, { backgroundColor: tintColor }]}
                    onPress={onCompleteDay}>
                    <ThemedText style={styles.completeButtonText}>Завершити тренування</ThemedText>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={[styles.uncompleteButton, { borderColor: tintColor }]}
                onPress={onUncompleteDay}>
                <IconSymbol size={20} name="arrow.clockwise" color={tintColor} />
                <ThemedText style={[styles.uncompleteButtonText, { color: tintColor }]}>
                  Відмінити завершення
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
