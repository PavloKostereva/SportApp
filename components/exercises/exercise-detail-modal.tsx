import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory } from '@/types';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface ExerciseDetailModalProps {
  visible: boolean;
  exercise: Exercise | null;
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseDetailModal({
  visible,
  exercise,
  getCategoryName,
  onClose,
  onEdit,
  onDelete,
}: ExerciseDetailModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  if (!exercise) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedView style={styles.detailHeader}>
              <IconSymbol
                size={40}
                name="figure.strengthtraining.traditional"
                color={tintColor}
                style={styles.detailIcon}
              />
              <ThemedView style={styles.detailTitleContainer}>
                <ThemedText type="title" style={styles.detailTitle}>
                  {exercise.name}
                </ThemedText>
                <ThemedView style={styles.detailCategoryBadge}>
                  <ThemedText style={styles.detailCategoryText}>
                    {getCategoryName(exercise.category)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.detailContent}>
            <ThemedView style={styles.detailSection}>
              <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                Параметри тренування
              </ThemedText>
              <ThemedView style={styles.detailGrid}>
                <ThemedView style={styles.detailCard}>
                  <ThemedText style={styles.detailCardLabel}>Підходи</ThemedText>
                  <ThemedText type="title" style={styles.detailCardValue}>
                    {String(exercise.sets)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.detailCard}>
                  <ThemedText style={styles.detailCardLabel}>Повторення</ThemedText>
                  <ThemedText type="title" style={styles.detailCardValue}>
                    {String(exercise.reps)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {exercise.weight && (
              <ThemedView style={styles.detailSection}>
                <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                  Вага
                </ThemedText>
                <ThemedView style={styles.detailCard}>
                  <ThemedText style={styles.detailCardLabel}>Рекомендована вага</ThemedText>
                  <ThemedText type="title" style={styles.detailCardValue}>
                    {String(exercise.weight)} кг
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}

            {exercise.restTime && (
              <ThemedView style={styles.detailSection}>
                <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                  Відпочинок
                </ThemedText>
                <ThemedView style={styles.detailCard}>
                  <ThemedView style={styles.detailRow}>
                    <IconSymbol size={24} name="timer" color={tintColor} />
                    <ThemedView style={styles.detailRowText}>
                      <ThemedText style={styles.detailCardLabel}>
                        Час відпочинку між підходами
                      </ThemedText>
                      <ThemedText type="title" style={styles.detailCardValue}>
                        {String(exercise.restTime)} секунд
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            )}

            {exercise.notes && (
              <ThemedView style={styles.detailSection}>
                <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                  Нотатки
                </ThemedText>
                <ThemedView style={styles.detailCard}>
                  <ThemedText style={styles.detailNotes}>{exercise.notes}</ThemedText>
                </ThemedView>
              </ThemedView>
            )}

            <ThemedView style={styles.detailActions}>
              <TouchableOpacity
                style={[styles.detailActionButton, { borderColor: tintColor }]}
                onPress={onEdit}>
                <IconSymbol size={20} name="pencil" color={tintColor} />
                <ThemedText style={[styles.detailActionText, { color: tintColor }]}>
                  Редагувати
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.detailActionButton, { borderColor: '#FF6B6B' }]}
                onPress={onDelete}>
                <IconSymbol size={20} name="trash.fill" color="#FF6B6B" />
                <ThemedText style={[styles.detailActionText, { color: '#FF6B6B' }]}>
                  Видалити
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
