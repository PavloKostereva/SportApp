import { AddExerciseToDayModal } from '@/components/exercises/add-exercise-to-day-modal';
import { DayModal } from '@/components/exercises/day-modal';
import { EditDayModal } from '@/components/exercises/edit-day-modal';
import { ExerciseDetailModal } from '@/components/exercises/exercise-detail-modal';
import { ExerciseFormModal } from '@/components/exercises/exercise-form-modal';
import { FiltersSection } from '@/components/exercises/filters-section';
import { ReplaceExerciseModal } from '@/components/exercises/replace-exercise-modal';
import { WorkoutDayCard } from '@/components/exercises/workout-day-card';
import { WorkoutMode } from '@/components/exercises/workout-mode';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useExercises } from '@/contexts/exercises-context';
import { useWorkoutDays } from '@/contexts/workout-days-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  Exercise,
  ExerciseCategory,
  ExerciseDifficulty,
  ExerciseEquipment,
  ExerciseLocation,
  WorkoutDay,
} from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<ExerciseLocation | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseEquipment | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
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
    difficulty: 'beginner' as ExerciseDifficulty | '',
    location: 'anywhere' as ExerciseLocation | '',
    equipment: [] as ExerciseEquipment[],
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
      difficulty: newExercise.difficulty || undefined,
      location: newExercise.location || undefined,
      equipment: newExercise.equipment.length > 0 ? newExercise.equipment : undefined,
    });

    setNewExercise({
      name: '',
      category: 'chest',
      sets: '3',
      reps: '12',
      weight: '',
      restTime: '60',
      difficulty: 'beginner',
      location: 'anywhere',
      equipment: [],
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
      difficulty: newExercise.difficulty || undefined,
      location: newExercise.location || undefined,
      equipment: newExercise.equipment.length > 0 ? newExercise.equipment : undefined,
    });

    setEditingExercise(null);
    setNewExercise({
      name: '',
      category: 'chest',
      sets: '3',
      reps: '12',
      weight: '',
      restTime: '60',
      difficulty: 'beginner',
      location: 'anywhere',
      equipment: [],
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
      difficulty: exercise.difficulty || 'beginner',
      location: exercise.location || 'anywhere',
      equipment: exercise.equipment || [],
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
    if (restTimer !== null && restTimer > 0 && selectedDay) {
      restTimerIntervalRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
            if (restTimerIntervalRef.current) {
              clearInterval(restTimerIntervalRef.current);
            }
            const dayExercises = getDayExercises(selectedDay.id, exercises);
            const currentExercise = dayExercises[currentExerciseIndex];
            if (!currentExercise) return null;

            const currentCompletedSets = completedSets[currentExercise.id] || 0;

            if (currentCompletedSets >= currentExercise.sets) {
              if (currentExerciseIndex < dayExercises.length - 1) {
                const nextExerciseIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextExerciseIndex);
                setCompletedSets((prev) => {
                  const newSets = { ...prev };
                  newSets[currentExercise.id] = 0;
                  const nextExercise = dayExercises[nextExerciseIndex];
                  if (nextExercise) {
                    newSets[nextExercise.id] = 0;
                  }
                  return newSets;
                });
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
          <ThemedView style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}>
              <IconSymbol size={24} name="list.bullet" color={tintColor} />
            </TouchableOpacity>
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
                  difficulty: 'beginner',
                  location: 'anywhere',
                  equipment: [],
                });
                setShowAddModal(true);
              }}>
              <IconSymbol size={24} name="plus.circle.fill" color={tintColor} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {showFilters && (
          <FiltersSection
            selectedDifficulty={selectedDifficulty}
            selectedLocation={selectedLocation}
            selectedEquipment={selectedEquipment}
            onDifficultyChange={setSelectedDifficulty}
            onLocationChange={setSelectedLocation}
            onEquipmentChange={setSelectedEquipment}
            onClearFilters={() => {
              setSelectedDifficulty('all');
              setSelectedLocation('all');
              setSelectedEquipment('all');
            }}
          />
        )}

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
            workoutDays
              .filter((day) => {
                const dayExercises = getDayExercises(day.id, exercises);
                if (dayExercises.length === 0) return true;

                return dayExercises.some((exercise) => {
                  const difficultyMatch =
                    selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
                  const locationMatch =
                    selectedLocation === 'all' || exercise.location === selectedLocation;
                  const equipmentMatch =
                    selectedEquipment === 'all' ||
                    exercise.equipment?.includes(selectedEquipment) ||
                    (selectedEquipment === 'none' && !exercise.equipment?.length);

                  return difficultyMatch && locationMatch && equipmentMatch;
                });
              })
              .map((day) => {
                const dayExercises = getDayExercises(day.id, exercises);
                return (
                  <WorkoutDayCard
                    key={day.id}
                    day={day}
                    dayExercises={dayExercises}
                    onPress={() => {
                      setSelectedDay(day);
                      setShowDayModal(true);
                    }}
                  />
                );
              })
          )}
        </ScrollView>
      </ParallaxScrollView>

      <DayModal
        visible={showDayModal && selectedDay !== null && selectedDay.unlocked}
        day={selectedDay}
        dayExercises={selectedDay ? getDayExercises(selectedDay.id, exercises) : []}
        getCategoryName={getCategoryName}
        onClose={() => {
          setShowDayModal(false);
          setSelectedDay(null);
        }}
        onEditName={() => {
          if (selectedDay) {
            setEditingDayName(selectedDay.name);
            setShowEditDayModal(true);
          }
        }}
        onStartWorkout={() => {
          setShowDayModal(false);
          setShowWorkoutMode(true);
          setCurrentExerciseIndex(0);
          setCompletedSets({});
          setRestTimer(null);
          setStartTimer(3);
          setWorkoutStarted(false);
        }}
        onAddExercise={() => setShowAddExerciseToDayModal(true)}
        onCompleteDay={async () => {
          if (selectedDay) {
            await markDayAsCompleted(selectedDay.id);
            setShowDayModal(false);
            setSelectedDay(null);
          }
        }}
        onUncompleteDay={async () => {
          if (selectedDay) {
            await unmarkDayAsCompleted(selectedDay.id);
            setShowDayModal(false);
            setSelectedDay(null);
          }
        }}
        onExercisePress={(exercise) => {
          setSelectedExercise(exercise);
          setShowDayModal(false);
        }}
        onReplaceExercise={(exercise) => {
          setExerciseToReplace(exercise);
          setShowReplaceExerciseModal(true);
        }}
        onRemoveExercise={async (exerciseId) => {
          if (selectedDay) {
            await removeExerciseFromDay(selectedDay.id, exerciseId);
          }
        }}
      />

      <AddExerciseToDayModal
        visible={showAddExerciseToDayModal}
        day={selectedDay}
        availableExercises={exercises.filter(
          (ex) => selectedDay && !selectedDay.exercises.includes(ex.id),
        )}
        getCategoryName={getCategoryName}
        onClose={() => setShowAddExerciseToDayModal(false)}
        onAddExercise={async (exerciseId) => {
          if (selectedDay) {
            await addExerciseToDay(selectedDay.id, exerciseId);
            setShowAddExerciseToDayModal(false);
          }
        }}
      />

      <WorkoutMode
        visible={showWorkoutMode}
        day={selectedDay}
        dayExercises={selectedDay ? getDayExercises(selectedDay.id, exercises) : []}
        currentExerciseIndex={currentExerciseIndex}
        completedSets={completedSets}
        startTimer={startTimer}
        restTimer={restTimer}
        workoutStarted={workoutStarted}
        getCategoryName={getCategoryName}
        onClose={() => {
          setShowWorkoutMode(false);
          setRestTimer(null);
          setStartTimer(null);
          setCurrentExerciseIndex(0);
          setCompletedSets({});
          setWorkoutStarted(false);
        }}
        onSkipRest={() => {
          if (!selectedDay) return;
          const dayExercises = getDayExercises(selectedDay.id, exercises);
          const currentExercise = dayExercises[currentExerciseIndex];
          if (!currentExercise) return;

          const currentCompletedSets = completedSets[currentExercise.id] || 0;

          setRestTimer(null);

          if (currentCompletedSets >= currentExercise.sets) {
            if (currentExerciseIndex < dayExercises.length - 1) {
              const nextExerciseIndex = currentExerciseIndex + 1;
              setCurrentExerciseIndex(nextExerciseIndex);
              setCompletedSets((prev) => {
                const newSets = { ...prev };
                newSets[currentExercise.id] = 0;
                const nextExercise = dayExercises[nextExerciseIndex];
                if (nextExercise) {
                  newSets[nextExercise.id] = 0;
                }
                return newSets;
              });
            }
          }
        }}
        onCompleteSet={(exerciseId) => {
          if (!selectedDay) return;
          const dayExercises = getDayExercises(selectedDay.id, exercises);
          const currentExercise = dayExercises[currentExerciseIndex];
          if (!currentExercise) return;

          const currentCompletedSets = completedSets[exerciseId] || 0;
          const isLastExercise = currentExerciseIndex === dayExercises.length - 1;

          if (currentCompletedSets >= currentExercise.sets) {
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
            return;
          }

          const newCompletedSets = {
            ...completedSets,
            [exerciseId]: currentCompletedSets + 1,
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
        }}
        onFinishWorkout={async () => {
          if (selectedDay) {
            await markDayAsCompleted(selectedDay.id);
            setShowWorkoutMode(false);
            setShowDayModal(false);
            setSelectedDay(null);
            setRestTimer(null);
            setStartTimer(null);
            setCurrentExerciseIndex(0);
            setCompletedSets({});
            setWorkoutStarted(false);
          }
        }}
      />

      <ReplaceExerciseModal
        visible={showReplaceExerciseModal}
        day={selectedDay}
        exerciseToReplace={exerciseToReplace}
        availableExercises={exercises.filter(
          (ex) =>
            selectedDay &&
            ex.id !== exerciseToReplace?.id &&
            !selectedDay.exercises.includes(ex.id),
        )}
        getCategoryName={getCategoryName}
        onClose={() => {
          setShowReplaceExerciseModal(false);
          setExerciseToReplace(null);
        }}
        onReplace={async (oldExerciseId, newExerciseId) => {
          if (selectedDay) {
            await removeExerciseFromDay(selectedDay.id, oldExerciseId);
            await addExerciseToDay(selectedDay.id, newExerciseId);
            setShowReplaceExerciseModal(false);
            setExerciseToReplace(null);
          }
        }}
      />

      <EditDayModal
        visible={showEditDayModal}
        dayName={editingDayName}
        onClose={() => setShowEditDayModal(false)}
        onSave={async (name) => {
          if (selectedDay) {
            await updateWorkoutDay(selectedDay.id, { name });
            setShowEditDayModal(false);
            setSelectedDay({ ...selectedDay, name });
          }
        }}
      />

      <ExerciseDetailModal
        visible={selectedExercise !== null}
        exercise={selectedExercise}
        getCategoryName={getCategoryName}
        onClose={() => setSelectedExercise(null)}
        onEdit={() => {
          if (selectedExercise) {
            openEditModal(selectedExercise);
            setSelectedExercise(null);
          }
        }}
        onDelete={() => {
          if (selectedExercise) {
            handleDeleteExercise(selectedExercise);
            setSelectedExercise(null);
          }
        }}
      />

      <ExerciseFormModal
        visible={showAddModal || editingExercise !== null}
        editingExercise={editingExercise}
        formData={newExercise}
        categories={categories}
        getCategoryName={getCategoryName}
        onClose={() => {
          setShowAddModal(false);
          setEditingExercise(null);
        }}
        onFormDataChange={(data) => setNewExercise({ ...newExercise, ...data })}
        onSubmit={editingExercise ? handleEditExercise : handleAddExercise}
      />
    </>
  );
}
