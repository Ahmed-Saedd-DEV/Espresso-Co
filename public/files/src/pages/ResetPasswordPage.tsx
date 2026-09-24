import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthForm } from '../hooks/useAuthForm';
import { normalizeErrorMessage } from '../utils/validation';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { validatePassword, errors, setErrors, clearError } = useAuthForm();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setStatus('idle');
      setMessage('Reset token is missing. Please request a new password link.');
      return;
    }

    const nextErrors: Record<string, string> = {};
    const passwordError = validatePassword(newPassword, confirmPassword);

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');
      await authApi.resetPassword(token, newPassword);
      setStatus('success');
      setMessage('Your password has been reset successfully.');
    } catch (submitError) {
      const nextMessage = submitError instanceof Error ? submitError.message : 'Unable to update your password.';
      setStatus('idle');
      setMessage(normalizeErrorMessage(nextMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1360px] px-5 py-14 md:px-12">
      <div className="grid min-h-[720px] items-stretch gap-8 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#fdebde] p-8 lg:col-span-5 lg:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231a12]/80 via-[#231a12]/40 to-[#231a12]/20" />
          <div className="relative z-10 flex h-full flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[26px]">coffee_maker</span>
                <span className="font-serif text-[22px]">Espresso Atelier</span>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]">Batch 042 · Sol</span>
            </div>
            <div>
              <span className="material-symbols-outlined text-[40px] text-[#f7d5a5]">format_quote</span>
              <h2 className="mt-4 max-w-sm font-serif text-[34px] leading-tight">Roasted with intent, brewed for contemplation.</h2>
              <p className="mt-4 max-w-sm text-[15px] leading-7 text-[#f3e5d6]">
                Welcome to the sanctuary of unhurried extraction. Access your roaster allocation, cellar subscriptions, and personal tasting registers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center lg:col-span-7">
          <div className="w-full rounded-[28px] border border-[#e8dfd5] bg-white p-8 shadow-sm md:p-10">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Authentication</div>
            <h1 className="mt-2 font-serif text-[38px] text-[#231a12]">Create a new password</h1>
            <p className="mt-3 text-[16px] text-[#4e4540]">
              Choose a secure password for your Atelier account.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    clearError('password');
                    if (message) setMessage('');
                    if (status === 'success') setStatus('idle');
                  }}
                  className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  placeholder="••••••••••••"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    clearError('confirmPassword');
                    if (message) setMessage('');
                    if (status === 'success') setStatus('idle');
                  }}
                  className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  placeholder="••••••••••••"
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {message && (
                <div
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#231a12] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Updating…' : 'Update password'}
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-6 text-center text-[14px] text-[#4e4540]">
                Ready to sign in?
                <Link to="/login" className="ml-2 font-semibold text-[#ba7334]">
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
