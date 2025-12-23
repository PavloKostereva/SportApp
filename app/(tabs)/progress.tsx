import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet } from 'react-native';

export default function ProgressScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const weeklyStats = [
    { day: 'Пн', workouts: 1, duration: 45 },
    { day: 'Вт', workouts: 1, duration: 60 },
    { day: 'Ср', workouts: 0, duration: 0 },
    { day: 'Чт', workouts: 1, duration: 50 },
    { day: 'Пт', workouts: 1, duration: 55 },
    { day: 'Сб', workouts: 1, duration: 40 },
    { day: 'Нд', workouts: 0, duration: 0 },
  ];

  const achievements: Array<{
    id: number;
    title: string;
    date: string;
    icon: 'star.fill' | 'trophy.fill' | 'medal.fill';
  }> = [
    { id: 1, title: 'Перше тренування', date: '2 дні тому', icon: 'star.fill' },
    { id: 2, title: 'Тиждень активності', date: '5 днів тому', icon: 'trophy.fill' },
    { id: 3, title: '100 вправ', date: '1 тиждень тому', icon: 'medal.fill' },
  ];

  const totalWorkouts = weeklyStats.reduce((sum, day) => sum + day.workouts, 0);
  const totalDuration = weeklyStats.reduce((sum, day) => sum + day.duration, 0);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#95E1D3', dark: '#004D40' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FFFFFF"
          name="chart.line.uptrend.xyaxis"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Прогрес
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsCard}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            {totalWorkouts}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Тренувань</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            {totalDuration}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Хвилин</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            5
          </ThemedText>
          <ThemedText style={styles.statLabel}>Днів</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Тиждень
      </ThemedText>
      <ThemedView style={styles.weekChart}>
        {weeklyStats.map((stat, index) => (
          <ThemedView key={index} style={styles.dayColumn}>
            <ThemedView
              style={[
                styles.dayBar,
                {
                  height: stat.duration > 0 ? `${(stat.duration / 60) * 100}%` : '10%',
                  opacity: stat.workouts > 0 ? 1 : 0.3,
                },
              ]}
            />
            <ThemedText style={styles.dayLabel}>{stat.day}</ThemedText>
            <ThemedText style={styles.dayValue}>
              {stat.duration > 0 ? `${stat.duration}'` : '-'}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Досягнення
      </ThemedText>
      <ScrollView style={styles.achievementsList}>
        {achievements.map((achievement) => (
          <ThemedView key={achievement.id} style={styles.achievementCard}>
            <IconSymbol
              size={32}
              name={achievement.icon}
              color={iconColor}
              style={styles.achievementIcon}
            />
            <ThemedView style={styles.achievementContent}>
              <ThemedText type="defaultSemiBold">{achievement.title}</ThemedText>
              <ThemedText style={styles.achievementDate}>{achievement.date}</ThemedText>
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
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    minHeight: 40,
    lineHeight: 40,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dayBar: {
    width: '100%',
    backgroundColor: '#95E1D3',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dayValue: {
    fontSize: 10,
    opacity: 0.7,
  },
  achievementsList: {
    flex: 1,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementDate: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
