export const formatDate = (date: string | Date, locale: string = 'uk-UA'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} кг`;
};

