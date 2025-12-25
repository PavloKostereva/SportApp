import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { getLanguageName, useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Language } from '@/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

type SettingItemSwitch = {
  id: string;
  label: string;
  icon:
    | 'bell.fill'
    | 'speaker.wave.2.fill'
    | 'ruler.fill'
    | 'heart.fill'
    | 'target'
    | 'arrow.clockwise'
    | 'key.fill'
    | 'icloud.fill';
  value: boolean;
  onValueChange: Dispatch<SetStateAction<boolean>>;
  type: 'switch';
};

type SettingItemText = {
  id: string;
  label: string;
  icon: 'info.circle.fill' | 'paintbrush.fill' | 'globe' | 'target';
  value: string;
  type: 'text';
};

type SettingItemAction = {
  id: string;
  label: string;
  icon:
    | 'questionmark.circle.fill'
    | 'envelope.fill'
    | 'lock.shield.fill'
    | 'arrow.down.circle.fill'
    | 'arrow.up.circle.fill'
    | 'icloud.fill'
    | 'chart.bar.fill';
  type: 'action';
};

type SettingItemTheme = {
  id: string;
  label: string;
  icon: 'paintbrush.fill';
  type: 'theme';
};

type SettingItemLanguage = {
  id: string;
  label: string;
  icon: 'globe';
  type: 'language';
};

type SettingItem =
  | SettingItemSwitch
  | SettingItemText
  | SettingItemAction
  | SettingItemTheme
  | SettingItemLanguage;

export default function SettingsScreen() {
  const { themeMode, setThemeMode, currentTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);
  const [autoTrackWorkouts, setAutoTrackWorkouts] = useState(false);
  const [autoTrackCalories, setAutoTrackCalories] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const handleThemeChange = () => {
    if (themeMode === 'auto') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };

  const getThemeLabel = () => {
    if (themeMode === 'auto') {
      return t('settings.themeOptions.auto');
    } else if (themeMode === 'light') {
      return t('settings.themeOptions.light');
    } else {
      return t('settings.themeOptions.dark');
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    setShowLanguageModal(false);
  };

  const settingsSections: Array<{ title: string; items: SettingItem[] }> = [
    {
      title: t('settings.general'),
      items: [
        {
          id: 'theme',
          label: t('settings.theme'),
          icon: 'paintbrush.fill',
          type: 'theme',
        },
        {
          id: 'language',
          label: t('settings.language'),
          icon: 'globe',
          type: 'language',
        },
        {
          id: 'notifications',
          label: t('settings.notifications'),
          icon: 'bell.fill',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
          type: 'switch',
        },
        {
          id: 'sound',
          label: t('settings.sound'),
          icon: 'speaker.wave.2.fill',
          value: soundEnabled,
          onValueChange: setSoundEnabled,
          type: 'switch',
        },
        {
          id: 'units',
          label: t('settings.units'),
          icon: 'ruler.fill',
          value: metricUnits,
          onValueChange: setMetricUnits,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Тренування',
      items: [
        {
          id: 'autoTrack',
          label: 'Автоматичне відстеження',
          icon: 'arrow.clockwise',
          value: autoTrackWorkouts,
          onValueChange: setAutoTrackWorkouts,
          type: 'switch',
        },
        {
          id: 'goals',
          label: 'Цілі тренувань',
          icon: 'target',
          value: false,
          onValueChange: () => {},
          type: 'switch',
        },
        {
          id: 'heartRate',
          label: 'Відстеження пульсу',
          icon: 'heart.fill',
          value: false,
          onValueChange: () => {},
          type: 'switch',
        },
      ],
    },
    {
      title: 'Калорії',
      items: [
        {
          id: 'autoTrackCalories',
          label: 'Автоматичне відстеження',
          icon: 'arrow.clockwise',
          value: autoTrackCalories,
          onValueChange: setAutoTrackCalories,
          type: 'switch',
        },
        {
          id: 'dailyGoal',
          label: 'Щоденна мета',
          icon: 'target',
          value: '2000 ккал',
          type: 'text',
        },
      ],
    },
    {
      title: 'Безпека та синхронізація',
      items: [
        {
          id: 'biometric',
          label: 'Біометрична автентифікація',
          icon: 'key.fill',
          value: biometricAuth,
          onValueChange: setBiometricAuth,
          type: 'switch',
        },
        {
          id: 'sync',
          label: 'Хмарна синхронізація',
          icon: 'icloud.fill',
          value: syncEnabled,
          onValueChange: setSyncEnabled,
          type: 'switch',
        },
        {
          id: 'backup',
          label: 'Резервне копіювання',
          icon: 'arrow.up.circle.fill',
          type: 'action',
        },
        {
          id: 'export',
          label: 'Експорт даних',
          icon: 'arrow.down.circle.fill',
          type: 'action',
        },
      ],
    },
    {
      title: 'Додаток',
      items: [
        {
          id: 'version',
          label: 'Версія',
          icon: 'info.circle.fill',
          value: '1.0.0',
          type: 'text',
        },
        {
          id: 'autoUpdate',
          label: 'Автоматичне оновлення',
          icon: 'arrow.clockwise',
          value: autoUpdate,
          onValueChange: setAutoUpdate,
          type: 'switch',
        },
        {
          id: 'analytics',
          label: 'Статистика та аналітика',
          icon: 'chart.bar.fill',
          type: 'action',
        },
      ],
    },
    {
      title: 'Допомога',
      items: [
        {
          id: 'help',
          label: 'Довідка',
          icon: 'questionmark.circle.fill',
          type: 'action',
        },
        {
          id: 'feedback',
          label: "Зворотний зв'язок",
          icon: 'envelope.fill',
          type: 'action',
        },
        {
          id: 'privacy',
          label: 'Політика конфіденційності',
          icon: 'lock.shield.fill',
          type: 'action',
        },
      ],
    },
  ];

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#6C7CE7', dark: '#1A237E' }}
        headerImage={
          <IconSymbol size={310} color="#FFFFFF" name="gearshape.fill" style={styles.headerImage} />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}>
            {t('nav.settings')}
          </ThemedText>
        </ThemedView>

        <ScrollView style={styles.settingsList}>
          {settingsSections.map((section, sectionIndex) => (
            <ThemedView key={sectionIndex} style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              {section.items.map((item) => {
                if (item.type === 'theme') {
                  return (
                    <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={handleThemeChange}>
                      <ThemedView style={styles.settingItem}>
                        <ThemedView style={styles.settingLeft}>
                          <IconSymbol
                            size={24}
                            name={item.icon}
                            color={iconColor}
                            style={styles.settingIcon}
                          />
                          <ThemedText type="defaultSemiBold" style={styles.settingLabel}>
                            {item.label}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.settingRight}>
                          <ThemedView style={styles.themeContainer}>
                            <ThemedText style={styles.settingValue}>{getThemeLabel()}</ThemedText>
                            <IconSymbol
                              size={20}
                              name="chevron.right"
                              color={iconColor}
                              style={styles.chevronIcon}
                            />
                          </ThemedView>
                        </ThemedView>
                      </ThemedView>
                    </TouchableOpacity>
                  );
                }
                if (item.type === 'language') {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        setShowLanguageModal(true);
                      }}>
                      <ThemedView style={styles.settingItem}>
                        <ThemedView style={styles.settingLeft}>
                          <IconSymbol
                            size={24}
                            name={item.icon}
                            color={iconColor}
                            style={styles.settingIcon}
                          />
                          <ThemedText type="defaultSemiBold" style={styles.settingLabel}>
                            {item.label}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.settingRight}>
                          <ThemedView style={styles.themeContainer}>
                            <ThemedText style={styles.settingValue}>
                              {getLanguageName(language)}
                            </ThemedText>
                            <IconSymbol
                              size={20}
                              name="chevron.right"
                              color={iconColor}
                              style={styles.chevronIcon}
                            />
                          </ThemedView>
                        </ThemedView>
                      </ThemedView>
                    </TouchableOpacity>
                  );
                }
                return (
                  <ThemedView key={item.id} style={styles.settingItem}>
                    <ThemedView style={styles.settingLeft}>
                      <IconSymbol
                        size={24}
                        name={item.icon}
                        color={iconColor}
                        style={styles.settingIcon}
                      />
                      <ThemedText type="defaultSemiBold" style={styles.settingLabel}>
                        {item.label}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.settingRight}>
                      {item.type === 'switch' && (
                        <Switch value={item.value} onValueChange={item.onValueChange} />
                      )}
                      {item.type === 'text' && (
                        <ThemedText style={styles.settingValue}>{item.value}</ThemedText>
                      )}
                      {item.type === 'action' && (
                        <IconSymbol
                          size={20}
                          name="chevron.right"
                          color={iconColor}
                          style={styles.chevronIcon}
                        />
                      )}
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>
          ))}
        </ScrollView>
      </ParallaxScrollView>

      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          console.log('Modal close requested');
          setShowLanguageModal(false);
        }}>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { borderWidth: 1 }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="title" style={styles.modalTitle}>
                {t('settings.language')}
              </ThemedText>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <IconSymbol size={24} name="xmark.circle.fill" color={iconColor} />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.languageList}>
              {(['uk', 'en', 'pl', 'es'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageItem,
                    language === lang && { backgroundColor: tintColor + '20' },
                  ]}
                  onPress={() => handleLanguageChange(lang)}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[styles.languageName, language === lang && { color: tintColor }]}>
                    {getLanguageName(lang)}
                  </ThemedText>
                  {language === lang && (
                    <IconSymbol size={20} name="checkmark.circle.fill" color={tintColor} />
                  )}
                </TouchableOpacity>
              ))}
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
    gap: 8,
    marginBottom: 16,
  },
  settingsList: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronIcon: {
    opacity: 0.5,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
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
    maxHeight: '70%',
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
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  languageName: {
    fontSize: 16,
  },
});
