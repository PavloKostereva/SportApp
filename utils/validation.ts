export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWeight = (weight: number): boolean => {
  return weight > 0 && weight < 500;
};

export const validateHeight = (height: number): boolean => {
  return height > 0 && height < 300;
};

export const validateExerciseName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100;
};

