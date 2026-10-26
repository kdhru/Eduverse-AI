import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins } from 'lucide-react'

// ---------------- Level system ----------------
export const LEVELS = [
  { name: 'Novice', min: 0, icon: '🌱' },
  { name: 'Learner', min: 400, icon: '📘' },
  { name: 'Explorer', min: 900, icon: '🧭' },
  { name: 'Achiever', min: 1500, icon: '🎯' },
  { name: 'Scholar', min: 2200, icon: '🎓' },
  { name: 'Master', min: 3000, icon: '🏆' },
  { name: 'Grandmaster', min: 4200, icon: '👑' },
]

export function levelFor(totalEarned: number) {
  let idx = 0
  LEVELS.forEach((l, i) => { if (totalEarned >= l.min) idx = i })
  const cur = LEVELS[idx]
  const next = LEVELS[idx + 1]
  const span = next ? next.min - cur.min : 1
  const into = totalEarned - cur.min
  return {
    index: idx + 1,
    name: cur.name,
    icon: cur.icon,
    next: next?.name ?? null,
    nextAt: next?.min ?? cur.min,
    toNext: next ? next.min - totalEarned : 0,
    progress: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
  }
}

export function nextLevelFor(totalEarned: number) {
  return LEVELS.find(l => l.min > totalEarned) ?? null
}

// ---------------- Context ----------------
type Toast = { id: number; amount: number; reason: string }

type PointsState = {
  balance: number
  totalEarned: number
  unlocked: string[]
  claimed: string[]
  completedLessons: string[]
  addPoints: (amount: number, reason: string) => void
  spendPoints: (amount: number) => boolean
  unlockCourse: (id: string, cost: number) => boolean
  claimReward: (id: string, cost: number) => boolean
  completeLesson: (subjectId: string) => void
}

const PointsContext = createContext<PointsState | null>(null)

const STORAGE_KEY = 'edumind_points_v2'
const SEED = { balance: 1240, totalEarned: 1240, unlocked: [] as string[], claimed: [] as string[], completedLessons: [] as string[] }

function load(): typeof SEED {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...SEED, ...(JSON.parse(raw) as Partial<typeof SEED>) }
  } catch { /* ignore */ }
  return SEED
}

export function PointsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const pushToast = useCallback((amount: number, reason: string) => {
    const id = ++toastId.current
    setToasts(t => [...t.slice(-3), { id, amount, reason }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  const addPoints = useCallback((amount: number, reason: string) => {
    setState(s => ({ ...s, balance: s.balance + amount, totalEarned: s.totalEarned + amount }))
    pushToast(amount, reason)
  }, [pushToast])

  const spendPoints = useCallback((amount: number) => {
    let ok = false
    setState(s => {
      if (s.balance < amount) return s
      ok = true
      return { ...s, balance: s.balance - amount }
    })
    return ok
  }, [])

  const unlockCourse = useCallback((id: string, cost: number) => {
    let ok = false
    setState(s => {
      if (s.unlocked.includes(id) || s.balance < cost) return s
      ok = true
      return { ...s, balance: s.balance - cost, unlocked: [...s.unlocked, id] }
    })
    if (ok) pushToast(-cost, 'Course unlocked 🎉')
    return ok
  }, [pushToast])

  const claimReward = useCallback((id: string, cost: number) => {
    let ok = false
    setState(s => {
      if (s.claimed.includes(id) || s.balance < cost) return s
      ok = true
      return { ...s, balance: s.balance - cost, claimed: [...s.claimed, id] }
    })
    if (ok) pushToast(-cost, 'Reward claimed 🎁')
    return ok
  }, [pushToast])

  const completeLesson = useCallback((subjectId: string) => {
    let ok = false
    setState(s => {
      if (s.completedLessons.includes(subjectId)) return s
      ok = true
      return { ...s, balance: s.balance + 20, totalEarned: s.totalEarned + 20, completedLessons: [...s.completedLessons, subjectId] }
    })
    if (ok) pushToast(20, 'Lesson completed')
  }, [pushToast])

  return (
    <PointsContext.Provider value={{ ...state, addPoints, spendPoints, unlockCourse, claimReward, completeLesson }}>
      {children}
      {/* floating point-gain toasts */}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex flex-col items-end gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 shadow-[0_14px_40px_-14px_rgba(93,95,160,0.5)] backdrop-blur-xl ${
                t.amount >= 0 ? 'border-[#e8d9a0] bg-[#fdf8e9]/95' : 'border-[#d5cdf0] bg-[#f3f0fc]/95'
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${t.amount >= 0 ? 'bg-butter-soft text-[#b08b2e]' : 'bg-lilac-soft text-[#7a63b8]'}`}>
                <Coins size={15} />
              </span>
              <div>
                <div className={`font-display text-[14px] font-extrabold leading-none ${t.amount >= 0 ? 'text-[#b08b2e]' : 'text-[#7a63b8]'}`}>
                  {t.amount >= 0 ? `+${t.amount}` : t.amount} pts
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-ink-soft">{t.reason}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const ctx = useContext(PointsContext)
  if (!ctx) throw new Error('usePoints must be used inside PointsProvider')
  return ctx
}
