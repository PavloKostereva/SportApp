import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  Exercise,
  ExerciseCategory,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseLocation,
} from '@/types';
import { Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface ExerciseFormData {
  name: string;
  category: ExerciseCategory;
  sets: string;
  reps: string;
  weight: string;
  restTime: string;
  difficulty: ExerciseDifficulty | '';
  location: ExerciseLocation | '';
  equipment: ExerciseEquipment[];
}

interface ExerciseFormModalProps {
  visible: boolean;
  editingExercise: Exercise | null;
  formData: ExerciseFormData;
  categories: ExerciseCategory[];
  getCategoryName: (category: ExerciseCategory) => string;
  onClose: () => void;
  onFormDataChange: (data: Partial<ExerciseFormData>) => void;
  onSubmit: () => void;
}

export function ExerciseFormModal({
  visible,
  editingExercise,
  formData,
  categories,
  getCategoryName,
  onClose,
  onFormDataChange,
  onSubmit,
}: ExerciseFormModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              {editingExercise ? 'Редагувати вправу' : 'Додати вправу'}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.modalForm}>
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Назва вправи *</ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                ]}
                placeholder="Наприклад: Присідання"
                placeholderTextColor={iconColor + '80'}
                value={formData.name}
                onChangeText={(text) => onFormDataChange({ name: text })}
              />
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Категорія *</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category && {
                        backgroundColor: tintColor,
                      },
                    ]}
                    onPress={() => onFormDataChange({ category })}>
                    <ThemedText
                      style={[
                        styles.categoryOptionText,
                        formData.category === category && { color: '#fff' },
                      ]}>
                      {getCategoryName(category)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.formRow}>
              <ThemedView style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.formLabel}>Підходи *</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="3"
                  placeholderTextColor={iconColor + '80'}
                  value={formData.sets}
                  onChangeText={(text) => onFormDataChange({ sets: text })}
                  keyboardType="numeric"
                />
              </ThemedView>
              <ThemedView style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.formLabel}>Повторення *</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="12"
                  placeholderTextColor={iconColor + '80'}
                  value={formData.reps}
                  onChangeText={(text) => onFormDataChange({ reps: text })}
                  keyboardType="numeric"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.formRow}>
              <ThemedView style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.formLabel}>Вага (кг)</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="60"
                  placeholderTextColor={iconColor + '80'}
                  value={formData.weight}
                  onChangeText={(text) => onFormDataChange({ weight: text })}
                  keyboardType="numeric"
                />
              </ThemedView>
              <ThemedView style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.formLabel}>Відпочинок (сек)</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="60"
                  placeholderTextColor={iconColor + '80'}
                  value={formData.restTime}
                  onChangeText={(text) => onFormDataChange({ restTime: text })}
                  keyboardType="numeric"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Рівень складності</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['beginner', 'intermediate', 'advanced'] as ExerciseDifficulty[]).map(
                  (difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.categoryOption,
                        formData.difficulty === difficulty && {
                          backgroundColor: tintColor,
                        },
                      ]}
                      onPress={() =>
                        onFormDataChange({ difficulty: difficulty as ExerciseDifficulty })
                      }>
                      <ThemedText
                        style={[
                          styles.categoryOptionText,
                          formData.difficulty === difficulty && { color: '#fff' },
                        ]}>
                        {difficulty === 'beginner'
                          ? 'Початковий'
                          : difficulty === 'intermediate'
                          ? 'Середній'
                          : 'Просунутий'}
                      </ThemedText>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Місце тренування</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['gym', 'home', 'outdoor', 'anywhere'] as ExerciseLocation[]).map(
                  (location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.categoryOption,
                        formData.location === location && {
                          backgroundColor: tintColor,
                        },
                      ]}
                      onPress={() =>
                        onFormDataChange({ location: location as ExerciseLocation })
                      }>
                      <ThemedText
                        style={[
                          styles.categoryOptionText,
                          formData.location === location && { color: '#fff' },
                        ]}>
                        {location === 'gym'
                          ? 'Зал'
                          : location === 'home'
                          ? 'Дома'
                          : location === 'outdoor'
                          ? 'На вулиці'
                          : 'Будь-де'}
                      </ThemedText>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Інвентар (можна вибрати кілька)</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(
                  [
                    'bodyweight',
                    'dumbbells',
                    'barbell',
                    'machine',
                    'cable',
                    'resistance-band',
                    'kettlebell',
                  ] as ExerciseEquipment[]
                ).map((equip) => {
                  const isSelected = formData.equipment.includes(equip);
                  return (
                    <TouchableOpacity
                      key={equip}
                      style={[
                        styles.categoryOption,
                        isSelected && {
                          backgroundColor: tintColor,
                        },
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          onFormDataChange({
                            equipment: formData.equipment.filter((e) => e !== equip),
                          });
                        } else {
                          onFormDataChange({
                            equipment: [...formData.equipment, equip],
                          });
                        }
                      }}>
                      <ThemedText
                        style={[styles.categoryOptionText, isSelected && { color: '#fff' }]}>
                        {equip === 'bodyweight'
                          ? 'Власна вага'
                          : equip === 'dumbbells'
                          ? 'Гантелі'
                          : equip === 'barbell'
                          ? 'Штанга'
                          : equip === 'machine'
                          ? 'Тренажер'
                          : equip === 'cable'
                          ? 'Трос'
                          : equip === 'resistance-band'
                          ? 'Резинка'
                          : 'Гиря'}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </ThemedView>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={onSubmit}>
              <ThemedText style={styles.saveButtonText}>
                {editingExercise ? 'Зберегти зміни' : 'Додати вправу'}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

