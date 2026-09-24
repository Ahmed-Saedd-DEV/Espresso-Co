import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      navigate('/account', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create an account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1360px] px-5 py-14 md:px-12">
      <div className="grid gap-8 overflow-hidden rounded-[28px] bg-[#fdebde] shadow-sm lg:grid-cols-12">
        <div className="relative overflow-hidden lg:col-span-5">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuARVlexVTedqbzKsYff7i6VU5hk7kLnXAdicg6nLwzwVn71sVvCv6R8eX3j2jdp6vOvDMyEoS3cZBeDy0Y5atSeyRFslxbDps8avQQIVG_2XGUo4Y8O4O2jBUxZTCBA1OwjH284mjckWYzXJov8JGWTj8Rvq1GfLR_BP8SdEezwD7xTPdqrmghva9XnemmC1bAURlahFSpMehpmcpx85DWW8HikbnHjw4TUlQJdIe_bRjPB9CHEXqO6')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231a14]/90 via-[#231a14]/60 to-[#231a14]/20" />
          <div className="relative z-10 flex min-h-[340px] flex-col justify-between p-8 lg:min-h-full lg:p-12">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">coffee_maker</span>
                <span className="font-serif text-[26px]">Espresso Atelier</span>
              </div>
              <span className="rounded-full bg-[#231a14]/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#f7e5d8]">
                Batch 042 • Sol
              </span>
            </div>

            <div>
              <span className="material-symbols-outlined text-[36px] text-[#ba7334]">format_quote</span>
              <h1 className="mt-4 font-serif text-[42px] leading-tight text-[#fff8f5]">
                Roasted with intent, brewed for contemplation.
              </h1>
            </div>

            <div className="rounded-lg bg-[#231a14]/55 p-4 text-[#fff8f5] backdrop-blur-sm">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#f7e5d8]">
                <span>Atelier Roast Index</span>
                <span>Medium French • 208°C</span>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={`h-2 rounded-full ${index < 4 ? 'bg-[#ba7334]' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 md:p-12">
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Membership</div>
            <h2 className="mt-2 font-serif text-[38px] text-[#231a12]">Join the Reserve Club</h2>
            <p className="mt-2 text-[16px] text-[#4e4540]">Receive curations directly from micro-lot harvests.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Full Legal Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12]"
                placeholder="Elena Rostova"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12]"
                placeholder="elena.rostova@domaine.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12]"
                placeholder="••••••••••••"
                required
              />
            </div>
            <div className="rounded-lg bg-[#fff1e8] p-3.5">
              <div className="flex items-center justify-between text-[12px] text-[#4e4540]">
                <span>Complexity Index</span>
                <span className="font-semibold text-[#ba7334]">Moderate</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f7e5d8]">
                <div className="h-full w-2/3 rounded-full bg-[#ba7334]" />
              </div>
              <div className="mt-2 grid gap-2 text-[11px] text-[#231a12] sm:grid-cols-3">
                <div className="flex items-center gap-1">✓ Min 8 chars</div>
                <div className="flex items-center gap-1">✓ Uppercase</div>
                <div className="flex items-center gap-1 text-[#4e4540]">○ 1+ Digit</div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-[#fff1e8] p-4 text-center text-[14px] text-[#4e4540]">
            Already possess Atelier membership?
            <a href="/login" className="ml-2 font-semibold text-[#ba7334]">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
