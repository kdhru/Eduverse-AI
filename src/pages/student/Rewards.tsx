import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins, Lock, Unlock, Sparkles, Zap, Flame, BookOpenCheck, MessagesSquare, StickyNote,
  ClipboardCheck, Gift, GraduationCap, Snowflake, Palette, Award, Video, Crown, Check, TrendingUp,
} from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar, Ring } from '../../components/ui'
import { usePoints, levelFor, LEVELS } from '../../lib/points'
import { lockedCourses } from '../../lib/data'

const EARN_ACTIONS = [
  { icon: <BookOpenCheck size={16} />, label: 'Complete a lesson', pts: '+20', tone: 'bg-peri-soft text-peri-deep' },
  { icon: <Zap size={16} />, label: 'Correct quiz answer', pts: '+10', tone: 'bg-butter-soft text-[#b08b2e]' },
  { icon: <ClipboardCheck size={16} />, label: 'Finish an adaptive quiz', pts: '+25', tone: 'bg-mint-soft text-[#3d9a6e]' },
  { icon: <Flame size={16} />, label: 'Daily streak bonus', pts: '+15', tone: 'bg-blush-soft text-[#c76a92]' },
  { icon: <MessagesSquare size={16} />, label: 'AI tutoring session', pts: '+5', tone: 'bg-sky-soft text-[#4a7fb5]' },
  { icon: <StickyNote size={16} />, label: 'Create a study note', pts: '+10', tone: 'bg-lilac-soft text-[#7a63b8]' },
  { icon: <ClipboardCheck size={16} />, label: 'Submit assignment on time', pts: '+40', tone: 'bg-mint-soft text-[#3d9a6e]' },
  { icon: <TrendingUp size={16} />, label: 'Master a weak topic', pts: '+60', tone: 'bg-peri-soft text-peri-deep' },
]

const REDEEMABLES = [
  { id: 'freeze', icon: <Snowflake size={20} />, name: 'Streak Freeze', cost: 150, desc: 'Protect your streak for one missed day.', tone: 'bg-sky-soft text-[#4a7fb5]' },
  { id: 'theme', icon: <Palette size={20} />, name: 'Custom Theme Pack', cost: 200, desc: 'Unlock 6 pastel dashboard themes.', tone: 'bg-lilac-soft text-[#7a63b8]' },
  { id: 'cert', icon: <Award size={20} />, name: 'Verified Certificate', cost: 500, desc: 'Shareable certificate for any finished course.', tone: 'bg-butter-soft text-[#b08b2e]' },
  { id: 'mentor', icon: <Video size={20} />, name: '1:1 Mentor Session', cost: 800, desc: '30-minute live session with a faculty mentor.', tone: 'bg-mint-soft text-[#3d9a6e]' },
  { id: 'pro', icon: <Crown size={20} />, name: 'EduMind Pro · 1 week', cost: 1000, desc: 'Priority inference & advanced analytics.', tone: 'bg-blush-soft text-[#c76a92]' },
]

const BADGES = [
  { icon: '🔥', name: 'Two-Week Streak', earned: true },
  { icon: '⚡', name: 'Quiz Champion', earned: true },
  { icon: '🧠', name: 'ML Explorer', earned: true },
  { icon: '📚', name: '50 Lessons', earned: true },
  { icon: '🎯', name: '90% Accuracy', earned: false },
  { icon: '🎓', name: 'Course Finisher', earned: false },
  { icon: '👑', name: 'Top 3 Rank', earned: false },
  { icon: '🚀', name: '30-Day Streak', earned: false },
]

export default function Rewards() {
  const { balance, totalEarned, unlocked, claimed, unlockCourse, claimReward } = usePoints()
  const lvl = levelFor(totalEarned)
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null)

  const handleUnlock = (id: string, cost: number) => {
    if (unlockCourse(id, cost)) {
      setJustUnlocked(id)
      setTimeout(() => setJustUnlocked(null), 2500)
    }
  }

  return (
    <div>
      <PageHead
        crumbs={['Home', 'Rewards & Points']}
        title="Rewards & Points"
        subtitle="Earn points as you learn · spend them to unlock advanced courses and perks"
      />

      {/* balance hero */}
      <FadeIn>
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8b94f] via-[#e6a86b] to-[#e08fae] p-6 text-white shadow-[0_20px_50px_-20px_rgba(224,143,174,0.7)] md:p-8">
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-white/85"><Coins size={15} /> POINTS BALANCE</div>
              <div className="mt-1 flex items-end gap-3">
                <motion.span key={balance} initial={{ scale: 1.2, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-5xl font-black leading-none">
                  {balance.toLocaleString()}
                </motion.span>
                <span className="pb-1 text-sm font-bold text-white/80">pts</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold backdrop-blur">{lvl.icon} Level {lvl.index} · {lvl.name}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold backdrop-blur">⭐ {totalEarned.toLocaleString()} lifetime earned</span>
              </div>
              {lvl.next && (
                <div className="mt-4 max-w-sm">
                  <div className="mb-1.5 flex justify-between text-[11.5px] font-bold text-white/85">
                    <span>Progress to {lvl.next}</span><span>{lvl.toNext} pts to go</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/25">
                    <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${lvl.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <Ring value={lvl.progress} size={130} stroke={11} color="#ffffff" track="rgba(255,255,255,0.25)" label={<span className="text-3xl">{lvl.icon}</span>} sub={`Level ${lvl.index}`} />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* level track */}
      <FadeIn delay={0.05}>
        <Glass className="mb-6 overflow-x-auto p-5">
          <div className="flex min-w-[640px] items-center">
            {LEVELS.map((l, i) => {
              const reached = totalEarned >= l.min
              return (
                <div key={l.name} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg transition ${reached ? 'bg-gradient-to-br from-peri to-lilac shadow-[0_8px_20px_-8px_rgba(125,136,230,0.8)]' : 'bg-[#eeedf5] grayscale'}`}>{l.icon}</div>
                    <div className={`mt-1.5 text-[10.5px] font-bold ${reached ? 'text-peri-deep' : 'text-muted'}`}>{l.name}</div>
                    <div className="text-[9.5px] font-semibold text-muted">{l.min.toLocaleString()}</div>
                  </div>
                  {i < LEVELS.length - 1 && <div className={`mx-1 h-1 flex-1 rounded-full ${totalEarned >= LEVELS[i + 1].min ? 'bg-gradient-to-r from-peri to-lilac' : 'bg-[#eeedf5]'}`} />}
                </div>
              )
            })}
          </div>
        </Glass>
      </FadeIn>

      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        {/* how to earn */}
        <FadeIn>
          <Glass className="h-full p-6">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Coins size={15} className="text-[#b08b2e]" /> How to earn points</h3>
            <div className="mt-4 space-y-2.5">
              {EARN_ACTIONS.map(a => (
                <div key={a.label} className="flex items-center gap-3 rounded-2xl bg-white/70 px-3.5 py-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.tone}`}>{a.icon}</span>
                  <span className="flex-1 text-[12.5px] font-semibold text-ink">{a.label}</span>
                  <span className="font-display text-[13px] font-extrabold text-[#b08b2e]">{a.pts}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/app/quizzes" className="flex-1 rounded-xl bg-gradient-to-r from-peri to-lilac py-2.5 text-center text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5">Take a quiz</Link>
              <Link to="/app/courses" className="flex-1 rounded-xl border border-line bg-white/70 py-2.5 text-center text-[12.5px] font-bold text-ink-soft transition hover:border-peri/40 hover:text-peri-deep">Learn now</Link>
            </div>
          </Glass>
        </FadeIn>

        {/* unlockable courses */}
        <FadeIn delay={0.05} className="lg:col-span-2">
          <Glass className="h-full p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Lock size={15} className="text-lilac" /> Unlock premium courses</h3>
              <Chip tone="butter"><Coins size={11} /> {balance.toLocaleString()} pts available</Chip>
            </div>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              {lockedCourses.map(c => {
                const isUnlocked = unlocked.includes(c.id)
                const affordable = balance >= c.cost
                return (
                  <motion.div key={c.id} layout className={`relative overflow-hidden rounded-2xl border p-4 transition ${isUnlocked ? 'border-[#bfe3d2] bg-mint-soft/60' : 'border-line bg-white/70'}`}>
                    <AnimatePresence>
                      {justUnlocked === c.id && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm"
                        >
                          <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="flex flex-col items-center gap-1.5 text-center">
                            <span className="text-4xl">🎉</span>
                            <span className="font-display text-[14px] font-extrabold text-[#3d9a6e]">Course unlocked!</span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl" style={{ background: `${c.color}22` }}>{c.icon}</span>
                      {isUnlocked
                        ? <Chip tone="mint"><Unlock size={11} /> Unlocked</Chip>
                        : <Chip tone="butter"><Coins size={11} /> {c.cost} pts</Chip>}
                    </div>
                    <div className="mt-2.5 text-[10.5px] font-bold tracking-wide text-muted">{c.code} · {c.level}</div>
                    <h4 className="font-display text-[14px] font-bold leading-snug text-ink">{c.name}</h4>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{c.desc}</p>
                    <div className="mt-3">
                      {isUnlocked ? (
                        <Link to="/app/courses" className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#5cb890] py-2 text-[12px] font-bold text-white shadow transition hover:-translate-y-0.5">
                          <Check size={13} /> Start course
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleUnlock(c.id, c.cost)}
                          disabled={!affordable}
                          className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold transition ${
                            affordable
                              ? 'bg-gradient-to-r from-peri to-lilac text-white shadow hover:-translate-y-0.5'
                              : 'cursor-not-allowed bg-[#eeedf5] text-muted'
                          }`}
                        >
                          <Lock size={12} /> {affordable ? `Unlock for ${c.cost} pts` : `Need ${(c.cost - balance).toLocaleString()} more pts`}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Glass>
        </FadeIn>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* redeemables */}
        <FadeIn className="lg:col-span-2">
          <Glass className="h-full p-6">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Gift size={15} className="text-[#c76a92]" /> Redeem perks</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {REDEEMABLES.map(r => {
                const isClaimed = claimed.includes(r.id)
                const affordable = balance >= r.cost
                return (
                  <div key={r.id} className={`flex items-center gap-3.5 rounded-2xl border p-4 transition ${isClaimed ? 'border-[#bfe3d2] bg-mint-soft/50' : 'border-line bg-white/70'}`}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${r.tone}`}>{r.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-ink">{r.name}</div>
                      <div className="text-[11px] leading-snug text-ink-soft">{r.desc}</div>
                    </div>
                    {isClaimed ? (
                      <Chip tone="mint"><Check size={11} /> Claimed</Chip>
                    ) : (
                      <button
                        onClick={() => claimReward(r.id, r.cost)}
                        disabled={!affordable}
                        className={`shrink-0 rounded-xl px-3 py-1.5 text-[11.5px] font-bold transition ${
                          affordable ? 'bg-butter-soft text-[#b08b2e] hover:bg-[#f6e4b3]' : 'cursor-not-allowed bg-[#eeedf5] text-muted'
                        }`}
                      >
                        {r.cost} pts
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </Glass>
        </FadeIn>

        {/* badges */}
        <FadeIn delay={0.05}>
          <Glass className="h-full p-6">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Award size={15} className="text-peri" /> Achievement badges</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {BADGES.map(b => (
                <div key={b.name} className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition ${b.earned ? 'border-[#e8d9a0] bg-butter-soft/50' : 'border-line bg-white/60 opacity-60 grayscale'}`}>
                  <span className="text-2xl">{b.icon}</span>
                  <span className="mt-1.5 text-[11px] font-bold leading-tight text-ink">{b.name}</span>
                  <span className={`mt-1 text-[9.5px] font-bold ${b.earned ? 'text-[#b08b2e]' : 'text-muted'}`}>{b.earned ? 'EARNED' : 'LOCKED'}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-gradient-to-r from-peri-soft to-lilac-soft p-4">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-peri-deep" />
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                <strong className="font-bold text-peri-deep">Recommendation Agent:</strong> you’re 2 accurate quizzes away from the “90% Accuracy” badge — worth a +100 pt bonus.
              </p>
            </div>
          </Glass>
        </FadeIn>
      </div>
    </div>
  )
}
