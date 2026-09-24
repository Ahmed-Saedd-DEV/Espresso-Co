import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/account', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fff8f5] py-10 text-[#231a12]">
      <div className="mx-auto grid max-w-[1360px] gap-8 px-5 md:px-12 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#fdebde] p-8 lg:col-span-5 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_55%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px]">coffee_maker</span>
              <span className="font-serif text-[26px]">Espresso Atelier</span>
            </div>

            <div className="py-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff8f5]/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">
                <span className="h-2 w-2 rounded-full bg-[#ba7334] animate-pulse" />
                Member access
              </div>
              <h1 className="font-serif text-[32px] leading-tight text-[#231a12] md:text-[38px]">
                Roasted with intent, brewed for contemplation.
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-7 text-[#4e4540]">
                Welcome to the sanctuary of unhurried extraction. Access your roaster allocation, cellar subscriptions, and personal tasting registers.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#231a14]/75 p-4 text-[#fff8f5] shadow-lg">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#f7e5d8]">
                <span>Atelier roast index</span>
                <span>Medium french • 208°C</span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={`h-2 rounded-full ${index < 4 ? 'bg-[#ba7334]' : 'bg-white/25'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[28px] border border-[#e8dfd5] bg-white p-8 shadow-sm md:p-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">
                  Authentication
                </div>
                <h2 className="mt-2 font-serif text-[36px] text-[#231a12]">
                  Sign in to Atelier
                </h2>
              </div>
              <div className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">
                secure
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Email address</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  placeholder="client@domain.com"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 text-[13px] text-[#4e4540]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#000000]" />
                  Remember this workstation
                </label>
                <a href="/forgot-password" className="font-semibold text-[#ba7334] hover:text-[#231a12]">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#231a12] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in to Atelier'}
              </button>
            </form>

            <div className="mt-8 rounded-lg bg-[#fff1e8] p-4 text-center text-[14px] text-[#4e4540]">
              Unregistered with the Roaster Registry?
              <a href="/register" className="ml-2 font-semibold text-[#ba7334] hover:text-[#231a12]">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
