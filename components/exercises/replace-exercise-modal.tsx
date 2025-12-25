import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory, WorkoutDay } from '@/types';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface ReplaceExerciseModalProps {
  visible: boolean;
  day: WorkoutDay | null;
  exerciseToReplace: Exercise | null;
  availableExercises: Exercise[];
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onReplace: (oldExerciseId: string, newExerciseId: string) => void;
}

export function ReplaceExerciseModal({
  visible,
  day,
  exerciseToReplace,
  availableExercises,
  getCategoryName,
  onClose,
  onReplace,
}: ReplaceExerciseModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Modal
      visible={visible && exerciseToReplace !== null && day !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              Замінити "{exerciseToReplace?.name}"
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.exercisesList}>
            {availableExercises.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>Немає доступних вправ для заміни</ThemedText>
              </ThemedView>
            ) : (
              availableExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseSelectCard}
                  onPress={() => {
                    if (exerciseToReplace) {
                      onReplace(exerciseToReplace.id, exercise.id);
                    }
                  }}>
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
                    <IconSymbol size={24} name="arrow.triangle.2.circlepath" color={tintColor} />
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
