import { useState, type FormEvent } from 'react';
import { authApi } from '../api/auth';
import { useAuthForm } from '../hooks/useAuthForm';
import { normalizeErrorMessage } from '../utils/validation';

export function ForgotPasswordPage() {
  const { validateEmail, errors, setErrors, clearError } = useAuthForm();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('idle');
      setMessage('');
      await authApi.forgotPassword(email);
      setStatus('success');
      setMessage('A password reset link has been sent to your inbox.');
    } catch (submitError) {
      const nextMessage = submitError instanceof Error ? submitError.message : 'Unable to send the reset link.';
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
                "url('https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80')",
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
            <h1 className="mt-2 font-serif text-[38px] text-[#231a12]">Reset your password</h1>
            <p className="mt-3 text-[16px] text-[#4e4540]">
              Enter the email linked to your Atelier account and we’ll send the reset instructions.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Email Address</label>
                <input
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError('email');
                    if (message) setMessage('');
                    if (status === 'success') setStatus('idle');
                  }}
                  type="email"
                  className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  placeholder="client@domain.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
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
                {isSubmitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
