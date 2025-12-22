import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExercisesScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const exercises: Array<{
    id: number;
    name: string;
    sets: number;
    reps: number;
    icon: 'figure.strengthtraining.traditional';
  }> = [
    { id: 1, name: 'Присідання', sets: 3, reps: 12, icon: 'figure.strengthtraining.traditional' },
    { id: 2, name: 'Жим лежачи', sets: 4, reps: 10, icon: 'figure.strengthtraining.traditional' },
    { id: 3, name: 'Станова тяга', sets: 3, reps: 8, icon: 'figure.strengthtraining.traditional' },
    { id: 4, name: 'Підтягування', sets: 3, reps: 12, icon: 'figure.strengthtraining.traditional' },
    { id: 5, name: 'Планка', sets: 3, reps: 60, icon: 'figure.strengthtraining.traditional' },
  ];

  return (
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
      </ThemedView>

      <ScrollView style={styles.exercisesList}>
        {exercises.map((exercise) => (
          <ThemedView key={exercise.id} style={styles.exerciseCard}>
            <ThemedView style={styles.exerciseHeader}>
              <IconSymbol
                size={32}
                name={exercise.icon}
                color={iconColor}
                style={styles.exerciseIcon}
              />
              <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
                {exercise.name}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.exerciseDetails}>
              <ThemedText style={styles.exerciseDetail}>Підходи: {exercise.sets}</ThemedText>
              <ThemedText style={styles.exerciseDetail}>Повторення: {exercise.reps}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  exerciseIcon: {
    marginRight: 4,
  },
  exerciseName: {
    fontSize: 18,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
