import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory, WorkoutDay } from '@/types';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface AddExerciseToDayModalProps {
  visible: boolean;
  day: WorkoutDay | null;
  availableExercises: Exercise[];
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onAddExercise: (exerciseId: string) => void;
}

export function AddExerciseToDayModal({
  visible,
  day,
  availableExercises,
  getCategoryName,
  onClose,
  onAddExercise,
}: AddExerciseToDayModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  if (!day) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              Додати вправу до {day?.name}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.exercisesList}>
            {availableExercises.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>Всі вправи вже додані до цього дня</ThemedText>
              </ThemedView>
            ) : (
              availableExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseSelectCard}
                  onPress={() => onAddExercise(exercise.id)}>
                  <ThemedView style={styles.exerciseSelectHeader}>
                    <IconSymbol
                      size={32}
                      name="figure.strengthtraining.traditional"
                      color={iconColor}
                      style={styles.exerciseIcon}
                    />
                    <ThemedView style={styles.exerciseSelectInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
                        {exercise.name || ''}
                      </ThemedText>
                      <ThemedText style={styles.exerciseCategory}>
                        {getCategoryName(exercise.category) || ''}
                      </ThemedText>
                    </ThemedView>
                    <IconSymbol size={24} name="plus.circle.fill" color={tintColor} />
                  </ThemedView>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
