import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { normalizeErrorMessage } from '../utils/validation';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const verifiedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Checking your verification link…');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please request a fresh email link.');
      return;
    }

    if (verifiedRef.current) {
      return;
    }

    verifiedRef.current = true;

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email has been verified successfully.');
      } catch (submitError) {
        const nextMessage = submitError instanceof Error ? submitError.message : 'Unable to verify your email.';
        setStatus('error');
        setMessage(normalizeErrorMessage(nextMessage));
      }
    };

    void verifyEmail();
  }, [token]);

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
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Membership</div>
            <h1 className="mt-2 font-serif text-[38px] text-[#231a12]">Verify your email</h1>

            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : status === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-[#e8dfd5] bg-[#fff8f5] text-[#4e4540]'
              }`}
            >
              {message}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {status === 'success' && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#231a12]"
                >
                  Continue to sign in
                </Link>
              )}

              {status === 'error' && (
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center rounded-lg border border-[#e8dfd5] bg-white px-6 py-3.5 text-[13px] font-semibold text-[#231a12] transition hover:border-[#ba7334]"
                >
                  Request a new link
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
