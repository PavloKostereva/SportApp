import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUser } from '@/contexts/user-context';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  const { updateUserData, completeOnboarding, skipOnboarding } = useUser();
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [lifestyle, setLifestyle] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active' | null>(null);
  const [goal, setGoal] = useState<'lose' | 'gain' | 'maintain' | null>(null);
  const [workoutTime, setWorkoutTime] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleNext = async () => {
    if (step === 1) {
      if (weight && height) {
        setStep(2);
      }
    } else if (step === 2) {
      if (lifestyle) {
        setStep(3);
      }
    } else if (step === 3) {
      if (goal) {
        setStep(4);
      }
    } else if (step === 4) {
      if (workoutTime) {
        const weightValue = parseFloat(weight);
        const heightValue = parseFloat(height);
        const workoutTimeValue = parseFloat(workoutTime);
        
        console.log('Saving user data:', {
          weight: weightValue,
          height: heightValue,
          lifestyle,
          goal,
          workoutTime: workoutTimeValue,
        });
        
        await updateUserData({
          weight: weightValue,
          height: heightValue,
          lifestyle,
          goal,
          workoutTime: workoutTimeValue,
          hasCompletedOnboarding: true,
        });
        router.replace('/(tabs)/exercises');
      }
    }
  };

  const handleSkip = async () => {
    await skipOnboarding();
    router.replace('/(tabs)/exercises');
  };

  const lifestyleOptions = [
    { value: 'sedentary', label: 'Сидячий', description: 'Мінімальна активність' },
    { value: 'light', label: 'Легка', description: 'Легкі вправи 1-3 рази на тиждень' },
    { value: 'moderate', label: 'Помірна', description: 'Помірні вправи 3-5 разів на тиждень' },
    { value: 'active', label: 'Активна', description: 'Важкі вправи 6-7 разів на тиждень' },
    { value: 'very-active', label: 'Дуже активна', description: 'Дуже важкі вправи, фізична робота' },
  ] as const;

  const goalOptions = [
    { value: 'lose', label: 'Скинути вагу', icon: 'arrow.down.circle.fill' },
    { value: 'gain', label: 'Набрати вагу', icon: 'arrow.up.circle.fill' },
    { value: 'maintain', label: 'Підтримати вагу', icon: 'target' },
  ] as const;

  const workoutTimeOptions = [
    { value: '15', label: '15 хвилин' },
    { value: '30', label: '30 хвилин' },
    { value: '45', label: '45 хвилин' },
    { value: '60', label: '1 година' },
    { value: '90', label: '1.5 години' },
    { value: '120', label: '2+ години' },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {step === 1 && 'Ваші дані'}
            {step === 2 && 'Спосіб життя'}
            {step === 3 && 'Ваша мета'}
            {step === 4 && 'Час для тренувань'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {step === 1 && 'Введіть вашу вагу та зріст'}
            {step === 2 && 'Оберіть рівень вашої активності'}
            {step === 3 && 'Що ви хочете досягти?'}
            {step === 4 && 'Скільки часу ви можете тренуватися?'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.progressBar}>
          <ThemedView
            style={[styles.progressFill, { width: `${(step / 4) * 100}%`, backgroundColor: tintColor }]}
          />
        </ThemedView>

        <ThemedView style={styles.content}>
          {step === 1 && (
            <ThemedView style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Вага (кг)
              </ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: textColor }]}
                placeholder="Наприклад: 75"
                placeholderTextColor={textColor + '80'}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Зріст (см)
              </ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: textColor }]}
                placeholder="Наприклад: 180"
                placeholderTextColor={textColor + '80'}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </ThemedView>
          )}

          {step === 2 && (
            <ThemedView style={styles.optionsGroup}>
              {lifestyleOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    lifestyle === option.value && { borderColor: tintColor, borderWidth: 2 },
                  ]}
                  onPress={() => setLifestyle(option.value)}>
                  <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                    {option.label}
                  </ThemedText>
                  <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          )}

          {step === 3 && (
            <ThemedView style={styles.optionsGroup}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    goal === option.value && { borderColor: tintColor, borderWidth: 2 },
                  ]}
                  onPress={() => setGoal(option.value)}>
                  <IconSymbol
                    size={32}
                    name={option.icon as 'arrow.down.circle.fill' | 'arrow.up.circle.fill' | 'target'}
                    color={tintColor}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          )}

          {step === 4 && (
            <ThemedView style={styles.optionsGroup}>
              {workoutTimeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    workoutTime === option.value && { borderColor: tintColor, borderWidth: 2 },
                  ]}
                  onPress={() => setWorkoutTime(option.value)}>
                  <ThemedText type="defaultSemiBold" style={styles.optionLabel}>
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.buttons}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipButtonText}>Пропустити</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: tintColor,
                opacity:
                  (step === 1 && (!weight || !height)) ||
                  (step === 2 && !lifestyle) ||
                  (step === 3 && !goal) ||
                  (step === 4 && !workoutTime)
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleNext}
            disabled={
              (step === 1 && (!weight || !height)) ||
              (step === 2 && !lifestyle) ||
              (step === 3 && !goal) ||
              (step === 4 && !workoutTime)
            }>
            <ThemedText style={styles.nextButtonText}>
              {step === 4 ? 'Завершити' : 'Далі'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  inputGroup: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  optionsGroup: {
    gap: 12,
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 18,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  skipButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  nextButton: {
    flex: 2,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

