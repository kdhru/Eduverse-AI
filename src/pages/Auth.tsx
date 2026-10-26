import { useState, useRef, useEffect, type ReactNode, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Mail, Lock, Eye, EyeOff, UserRound, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

function AuthFrame({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  const location = useLocation()
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mist px-4 py-10">
      <div className="aurora" />
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
        className="glass-deep relative z-10 w-full max-w-md rounded-[2rem] p-8 md:p-10"
      >
        <Link to="/" className="mb-7 flex items-center justify-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_10px_24px_-8px_rgba(125,136,230,0.8)]">
            <GraduationCap size={22} />
          </div>
          <span className="font-display text-xl font-bold text-ink">EduMind <span className="text-peri-deep">AI</span></span>
        </Link>
        <h1 className="text-center font-display text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1.5 text-center text-[13.5px] text-ink-soft">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </motion.div>
    </div>
  )
}

function Field({ icon, type = 'text', placeholder, right }: { icon: ReactNode; type?: string; placeholder: string; right?: ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-white/80 py-3 pl-11 pr-11 text-sm text-ink outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
      />
      {right && <span className="absolute right-4 top-1/2 -translate-y-1/2">{right}</span>}
    </div>
  )
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-line bg-white py-3 text-sm font-bold text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1A7.2 7.2 0 0 1 5.46 12c0-.73.13-1.44.37-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
      Continue with Google
    </button>
  )
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted">
      <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
    </div>
  )
}

const PrimaryBtn = ({ children }: { children: ReactNode }) => (
  <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(125,136,230,0.9)] transition hover:-translate-y-0.5">
    {children} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
  </button>
)

export function Login() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student')
  const dest = { student: '/otp?to=/app', teacher: '/otp?to=/teacher', admin: '/otp?to=/admin' }[role]
  const submit = (e: FormEvent) => { e.preventDefault(); navigate(dest) }
  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to continue your learning journey">
      <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl bg-white/70 p-1">
        {(['student', 'teacher', 'admin'] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} type="button"
            className={`rounded-xl py-2 text-[12px] font-bold capitalize transition-all ${role === r ? 'bg-gradient-to-r from-peri to-lilac text-white shadow' : 'text-ink-soft hover:text-ink'}`}>
            {r}
          </button>
        ))}
      </div>
      <GoogleButton onClick={() => navigate(dest)} />
      <Divider />
      <form onSubmit={submit} className="space-y-3.5">
        <Field icon={<Mail size={16} />} type="email" placeholder="you@university.edu" />
        <Field
          icon={<Lock size={16} />} type={show ? 'text' : 'password'} placeholder="Password"
          right={<button type="button" onClick={() => setShow(!show)} className="text-muted transition hover:text-ink">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
        />
        <div className="flex items-center justify-between text-[12.5px]">
          <label className="flex items-center gap-1.5 font-medium text-ink-soft"><input type="checkbox" defaultChecked className="accent-[#7d88e6]" /> Remember me</label>
          <Link to="/forgot-password" className="font-bold text-peri-deep transition hover:underline">Forgot password?</Link>
        </div>
        <PrimaryBtn>Sign In</PrimaryBtn>
      </form>
      <p className="mt-6 text-center text-[13px] text-ink-soft">
        New to EduMind? <Link to="/register" className="font-bold text-peri-deep transition hover:underline">Create an account</Link>
      </p>
    </AuthFrame>
  )
}

export function Register() {
  const navigate = useNavigate()
  const submit = (e: FormEvent) => { e.preventDefault(); navigate('/otp?to=/app') }
  return (
    <AuthFrame title="Create your account" subtitle="Five AI agents, personalized to how you learn">
      <GoogleButton onClick={() => navigate('/otp?to=/app')} />
      <Divider />
      <form onSubmit={submit} className="space-y-3.5">
        <Field icon={<UserRound size={16} />} placeholder="Full name" />
        <Field icon={<Mail size={16} />} type="email" placeholder="you@university.edu" />
        <Field icon={<Lock size={16} />} type="password" placeholder="Create password (8+ characters)" />
        <div className="flex items-start gap-2 rounded-2xl bg-peri-soft/70 px-4 py-3 text-[12px] leading-relaxed text-peri-deep">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          Your documents stay in your private tenant and are never used for model training.
        </div>
        <PrimaryBtn>Create Account</PrimaryBtn>
      </form>
      <p className="mt-6 text-center text-[13px] text-ink-soft">
        Already have an account? <Link to="/login" className="font-bold text-peri-deep transition hover:underline">Sign in</Link>
      </p>
    </AuthFrame>
  )
}

export function ForgotPassword() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  return (
    <AuthFrame title="Reset your password" subtitle="We’ll email you a one-time verification code">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-3.5">
            <Field icon={<Mail size={16} />} type="email" placeholder="you@university.edu" />
            <PrimaryBtn>Send Reset Code</PrimaryBtn>
          </motion.form>
        ) : (
          <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-soft text-[#3d9a6e]"><CheckCircle2 size={26} /></div>
            <p className="mt-4 text-sm font-semibold text-ink">Code sent!</p>
            <p className="mt-1 text-[13px] text-ink-soft">Check your inbox for a 6-digit verification code.</p>
            <button onClick={() => navigate('/otp?to=/login')} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-peri to-lilac py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5">
              Enter Verification Code
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-6 text-center text-[13px]">
        <Link to="/login" className="inline-flex items-center gap-1 font-bold text-peri-deep transition hover:underline"><ArrowLeft size={13} /> Back to login</Link>
      </p>
    </AuthFrame>
  )
}

export function OtpVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const to = new URLSearchParams(location.search).get('to') || '/app'
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [verifying, setVerifying] = useState(false)

  useEffect(() => { refs.current[0]?.focus() }, [])

  const handle = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
    if (next.every(d => d !== '')) {
      setVerifying(true)
      setTimeout(() => navigate(to), 900)
    }
  }

  return (
    <AuthFrame title="Verify it’s you" subtitle="Enter the 6-digit code sent to a•••v@university.edu">
      <div className="flex justify-center gap-2.5">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            value={d}
            maxLength={1}
            inputMode="numeric"
            onChange={e => handle(i, e.target.value)}
            onKeyDown={e => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus() }}
            className="h-14 w-11 rounded-2xl border border-line bg-white/85 text-center font-display text-xl font-bold text-ink outline-none transition focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.18)]"
          />
        ))}
      </div>
      <AnimatePresence>
        {verifying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-peri-deep">
            <Sparkles size={15} className="animate-spin" /> Verifying…
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-6 text-center text-[13px] text-ink-soft">
        Didn’t receive it? <button className="font-bold text-peri-deep transition hover:underline">Resend code (0:42)</button>
      </p>
      <p className="mt-3 text-center text-[12px] text-muted">Tip: any 6 digits work in this prototype ✨</p>
    </AuthFrame>
  )
}

export default function Auth() {
  const location = useLocation()
  const pathname = location.pathname

  if (pathname === '/register') return <Register />
  if (pathname === '/forgot-password') return <ForgotPassword />
  if (pathname === '/otp') return <OtpVerification />
  return <Login />
}
