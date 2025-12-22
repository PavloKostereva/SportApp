import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useUser } from '@/contexts/user-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const { userData } = useUser();

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

  const weightHistory = [
    { date: '1 тиждень тому', weight: 76.2 },
    { date: '2 тижні тому', weight: 76.8 },
    { date: '3 тижні тому', weight: 77.1 },
    { date: '4 тижні тому', weight: 77.5 },
  ];

  return (
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
      </ThemedView>

      <ThemedView style={styles.profileCard}>
        <ThemedView style={styles.profileHeader}>
          <IconSymbol size={64} name="person.circle.fill" color={iconColor} style={styles.avatar} />
          <ThemedText type="defaultSemiBold" style={styles.profileName}>
            Користувач
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

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Історія ваги
      </ThemedText>
      <ScrollView style={styles.historyList}>
        {userData.weight && (
          <ThemedView style={styles.currentWeightCard}>
            <ThemedView style={styles.weightRow}>
              <ThemedText type="defaultSemiBold" style={styles.weightValue}>
                {userData.weight} кг
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
                <ThemedText style={styles.weightDate}>{entry.date}</ThemedText>
              </ThemedView>
              {userData.weight && (
                <ThemedText
                  style={[
                    styles.weightChange,
                    entry.weight > userData.weight ? styles.weightLoss : styles.weightGain,
                  ]}>
                  {entry.weight > userData.weight
                    ? `-${(entry.weight - userData.weight).toFixed(1)} кг`
                    : `+${(userData.weight - entry.weight).toFixed(1)} кг`}
                </ThemedText>
              )}
            </ThemedView>
          ))}
      </ScrollView>

      {userData.weight && userData.goal && targetWeight !== null && (
        <ThemedView style={styles.progressIndicator}>
          <ThemedText style={styles.progressText}>
            Прогрес до мети:{' '}
            {weightHistory.length > 0 && userData.weight && targetWeight !== null
              ? Math.max(
                  0,
                  Math.min(
                    100,
                    ((weightHistory[weightHistory.length - 1].weight - userData.weight) /
                      (weightHistory[weightHistory.length - 1].weight - targetWeight)) *
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
                    weightHistory.length > 0 && userData.weight && targetWeight !== null
                      ? `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((weightHistory[weightHistory.length - 1].weight - userData.weight) /
                              (weightHistory[weightHistory.length - 1].weight - targetWeight)) *
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
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  profileCard: {
    padding: 20,
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
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
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
});
