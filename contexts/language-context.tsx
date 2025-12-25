import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language';

const translations: Record<Language, Record<string, string>> = {
  uk: {
    // Navigation
    'nav.exercises': 'Вправи',
    'nav.calories': 'Калорії',
    'nav.progress': 'Прогрес',
    'nav.profile': 'Профіль',
    'nav.settings': 'Налаштування',
    
    // Settings
    'settings.general': 'Загальні',
    'settings.theme': 'Тема',
    'settings.language': 'Мова',
    'settings.theme.auto': 'Автоматична',
    'settings.theme.light': 'Світла',
    'settings.theme.dark': 'Темна',
    'settings.notifications': 'Сповіщення',
    'settings.sound': 'Звук',
    'settings.units': 'Одиниці виміру',
    'settings.autoTrack': 'Автоматичне відстеження',
    'settings.sync': 'Синхронізація',
    'settings.biometric': 'Біометрична автентифікація',
    'settings.autoUpdate': 'Автооновлення',
    
    // Exercises
    'exercises.title': 'Вправи',
    'exercises.add': 'Додати вправу',
    'exercises.edit': 'Редагувати вправу',
    'exercises.delete': 'Видалити вправу',
    'exercises.category.all': 'Всі',
    'exercises.category.chest': 'Груди',
    'exercises.category.back': 'Спина',
    'exercises.category.legs': 'Ноги',
    'exercises.category.shoulders': 'Плечі',
    'exercises.category.arms': 'Руки',
    'exercises.category.core': 'Прес',
    'exercises.category.cardio': 'Кардіо',
    'exercises.sets': 'Підходи',
    'exercises.reps': 'Повторення',
    'exercises.weight': 'Вага',
    'exercises.restTime': 'Відпочинок',
    'exercises.empty': 'Немає вправ у цій категорії',
    
    // Profile
    'profile.title': 'Профіль',
    'profile.weight': 'Вага',
    'profile.height': 'Зріст',
    'profile.bmi': 'ІМТ',
    'profile.goal': 'Мета',
    'profile.lifestyle': 'Спосіб життя',
    'profile.workoutTime': 'Час тренувань',
    'profile.weightHistory': 'Історія ваги',
    'profile.addWeight': 'Додати вагу',
    'profile.edit': 'Редагувати профіль',
    'profile.stats': 'Статистика',
    'profile.workouts': 'Вправ',
    'profile.sets': 'Підходів',
    'profile.weightEntries': 'Записів ваги',
    
    // Progress
    'progress.title': 'Прогрес',
    'progress.workouts': 'Тренувань',
    'progress.minutes': 'Хвилин',
    'progress.days': 'Днів',
    'progress.week': 'Тиждень',
    'progress.achievements': 'Досягнення',
    
    // Common
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.add': 'Додати',
    'common.close': 'Закрити',
    'common.today': 'Сьогодні',
    'common.yesterday': 'Вчора',
  },
  en: {
    // Navigation
    'nav.exercises': 'Exercises',
    'nav.calories': 'Calories',
    'nav.progress': 'Progress',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Settings
    'settings.general': 'General',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.theme.auto': 'Auto',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.notifications': 'Notifications',
    'settings.sound': 'Sound',
    'settings.units': 'Units',
    'settings.autoTrack': 'Auto Track',
    'settings.sync': 'Sync',
    'settings.biometric': 'Biometric Auth',
    'settings.autoUpdate': 'Auto Update',
    
    // Exercises
    'exercises.title': 'Exercises',
    'exercises.add': 'Add Exercise',
    'exercises.edit': 'Edit Exercise',
    'exercises.delete': 'Delete Exercise',
    'exercises.category.all': 'All',
    'exercises.category.chest': 'Chest',
    'exercises.category.back': 'Back',
    'exercises.category.legs': 'Legs',
    'exercises.category.shoulders': 'Shoulders',
    'exercises.category.arms': 'Arms',
    'exercises.category.core': 'Core',
    'exercises.category.cardio': 'Cardio',
    'exercises.sets': 'Sets',
    'exercises.reps': 'Reps',
    'exercises.weight': 'Weight',
    'exercises.restTime': 'Rest',
    'exercises.empty': 'No exercises in this category',
    
    // Profile
    'profile.title': 'Profile',
    'profile.weight': 'Weight',
    'profile.height': 'Height',
    'profile.bmi': 'BMI',
    'profile.goal': 'Goal',
    'profile.lifestyle': 'Lifestyle',
    'profile.workoutTime': 'Workout Time',
    'profile.weightHistory': 'Weight History',
    'profile.addWeight': 'Add Weight',
    'profile.edit': 'Edit Profile',
    'profile.stats': 'Statistics',
    'profile.workouts': 'Exercises',
    'profile.sets': 'Sets',
    'profile.weightEntries': 'Weight Entries',
    
    // Progress
    'progress.title': 'Progress',
    'progress.workouts': 'Workouts',
    'progress.minutes': 'Minutes',
    'progress.days': 'Days',
    'progress.week': 'Week',
    'progress.achievements': 'Achievements',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.today': 'Today',
    'common.yesterday': 'Yesterday',
  },
  pl: {
    // Navigation
    'nav.exercises': 'Ćwiczenia',
    'nav.calories': 'Kalorie',
    'nav.progress': 'Postęp',
    'nav.profile': 'Profil',
    'nav.settings': 'Ustawienia',
    
    // Settings
    'settings.general': 'Ogólne',
    'settings.theme': 'Motyw',
    'settings.language': 'Język',
    'settings.theme.auto': 'Automatyczny',
    'settings.theme.light': 'Jasny',
    'settings.theme.dark': 'Ciemny',
    'settings.notifications': 'Powiadomienia',
    'settings.sound': 'Dźwięk',
    'settings.units': 'Jednostki',
    'settings.autoTrack': 'Auto śledzenie',
    'settings.sync': 'Synchronizacja',
    'settings.biometric': 'Uwierzytelnianie biometryczne',
    'settings.autoUpdate': 'Auto aktualizacja',
    
    // Exercises
    'exercises.title': 'Ćwiczenia',
    'exercises.add': 'Dodaj ćwiczenie',
    'exercises.edit': 'Edytuj ćwiczenie',
    'exercises.delete': 'Usuń ćwiczenie',
    'exercises.category.all': 'Wszystkie',
    'exercises.category.chest': 'Klatka',
    'exercises.category.back': 'Plecy',
    'exercises.category.legs': 'Nogi',
    'exercises.category.shoulders': 'Barki',
    'exercises.category.arms': 'Ręce',
    'exercises.category.core': 'Brzuch',
    'exercises.category.cardio': 'Cardio',
    'exercises.sets': 'Serie',
    'exercises.reps': 'Powtórzenia',
    'exercises.weight': 'Waga',
    'exercises.restTime': 'Odpoczynek',
    'exercises.empty': 'Brak ćwiczeń w tej kategorii',
    
    // Profile
    'profile.title': 'Profil',
    'profile.weight': 'Waga',
    'profile.height': 'Wzrost',
    'profile.bmi': 'BMI',
    'profile.goal': 'Cel',
    'profile.lifestyle': 'Styl życia',
    'profile.workoutTime': 'Czas treningu',
    'profile.weightHistory': 'Historia wagi',
    'profile.addWeight': 'Dodaj wagę',
    'profile.edit': 'Edytuj profil',
    'profile.stats': 'Statystyki',
    'profile.workouts': 'Ćwiczeń',
    'profile.sets': 'Serii',
    'profile.weightEntries': 'Wpisów wagi',
    
    // Progress
    'progress.title': 'Postęp',
    'progress.workouts': 'Treningów',
    'progress.minutes': 'Minut',
    'progress.days': 'Dni',
    'progress.week': 'Tydzień',
    'progress.achievements': 'Osiągnięcia',
    
    // Common
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.delete': 'Usuń',
    'common.edit': 'Edytuj',
    'common.add': 'Dodaj',
    'common.close': 'Zamknij',
    'common.today': 'Dzisiaj',
    'common.yesterday': 'Wczoraj',
  },
  es: {
    // Navigation
    'nav.exercises': 'Ejercicios',
    'nav.calories': 'Calorías',
    'nav.progress': 'Progreso',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    
    // Settings
    'settings.general': 'General',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.theme.auto': 'Automático',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Oscuro',
    'settings.notifications': 'Notificaciones',
    'settings.sound': 'Sonido',
    'settings.units': 'Unidades',
    'settings.autoTrack': 'Seguimiento automático',
    'settings.sync': 'Sincronizar',
    'settings.biometric': 'Autenticación biométrica',
    'settings.autoUpdate': 'Actualización automática',
    
    // Exercises
    'exercises.title': 'Ejercicios',
    'exercises.add': 'Agregar ejercicio',
    'exercises.edit': 'Editar ejercicio',
    'exercises.delete': 'Eliminar ejercicio',
    'exercises.category.all': 'Todos',
    'exercises.category.chest': 'Pecho',
    'exercises.category.back': 'Espalda',
    'exercises.category.legs': 'Piernas',
    'exercises.category.shoulders': 'Hombros',
    'exercises.category.arms': 'Brazos',
    'exercises.category.core': 'Core',
    'exercises.category.cardio': 'Cardio',
    'exercises.sets': 'Series',
    'exercises.reps': 'Repeticiones',
    'exercises.weight': 'Peso',
    'exercises.restTime': 'Descanso',
    'exercises.empty': 'No hay ejercicios en esta categoría',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.weight': 'Peso',
    'profile.height': 'Altura',
    'profile.bmi': 'IMC',
    'profile.goal': 'Objetivo',
    'profile.lifestyle': 'Estilo de vida',
    'profile.workoutTime': 'Tiempo de entrenamiento',
    'profile.weightHistory': 'Historial de peso',
    'profile.addWeight': 'Agregar peso',
    'profile.edit': 'Editar perfil',
    'profile.stats': 'Estadísticas',
    'profile.workouts': 'Ejercicios',
    'profile.sets': 'Series',
    'profile.weightEntries': 'Entradas de peso',
    
    // Progress
    'progress.title': 'Progreso',
    'progress.workouts': 'Entrenamientos',
    'progress.minutes': 'Minutos',
    'progress.days': 'Días',
    'progress.week': 'Semana',
    'progress.achievements': 'Logros',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.close': 'Cerrar',
    'common.today': 'Hoy',
    'common.yesterday': 'Ayer',
  },
};

const languageNames: Record<Language, string> = {
  uk: 'Українська',
  en: 'English',
  pl: 'Polski',
  es: 'Español',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uk');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored && (stored === 'uk' || stored === 'en' || stored === 'pl' || stored === 'es')) {
        setLanguageState(stored as Language);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getLanguageName(lang: Language): string {
  return languageNames[lang];
}

