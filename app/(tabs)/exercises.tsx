import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useExercises } from '@/contexts/exercises-context';
import { useWorkoutDays } from '@/contexts/workout-days-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Exercise, ExerciseCategory, WorkoutDay } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './exercises.styles';

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
  const [showWorkoutMode, setShowWorkoutMode] = useState(false);
  const [showReplaceExerciseModal, setShowReplaceExerciseModal] = useState(false);
  const [exerciseToReplace, setExerciseToReplace] = useState<Exercise | null>(null);
  const [editingDayName, setEditingDayName] = useState('');
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [startTimer, setStartTimer] = useState<number | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [workoutStarted, setWorkoutStarted] = useState(false);
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

  const restTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (startTimer !== null && startTimer > 0) {
      startTimerIntervalRef.current = setInterval(() => {
        setStartTimer((prev) => {
          if (prev === null || prev <= 1) {
            if (startTimerIntervalRef.current) {
              clearInterval(startTimerIntervalRef.current);
            }
            setWorkoutStarted(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (startTimerIntervalRef.current) {
        clearInterval(startTimerIntervalRef.current);
      }
    }

    return () => {
      if (startTimerIntervalRef.current) {
        clearInterval(startTimerIntervalRef.current);
      }
    };
  }, [startTimer]);

  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      restTimerIntervalRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
            if (restTimerIntervalRef.current) {
              clearInterval(restTimerIntervalRef.current);
            }
            if (selectedDay) {
              const dayExercises = getDayExercises(selectedDay.id, exercises);
              const currentExercise = dayExercises[currentExerciseIndex];
              const currentCompletedSets = completedSets[currentExercise?.id || ''] || 0;

              if (currentExercise && currentCompletedSets >= currentExercise.sets) {
                if (currentExerciseIndex < dayExercises.length - 1) {
                  setCurrentExerciseIndex((prev) => prev + 1);
                  setCompletedSets((prev) => ({ ...prev, [currentExercise.id]: 0 }));
                }
              }
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerIntervalRef.current) {
        clearInterval(restTimerIntervalRef.current);
      }
    }

    return () => {
      if (restTimerIntervalRef.current) {
        clearInterval(restTimerIntervalRef.current);
      }
    };
  }, [restTimer, selectedDay, currentExerciseIndex, exercises, completedSets, getDayExercises]);

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
              const isLocked = !day.unlocked;
              return (
                <TouchableOpacity
                  key={day.id}
                  activeOpacity={isLocked ? 1 : 0.7}
                  disabled={isLocked}
                  onPress={() => {
                    if (isLocked) {
                      Alert.alert(
                        'День заблоковано',
                        `Завершіть день ${day.dayNumber - 1}, щоб розблокувати цей день.`,
                        [{ text: 'ОК' }],
                      );
                    } else {
                      setSelectedDay(day);
                      setShowDayModal(true);
                    }
                  }}>
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
                      </ThemedView>
                      {day.completed && !isLocked && (
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
                            +{String(dayExercises.length - 3)} ще
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
        visible={showDayModal && selectedDay !== null && selectedDay.unlocked}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowDayModal(false);
          setSelectedDay(null);
        }}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            {selectedDay && selectedDay.unlocked && (
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
                              <ThemedView style={styles.exerciseActionsRow}>
                                <TouchableOpacity
                                  style={styles.replaceExerciseButton}
                                  onPress={() => {
                                    setExerciseToReplace(exercise);
                                    setShowReplaceExerciseModal(true);
                                  }}>
                                  <IconSymbol
                                    size={20}
                                    name="arrow.triangle.2.circlepath"
                                    color={iconColor}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.removeExerciseButton}
                                  onPress={async () => {
                                    await removeExerciseFromDay(selectedDay.id, exercise.id);
                                  }}>
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
                  {!selectedDay.completed ? (
                    <>
                      {getDayExercises(selectedDay.id, exercises).length > 0 && (
                        <TouchableOpacity
                          style={[styles.startWorkoutButton, { backgroundColor: tintColor }]}
                          onPress={() => {
                            setShowWorkoutMode(true);
                            setCurrentExerciseIndex(0);
                            setCompletedSets({});
                            setRestTimer(null);
                            setStartTimer(3);
                            setWorkoutStarted(false);
                          }}>
                          <IconSymbol size={24} name="figure.run" color="#fff" />
                          <ThemedText style={styles.startWorkoutButtonText}>
                            Почати тренування
                          </ThemedText>
                        </TouchableOpacity>
                      )}
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

      {/* Режим активного тренування */}
      <Modal
        visible={showWorkoutMode && selectedDay !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          Alert.alert(
            'Завершити тренування?',
            'Ви впевнені, що хочете вийти з режиму тренування?',
            [
              { text: 'Скасувати', style: 'cancel' },
              {
                text: 'Вийти',
                style: 'destructive',
                onPress: () => {
                  setShowWorkoutMode(false);
                  setRestTimer(null);
                  setStartTimer(null);
                  setCurrentExerciseIndex(0);
                  setCompletedSets({});
                  setWorkoutStarted(false);
                },
              },
            ],
          );
        }}>
        {selectedDay &&
          (() => {
            const dayExercises = getDayExercises(selectedDay.id, exercises);
            const currentExercise = dayExercises[currentExerciseIndex];
            const isLastExercise = currentExerciseIndex === dayExercises.length - 1;
            const currentCompletedSets = completedSets[currentExercise?.id || ''] || 0;

            return (
              <ThemedView style={styles.workoutModeContainer}>
                <ThemedView style={styles.workoutHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Завершити тренування?', 'Ви впевнені, що хочете вийти?', [
                        { text: 'Скасувати', style: 'cancel' },
                        {
                          text: 'Вийти',
                          style: 'destructive',
                          onPress: () => {
                            setShowWorkoutMode(false);
                            setRestTimer(null);
                            setStartTimer(null);
                            setWorkoutStarted(false);
                          },
                        },
                      ]);
                    }}>
                    <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
                  </TouchableOpacity>
                  <ThemedText type="title" style={styles.workoutTitle}>
                    {selectedDay.name}
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
                ) : workoutStarted && currentExercise ? (
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
                            onPress={() => setRestTimer(null)}>
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
                            Підхід {currentCompletedSets + 1} з {currentExercise.sets}
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
                          onPress={() => {
                            const newCompletedSets = {
                              ...completedSets,
                              [currentExercise.id]: currentCompletedSets + 1,
                            };
                            setCompletedSets(newCompletedSets);

                            if (currentCompletedSets + 1 >= currentExercise.sets) {
                              if (isLastExercise) {
                                Alert.alert('Вітаємо!', 'Ви завершили всі вправи!', [
                                  {
                                    text: 'Завершити тренування',
                                    onPress: async () => {
                                      await markDayAsCompleted(selectedDay.id);
                                      setShowWorkoutMode(false);
                                      setShowDayModal(false);
                                      setSelectedDay(null);
                                      setRestTimer(null);
                                      setStartTimer(null);
                                      setCurrentExerciseIndex(0);
                                      setCompletedSets({});
                                      setWorkoutStarted(false);
                                    },
                                  },
                                ]);
                              } else {
                                const restTime = currentExercise.restTime || 60;
                                setRestTimer(restTime);
                              }
                            } else {
                              const restTime = currentExercise.restTime || 60;
                              setRestTimer(restTime);
                            }
                          }}>
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
                      onPress={async () => {
                        await markDayAsCompleted(selectedDay.id);
                        setShowWorkoutMode(false);
                        setShowDayModal(false);
                        setSelectedDay(null);
                        setRestTimer(null);
                        setStartTimer(null);
                        setCurrentExerciseIndex(0);
                        setCompletedSets({});
                        setWorkoutStarted(false);
                      }}>
                      <ThemedText style={styles.finishWorkoutButtonText}>Готово</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ) : null}
              </ThemedView>
            );
          })()}
      </Modal>

      {/* Модальне вікно заміни вправи */}
      <Modal
        visible={showReplaceExerciseModal && exerciseToReplace !== null && selectedDay !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReplaceExerciseModal(false)}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                Замінити "{exerciseToReplace?.name}"
              </ThemedText>
              <TouchableOpacity onPress={() => setShowReplaceExerciseModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.exercisesList}>
              {exercises
                .filter(
                  (ex) =>
                    selectedDay &&
                    ex.id !== exerciseToReplace?.id &&
                    !selectedDay.exercises.includes(ex.id),
                )
                .map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseSelectCard}
                    onPress={async () => {
                      if (selectedDay && exerciseToReplace) {
                        await removeExerciseFromDay(selectedDay.id, exerciseToReplace.id);
                        await addExerciseToDay(selectedDay.id, exercise.id);
                        setShowReplaceExerciseModal(false);
                        setExerciseToReplace(null);
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
                ))}
              {exercises.filter(
                (ex) =>
                  selectedDay &&
                  ex.id !== exerciseToReplace?.id &&
                  !selectedDay.exercises.includes(ex.id),
              ).length === 0 && (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={styles.emptyText}>Немає доступних вправ для заміни</ThemedText>
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
