import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useExercises } from '@/contexts/exercises-context';
import { useUser } from '@/contexts/user-context';
import { useWorkoutDays } from '@/contexts/workout-days-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const { userData, updateUserData, addWeightEntry } = useUser();
  const { exercises } = useExercises();
  const { workoutDays } = useWorkoutDays();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userData.name || '',
    weight: userData.weight?.toString() || '',
    height: userData.height?.toString() || '',
  });
  const [newWeight, setNewWeight] = useState('');

  useFocusEffect(
    useCallback(() => {
      console.log('Profile screen focused - userData:', userData);
    }, [userData]),
  );

  const currentWeight = userData.weight;
  const currentHeight = userData.height;
  const bmi =
    currentWeight && currentHeight ? (currentWeight / (currentHeight / 100) ** 2).toFixed(1) : null;

  const calculateTargetWeight = () => {
    if (!currentWeight || !userData.goal) return null;
    if (userData.goal === 'lose') {
      return currentWeight - 5;
    } else if (userData.goal === 'gain') {
      return currentWeight + 5;
    }
    return currentWeight;
  };

  const targetWeight = calculateTargetWeight();

  const weightHistory = userData.weightHistory || [];

  const getLifestyleName = (lifestyle: string | null) => {
    const names: Record<string, string> = {
      sedentary: 'Сидячий',
      light: 'Легка',
      moderate: 'Помірна',
      active: 'Активна',
      'very-active': 'Дуже активна',
    };
    return names[lifestyle || ''] || '-';
  };

  const getGoalName = (goal: string | null) => {
    const names: Record<string, string> = {
      lose: 'Скинути вагу',
      gain: 'Набрати вагу',
      maintain: 'Підтримати вагу',
    };
    return names[goal || ''] || '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сьогодні';
    if (diffDays === 1) return 'Вчора';
    if (diffDays < 7) return `${diffDays} днів тому`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'тиждень' : 'тижні'} тому`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'місяць' : 'місяці'} тому`;
    }
    return date.toLocaleDateString('uk-UA');
  };

  const handleSaveProfile = async () => {
    await updateUserData({
      name: editForm.name || undefined,
      weight: editForm.weight ? parseFloat(editForm.weight) : null,
      height: editForm.height ? parseFloat(editForm.height) : null,
    });
    setShowEditModal(false);
  };

  const handleAddWeight = async () => {
    if (!newWeight) {
      Alert.alert('Помилка', 'Введіть вагу');
      return;
    }
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Помилка', 'Введіть коректну вагу');
      return;
    }
    await addWeightEntry(weightValue);
    setNewWeight('');
    setShowAddWeightModal(false);
  };

  const totalExercises = exercises.length;
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedWorkouts = workoutDays.filter((day) => day.completed).length;

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#F38181', dark: '#B71C1C' }}
        headerImage={
          <IconSymbol size={310} color="#FFFFFF" name="person.fill" style={styles.headerImage} />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}>
            Профіль
          </ThemedText>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditForm({
                name: userData.name || '',
                weight: userData.weight?.toString() || '',
                height: userData.height?.toString() || '',
              });
              setShowEditModal(true);
            }}>
            <IconSymbol size={24} name="pencil" color={iconColor} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.profileCard}>
          <ThemedView style={styles.profileHeader}>
            <IconSymbol
              size={64}
              name="person.circle.fill"
              color={iconColor}
              style={styles.avatar}
            />
            <ThemedText type="defaultSemiBold" style={styles.profileName}>
              {userData.name || 'Користувач'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.metricsContainer}>
            <ThemedView style={styles.metricItem}>
              <ThemedText style={styles.metricLabel}>Вага</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                {currentWeight ? `${currentWeight} кг` : '-'}
              </ThemedText>
              {targetWeight !== null && (
                <ThemedText style={styles.metricTarget}>
                  Мета: {targetWeight.toFixed(1)} кг
                </ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.metricItem}>
              <ThemedText style={styles.metricLabel}>Зріст</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                {currentHeight ? `${currentHeight} см` : '-'}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.metricItem}>
              <ThemedText style={styles.metricLabel}>ІМТ</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.metricValue}>
                {bmi ? bmi : '-'}
              </ThemedText>
              {bmi && (
                <ThemedText style={styles.bmiStatus}>
                  {parseFloat(bmi) < 18.5
                    ? 'Недостатня вага'
                    : parseFloat(bmi) < 25
                    ? 'Норма'
                    : parseFloat(bmi) < 30
                    ? 'Надмірна вага'
                    : 'Ожиріння'}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText type="defaultSemiBold" style={styles.infoCardTitle}>
            Інформація
          </ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Мета:</ThemedText>
            <ThemedText style={styles.infoValue}>{getGoalName(userData.goal)}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Спосіб життя:</ThemedText>
            <ThemedText style={styles.infoValue}>{getLifestyleName(userData.lifestyle)}</ThemedText>
          </ThemedView>
          {userData.workoutTime && (
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Час тренувань:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.workoutTime} хв/тиждень</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.statsCard}>
          <ThemedText type="defaultSemiBold" style={styles.statsCardTitle}>
            Статистика
          </ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>
                {String(totalExercises)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Вправ</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>
                {String(totalSets)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Підходів</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>
                {String(weightHistory.length)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Записів ваги</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Історія ваги
          </ThemedText>
          <TouchableOpacity
            style={styles.addWeightButton}
            onPress={() => setShowAddWeightModal(true)}>
            <IconSymbol size={20} name="plus.circle.fill" color={tintColor} />
            <ThemedText style={[styles.addWeightButtonText, { color: tintColor }]}>
              Додати
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ScrollView style={styles.historyList}>
          {currentWeight && (
            <ThemedView style={styles.currentWeightCard}>
              <ThemedView style={styles.weightRow}>
                <ThemedText type="defaultSemiBold" style={styles.weightValue}>
                  {currentWeight} кг
                </ThemedText>
                <ThemedText style={styles.weightDate}>Сьогодні</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          {weightHistory.length > 0 &&
            weightHistory.map((entry, index) => (
              <ThemedView key={index} style={styles.historyItem}>
                <ThemedView style={styles.weightRow}>
                  <ThemedText type="defaultSemiBold" style={styles.weightValue}>
                    {entry.weight} кг
                  </ThemedText>
                  <ThemedText style={styles.weightDate}>{formatDate(entry.date)}</ThemedText>
                </ThemedView>
                {currentWeight && (
                  <ThemedText
                    style={[
                      styles.weightChange,
                      entry.weight > currentWeight ? styles.weightLoss : styles.weightGain,
                    ]}>
                    {entry.weight > currentWeight
                      ? `-${(entry.weight - currentWeight).toFixed(1)} кг`
                      : `+${(currentWeight - entry.weight).toFixed(1)} кг`}
                  </ThemedText>
                )}
              </ThemedView>
            ))}
          {weightHistory.length === 0 && !currentWeight && (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Немає записів ваги</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Додайте вашу поточну вагу для початку відстеження
              </ThemedText>
            </ThemedView>
          )}
        </ScrollView>

        {currentWeight && userData.goal && targetWeight !== null && (
          <ThemedView style={styles.progressIndicator}>
            <ThemedText style={styles.progressText}>
              Прогрес до мети:{' '}
              {weightHistory.length > 0 && currentWeight && targetWeight !== null
                ? Math.max(
                    0,
                    Math.min(
                      100,
                      (((weightHistory[weightHistory.length - 1]?.weight || currentWeight) -
                        currentWeight) /
                        ((weightHistory[weightHistory.length - 1]?.weight || currentWeight) -
                          targetWeight)) *
                        100,
                    ),
                  ).toFixed(0)
                : 0}
              %
            </ThemedText>
            <ThemedView style={styles.progressBar}>
              <ThemedView
                style={[
                  styles.progressFill,
                  {
                    width:
                      weightHistory.length > 0 && currentWeight && targetWeight !== null
                        ? `${Math.max(
                            0,
                            Math.min(
                              100,
                              (((weightHistory[weightHistory.length - 1]?.weight || currentWeight) -
                                currentWeight) /
                                ((weightHistory[weightHistory.length - 1]?.weight ||
                                  currentWeight) -
                                  targetWeight)) *
                                100,
                            ),
                          )}%`
                        : '0%',
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
        )}
      </ParallaxScrollView>

      {/* Модальне вікно редагування профілю */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Редагувати профіль
              </ThemedText>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.modalForm}>
              <ThemedView style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Ім'я</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="Ваше ім'я"
                  placeholderTextColor={iconColor + '80'}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                />
              </ThemedView>

              <ThemedView style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Вага (кг)</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="70"
                  placeholderTextColor={iconColor + '80'}
                  value={editForm.weight}
                  onChangeText={(text) => setEditForm({ ...editForm, weight: text })}
                  keyboardType="numeric"
                />
              </ThemedView>

              <ThemedView style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Зріст (см)</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="175"
                  placeholderTextColor={iconColor + '80'}
                  value={editForm.height}
                  onChangeText={(text) => setEditForm({ ...editForm, height: text })}
                  keyboardType="numeric"
                />
              </ThemedView>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: tintColor }]}
                onPress={handleSaveProfile}>
                <ThemedText style={styles.saveButtonText}>Зберегти</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Модальне вікно додавання ваги */}
      <Modal
        visible={showAddWeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddWeightModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Додати вагу
              </ThemedText>
              <TouchableOpacity onPress={() => setShowAddWeightModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalForm}>
              <ThemedView style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Вага (кг)</ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    { color: iconColor, borderColor, backgroundColor: backgroundColor + '80' },
                  ]}
                  placeholder="70"
                  placeholderTextColor={iconColor + '80'}
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="numeric"
                />
              </ThemedView>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: tintColor }]}
                onPress={handleAddWeight}>
                <ThemedText style={styles.saveButtonText}>Додати</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
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
  editButton: {
    padding: 8,
  },
  profileCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricTarget: {
    fontSize: 12,
    opacity: 0.6,
  },
  bmiStatus: {
    fontSize: 12,
    opacity: 0.6,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoCardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statsCardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
  },
  addWeightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addWeightButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyList: {
    flex: 1,
    marginBottom: 24,
  },
  currentWeightCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  weightRow: {
    flex: 1,
  },
  weightValue: {
    fontSize: 18,
    marginBottom: 4,
  },
  weightDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  weightChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  weightLoss: {
    color: '#4CAF50',
  },
  weightGain: {
    color: '#FF6B6B',
  },
  progressIndicator: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
  },
  modalForm: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
