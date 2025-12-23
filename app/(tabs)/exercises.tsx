import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Exercise, useExercises } from '@/contexts/exercises-context';
import { useWorkoutDays, WorkoutDay } from '@/contexts/workout-days-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

type ExerciseCategory = Exercise['category'];

export default function ExercisesScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
    getExercisesByCategory,
    getCategoryName,
  } = useExercises();
  const {
    workoutDays,
    addWorkoutDay,
    updateWorkoutDay,
    deleteWorkoutDay,
    addExerciseToDay,
    removeExerciseFromDay,
    getDayExercises,
    markDayAsCompleted,
    unmarkDayAsCompleted,
  } = useWorkoutDays();

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showAddExerciseToDayModal, setShowAddExerciseToDayModal] = useState(false);
  const [showEditDayModal, setShowEditDayModal] = useState(false);
  const [editingDayName, setEditingDayName] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'chest' as ExerciseCategory,
    sets: '3',
    reps: '12',
    weight: '',
    restTime: '60',
  });

  const categories: ExerciseCategory[] = [
    'chest',
    'back',
    'legs',
    'shoulders',
    'arms',
    'core',
    'cardio',
  ];

  const filteredExercises =
    selectedCategory === 'all' ? exercises : getExercisesByCategory(selectedCategory);

  const handleAddExercise = async () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      Alert.alert('Помилка', "Заповніть всі обов'язкові поля");
      return;
    }

    await addExercise({
      name: newExercise.name,
      category: newExercise.category,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined,
      restTime: newExercise.restTime ? parseInt(newExercise.restTime) : 60,
    });

    setNewExercise({
      name: '',
      category: 'chest',
      sets: '3',
      reps: '12',
      weight: '',
      restTime: '60',
    });
    setShowAddModal(false);
  };

  const handleEditExercise = async () => {
    if (!editingExercise || !newExercise.name) {
      return;
    }

    await updateExercise(editingExercise.id, {
      name: newExercise.name,
      category: newExercise.category,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined,
      restTime: newExercise.restTime ? parseInt(newExercise.restTime) : 60,
    });

    setEditingExercise(null);
    setNewExercise({
      name: '',
      category: 'chest',
      sets: '3',
      reps: '12',
      weight: '',
      restTime: '60',
    });
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    Alert.alert('Видалити вправу', `Ви впевнені, що хочете видалити "${exercise.name}"?`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => deleteExercise(exercise.id),
      },
    ]);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setNewExercise({
      name: exercise.name,
      category: exercise.category,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight?.toString() || '',
      restTime: exercise.restTime?.toString() || '60',
    });
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#FF6B6B', dark: '#8B0000' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#FFFFFF"
            name="figure.strengthtraining.traditional"
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}>
            Вправи
          </ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingExercise(null);
              setNewExercise({
                name: '',
                category: 'chest',
                sets: '3',
                reps: '12',
                weight: '',
                restTime: '60',
              });
              setShowAddModal(true);
            }}>
            <IconSymbol size={24} name="plus.circle.fill" color={tintColor} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Дні тренувань
        </ThemedText>

        <ScrollView style={styles.workoutDaysList}>
          {workoutDays.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Немає днів тренувань</ThemedText>
              <ThemedText style={styles.emptySubtext}>Створіть перший день тренування</ThemedText>
            </ThemedView>
          ) : (
            workoutDays.map((day) => {
              const dayExercises = getDayExercises(day.id, exercises);
              return (
                <TouchableOpacity
                  key={day.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedDay(day);
                    setShowDayModal(true);
                  }}>
                  <ThemedView style={[styles.dayCard, day.completed && styles.dayCardCompleted]}>
                    <ThemedView style={styles.dayHeader}>
                      <ThemedView style={styles.dayInfo}>
                        <ThemedText type="defaultSemiBold" style={styles.dayName}>
                          {day.name}
                        </ThemedText>
                        <ThemedText style={styles.dayExercisesCount}>
                          {dayExercises.length} {dayExercises.length === 1 ? 'вправа' : 'вправ'}
                        </ThemedText>
                      </ThemedView>
                      {day.completed && (
                        <IconSymbol size={24} name="checkmark.circle.fill" color="#4CAF50" />
                      )}
                    </ThemedView>
                    {dayExercises.length > 0 && (
                      <ThemedView style={styles.dayExercisesPreview}>
                        {dayExercises.slice(0, 3).map((exercise) => (
                          <ThemedView key={exercise.id} style={styles.dayExerciseBadge}>
                            <ThemedText style={styles.dayExerciseBadgeText}>
                              {exercise.name}
                            </ThemedText>
                          </ThemedView>
                        ))}
                        {dayExercises.length > 3 && (
                          <ThemedText style={styles.dayMoreExercises}>
                            +{dayExercises.length - 3} ще
                          </ThemedText>
                        )}
                      </ThemedView>
                    )}
                  </ThemedView>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </ParallaxScrollView>

      {/* Модальне вікно перегляду дня */}
      <Modal
        visible={showDayModal && selectedDay !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowDayModal(false);
          setSelectedDay(null);
        }}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            {selectedDay && (
              <>
                <ThemedView style={styles.modalHeader}>
                  <ThemedView style={styles.dayModalHeader}>
                    <ThemedView style={styles.dayTitleRow}>
                      <ThemedText type="title" style={styles.modalTitle}>
                        {selectedDay.name}
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingDayName(selectedDay.name);
                          setShowEditDayModal(true);
                        }}>
                        <IconSymbol size={20} name="pencil" color={iconColor} />
                      </TouchableOpacity>
                    </ThemedView>
                    {selectedDay.completed && selectedDay.date && (
                      <ThemedView style={styles.completedBadge}>
                        <IconSymbol size={20} name="checkmark.circle.fill" color="#4CAF50" />
                        <ThemedText style={styles.completedText}>
                          Завершено {new Date(selectedDay.date).toLocaleDateString('uk-UA')}
                        </ThemedText>
                      </ThemedView>
                    )}
                  </ThemedView>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDayModal(false);
                      setSelectedDay(null);
                    }}>
                    <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
                  </TouchableOpacity>
                </ThemedView>

                {(() => {
                  const dayExercises = getDayExercises(selectedDay.id, exercises);
                  const totalSets = dayExercises.reduce((sum, ex) => sum + ex.sets, 0);
                  const totalReps = dayExercises.reduce((sum, ex) => sum + ex.reps * ex.sets, 0);
                  const totalWeight = dayExercises.reduce(
                    (sum, ex) => sum + (ex.weight || 0) * ex.sets,
                    0,
                  );
                  return dayExercises.length > 0 ? (
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
                  ) : null;
                })()}

                <ScrollView style={styles.dayExercisesList}>
                  {getDayExercises(selectedDay.id, exercises).length === 0 ? (
                    <ThemedView style={styles.emptyState}>
                      <ThemedText style={styles.emptyText}>Немає вправ у цьому дні</ThemedText>
                      <ThemedText style={styles.emptySubtext}>Додайте вправи зі списку</ThemedText>
                    </ThemedView>
                  ) : (
                    getDayExercises(selectedDay.id, exercises).map((exercise) => (
                      <TouchableOpacity
                        key={exercise.id}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedExercise(exercise);
                          setShowDayModal(false);
                        }}>
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
                            {!selectedDay.completed && (
                              <TouchableOpacity
                                style={styles.removeExerciseButton}
                                onPress={async () => {
                                  await removeExerciseFromDay(selectedDay.id, exercise.id);
                                }}>
                                <IconSymbol size={20} name="trash.fill" color="#FF6B6B" />
                              </TouchableOpacity>
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
                  {!selectedDay.completed ? (
                    <>
                      <TouchableOpacity
                        style={[styles.addExerciseToDayButton, { borderColor: tintColor }]}
                        onPress={() => setShowAddExerciseToDayModal(true)}>
                        <IconSymbol size={20} name="plus.circle.fill" color={tintColor} />
                        <ThemedText style={[styles.addExerciseToDayText, { color: tintColor }]}>
                          Додати вправу
                        </ThemedText>
                      </TouchableOpacity>
                      {getDayExercises(selectedDay.id, exercises).length > 0 && (
                        <TouchableOpacity
                          style={[styles.completeButton, { backgroundColor: tintColor }]}
                          onPress={async () => {
                            await markDayAsCompleted(selectedDay.id);
                            setShowDayModal(false);
                            setSelectedDay(null);
                          }}>
                          <ThemedText style={styles.completeButtonText}>
                            Завершити тренування
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.uncompleteButton, { borderColor: tintColor }]}
                      onPress={async () => {
                        await unmarkDayAsCompleted(selectedDay.id);
                        setShowDayModal(false);
                        setSelectedDay(null);
                      }}>
                      <IconSymbol size={20} name="arrow.clockwise" color={tintColor} />
                      <ThemedText style={[styles.uncompleteButtonText, { color: tintColor }]}>
                        Відмінити завершення
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              </>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Модальне вікно додавання вправи до дня */}
      <Modal
        visible={showAddExerciseToDayModal && selectedDay !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddExerciseToDayModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Додати вправу до {selectedDay?.name}
              </ThemedText>
              <TouchableOpacity onPress={() => setShowAddExerciseToDayModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.exercisesList}>
              {exercises
                .filter((ex) => selectedDay && !selectedDay.exercises.includes(ex.id))
                .map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseSelectCard}
                    onPress={async () => {
                      if (selectedDay) {
                        await addExerciseToDay(selectedDay.id, exercise.id);
                        setShowAddExerciseToDayModal(false);
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
                      <IconSymbol size={24} name="plus.circle.fill" color={tintColor} />
                    </ThemedView>
                  </TouchableOpacity>
                ))}
              {selectedDay &&
                exercises.filter((ex) => !selectedDay.exercises.includes(ex.id)).length === 0 && (
                  <ThemedView style={styles.emptyState}>
                    <ThemedText style={styles.emptyText}>
                      Всі вправи вже додані до цього дня
                    </ThemedText>
                  </ThemedView>
                )}
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Модальне вікно редагування назви дня */}
      <Modal
        visible={showEditDayModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditDayModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Редагувати назву дня
              </ThemedText>
              <TouchableOpacity onPress={() => setShowEditDayModal(false)}>
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
                  value={editingDayName}
                  onChangeText={setEditingDayName}
                />
              </ThemedView>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: tintColor }]}
                onPress={async () => {
                  if (!editingDayName.trim()) {
                    Alert.alert('Помилка', 'Введіть назву дня');
                    return;
                  }
                  if (selectedDay) {
                    await updateWorkoutDay(selectedDay.id, { name: editingDayName.trim() });
                    setShowEditDayModal(false);
                    setSelectedDay({ ...selectedDay, name: editingDayName.trim() });
                  }
                }}>
                <ThemedText style={styles.saveButtonText}>Зберегти зміни</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Детальний перегляд вправи */}
      <Modal
        visible={selectedExercise !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedExercise(null)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            {selectedExercise && (
              <>
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
                        {selectedExercise.name}
                      </ThemedText>
                      <ThemedView style={styles.detailCategoryBadge}>
                        <ThemedText style={styles.detailCategoryText}>
                          {getCategoryName(selectedExercise.category)}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                  <TouchableOpacity onPress={() => setSelectedExercise(null)}>
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
                          {String(selectedExercise.sets)}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.detailCard}>
                        <ThemedText style={styles.detailCardLabel}>Повторення</ThemedText>
                        <ThemedText type="title" style={styles.detailCardValue}>
                          {String(selectedExercise.reps)}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>

                  {selectedExercise.weight && (
                    <ThemedView style={styles.detailSection}>
                      <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                        Вага
                      </ThemedText>
                      <ThemedView style={styles.detailCard}>
                        <ThemedText style={styles.detailCardLabel}>Рекомендована вага</ThemedText>
                        <ThemedText type="title" style={styles.detailCardValue}>
                          {String(selectedExercise.weight)} кг
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  )}

                  {selectedExercise.restTime && (
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
                              {String(selectedExercise.restTime)} секунд
                            </ThemedText>
                          </ThemedView>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                  )}

                  {selectedExercise.notes && (
                    <ThemedView style={styles.detailSection}>
                      <ThemedText type="defaultSemiBold" style={styles.detailSectionTitle}>
                        Нотатки
                      </ThemedText>
                      <ThemedView style={styles.detailCard}>
                        <ThemedText style={styles.detailNotes}>{selectedExercise.notes}</ThemedText>
                      </ThemedView>
                    </ThemedView>
                  )}

                  <ThemedView style={styles.detailActions}>
                    <TouchableOpacity
                      style={[styles.detailActionButton, { borderColor: tintColor }]}
                      onPress={() => {
                        setSelectedExercise(null);
                        openEditModal(selectedExercise);
                      }}>
                      <IconSymbol size={20} name="pencil" color={tintColor} />
                      <ThemedText style={[styles.detailActionText, { color: tintColor }]}>
                        Редагувати
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.detailActionButton, { borderColor: '#FF6B6B' }]}
                      onPress={() => {
                        setSelectedExercise(null);
                        handleDeleteExercise(selectedExercise);
                      }}>
                      <IconSymbol size={20} name="trash.fill" color="#FF6B6B" />
                      <ThemedText style={[styles.detailActionText, { color: '#FF6B6B' }]}>
                        Видалити
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ScrollView>
              </>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>

      <Modal
        visible={showAddModal || editingExercise !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setEditingExercise(null);
        }}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                {editingExercise ? 'Редагувати вправу' : 'Додати вправу'}
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  setEditingExercise(null);
                }}>
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
                  value={newExercise.name}
                  onChangeText={(text) => setNewExercise({ ...newExercise, name: text })}
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
                        newExercise.category === category && {
                          backgroundColor: tintColor,
                        },
                      ]}
                      onPress={() => setNewExercise({ ...newExercise, category })}>
                      <ThemedText
                        style={[
                          styles.categoryOptionText,
                          newExercise.category === category && { color: '#fff' },
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
                    value={newExercise.sets}
                    onChangeText={(text) => setNewExercise({ ...newExercise, sets: text })}
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
                    value={newExercise.reps}
                    onChangeText={(text) => setNewExercise({ ...newExercise, reps: text })}
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
                    value={newExercise.weight}
                    onChangeText={(text) => setNewExercise({ ...newExercise, weight: text })}
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
                    value={newExercise.restTime}
                    onChangeText={(text) => setNewExercise({ ...newExercise, restTime: text })}
                    keyboardType="numeric"
                  />
                </ThemedView>
              </ThemedView>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: tintColor }]}
                onPress={editingExercise ? handleEditExercise : handleAddExercise}>
                <ThemedText style={styles.saveButtonText}>
                  {editingExercise ? 'Зберегти зміни' : 'Додати вправу'}
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
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
  addButton: {
    padding: 8,
  },
  categoriesScroll: {
    marginBottom: 16,
    maxHeight: 50,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesList: {
    flex: 1,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  exerciseIcon: {
    marginRight: 4,
  },
  exerciseTitleContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    opacity: 0.6,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
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
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
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
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailTitleContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  detailCategoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailCardLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailRowText: {
    flex: 1,
  },
  detailNotes: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  detailActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  workoutDaysList: {
    flex: 1,
    marginBottom: 24,
  },
  dayCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayCardCompleted: {
    opacity: 0.7,
    borderColor: '#4CAF50',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 20,
    marginBottom: 4,
  },
  dayExercisesCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  dayExercisesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dayExerciseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dayExerciseBadgeText: {
    fontSize: 12,
  },
  dayMoreExercises: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  dayModalHeader: {
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dayExercisesList: {
    flex: 1,
    marginBottom: 20,
  },
  dayExerciseCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayExerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },
  dayModalActions: {
    marginTop: 12,
  },
  addExerciseToDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  addExerciseToDayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseSelectCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseSelectInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
  },
  removeExerciseButton: {
    padding: 8,
    marginLeft: 8,
  },
  uncompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  uncompleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
