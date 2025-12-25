import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../app/(tabs)/exercises.styles';

interface EditDayModalProps {
  visible: boolean;
  dayName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function EditDayModal({ visible, dayName, onClose, onSave }: EditDayModalProps) {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const [editingName, setEditingName] = useState(dayName);

  useEffect(() => {
    setEditingName(dayName);
  }, [dayName]);

  const handleSave = () => {
    if (!editingName.trim()) {
      Alert.alert('Помилка', 'Введіть назву дня');
      return;
    }
    onSave(editingName.trim());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>
              Редагувати назву дня
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.modalForm}>
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.formLabel}>Назва дня *</ThemedText>
              <TextInput
                style={[
                  styles.formInput,
                  { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                ]}
                placeholder="Наприклад: День 1"
                placeholderTextColor={iconColor + '80'}
                value={editingName}
                onChangeText={setEditingName}
              />
            </ThemedView>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Зберегти зміни</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
