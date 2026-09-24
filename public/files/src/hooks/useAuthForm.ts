import { useMemo, useState } from 'react';
import { isStrongPassword, isValidEmail } from '../utils/validation';

export function useAuthForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required.';
    if (!isValidEmail(email)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (password: string, confirmPassword?: string) => {
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return 'Password must include at least one uppercase letter, one lowercase letter, and one number.';
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const validateRegister = (name: string, email: string, password: string, confirmPassword: string) => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validatePassword(password, confirmPassword);
    if (passwordError) nextErrors.password = passwordError;
    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateLogin = (email: string, password: string) => {
    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    if (!password) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  return useMemo(
    () => ({
      errors,
      setErrors,
      clearError,
      validateLogin,
      validateRegister,
      validateEmail,
      validatePassword,
      isStrongPassword,
    }),
    [errors]
  );
}
