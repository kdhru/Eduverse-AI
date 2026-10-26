import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Flame, Clock3, Gauge, Sparkles, ArrowRight, Trophy, ChevronRight, Zap, Coins, Gift } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Glass, Chip, Ring, Bar, FadeIn } from '../../components/ui'
import { student, subjects, weeklyStudy, recommendations, recentActivity, upcomingQuizzes } from '../../lib/data'
import { usePoints, levelFor, nextLevelFor } from '../../lib/points'

const tooltipStyle = {
  borderRadius: 14, border: '1px solid #e7e5f2', background: 'rgba(255,255,255,0.95)',
  boxShadow: '0 10px 30px -10px rgba(93,95,160,0.3)', fontSize: 12, fontFamily: 'Figtree',
}

export default function Dashboard() {
  const { balance, totalEarned, addPoints } = usePoints()
  const [dailyClaimed, setDailyClaimed] = useState(() => {
    try { return localStorage.getItem('edumind-daily-claim') === new Date().toDateString() } catch { return false }
  })
  const claimDaily = () => {
    if (dailyClaimed) return
    addPoints(15, 'Daily streak bonus 🔥')
    setDailyClaimed(true)
    try { localStorage.setItem('edumind-daily-claim', new Date().toDateString()) } catch { /* ignore */ }
  }
  const lvl = levelFor(totalEarned)
  const next = nextLevelFor(totalEarned)

  return (
    <div className="space-y-5">
      {/* welcome */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-peri via-[#8f8ce0] to-lilac p-6 text-white shadow-[0_20px_50px_-20px_rgba(125,136,230,0.8)] md:p-8">
          <div className="dotgrid absolute inset-0 opacity-15 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-[13px] font-semibold text-white/80">Tuesday, January 21 · {student.program}</div>
              <h1 className="mt-1 font-display text-2xl font-extrabold md:text-3xl">Good morning, Aarav 👋</h1>
              <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-white/85">
                The Recommendation Agent queued <strong>3 high-priority actions</strong> for today.
                Your Dynamic Programming recall window closes at 6 PM — perfect time for the adaptive set.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link to="/app/quizzes" className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-peri-deep shadow transition hover:-translate-y-0.5">
                  <Zap size={14} /> Start today’s quiz <span className="ml-0.5 flex items-center gap-0.5 text-[11px] text-[#b08b2e]"><Coins size={11} /> +pts</span>
                </Link>
                <Link to="/app/tutor" className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-[13px] font-bold text-white backdrop-blur transition hover:bg-white/25">
                  <Sparkles size={14} /> Ask AI Tutor
                </Link>
                <button
                  onClick={claimDaily}
                  disabled={dailyClaimed}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-bold transition ${
                    dailyClaimed
                      ? 'cursor-default border border-white/25 bg-white/10 text-white/60'
                      : 'bg-[#ffe9b3] text-[#8a6516] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] hover:-translate-y-0.5'
                  }`}
                >
                  <Gift size={14} /> {dailyClaimed ? 'Daily bonus claimed ✓' : 'Claim daily +15 pts'}
                </button>
              </div>
            </div>
            <div className="hidden shrink-0 md:block">
              <Ring value={student.performance} size={120} stroke={10} color="#ffffff" track="rgba(255,255,255,0.25)" sub="overall score" />
            </div>
          </div>
        </div>
      </FadeIn>

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Flame size={18} className="flicker" />, label: 'Learning Streak', value: `${student.streak} days`, sub: 'Best: 24 days · top 8% of cohort', tone: 'bg-butter-soft text-[#b08b2e]' },
          { icon: <Clock3 size={18} />, label: 'Weekly Study Hours', value: `${student.weeklyHours} h`, sub: '+3.2 h vs last week', tone: 'bg-sky-soft text-[#4a7fb5]' },
          { icon: <Gauge size={18} />, label: 'Performance Score', value: `${student.performance}%`, sub: 'Predicted final: 88 ± 3%', tone: 'bg-mint-soft text-[#3d9a6e]' },
          { icon: <Coins size={18} />, label: `Points · Lv ${lvl.index} ${lvl.name}`, value: balance.toLocaleString(), sub: next ? `${next.min - totalEarned} pts to ${next.name} · spend in Rewards` : 'Max level reached 🏆', tone: 'bg-butter-soft text-[#b08b2e]', link: '/app/rewards' },
        ].map((s, i) => {
          const card = (
            <Glass hover className="p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${s.tone}`}>{s.icon}</div>
              <div className="text-[12px] font-semibold text-muted">{s.label}</div>
              <div className="mt-0.5 font-display text-2xl font-extrabold text-ink">{s.value}</div>
              <div className="mt-1 text-[11.5px] font-medium text-ink-soft">{s.sub}</div>
            </Glass>
          )
          return (
            <FadeIn key={s.label} delay={i * 0.06}>
              {'link' in s && s.link ? <Link to={s.link}>{card}</Link> : card}
            </FadeIn>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* study chart */}
        <FadeIn className="lg:col-span-2">
          <Glass className="h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-[16px] font-bold text-ink">Learning progress this week</h2>
                <p className="text-[12px] text-muted">Study hours per day · total 23.5 h</p>
              </div>
              <Link to="/app/analytics" className="flex items-center gap-1 text-[12px] font-bold text-peri-deep transition hover:gap-1.5">Full analytics <ArrowRight size={13} /></Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyStudy} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7d88e6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7d88e6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#e7e5f2" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="hours" stroke="#7d88e6" strokeWidth={2.5} fill="url(#gHours)" name="Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* AI recommendations */}
        <FadeIn delay={0.08}>
          <Glass className="flex h-full flex-col p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 font-display text-[16px] font-bold text-ink"><Sparkles size={15} className="text-lilac" /> AI Recommendations</h2>
            </div>
            <div className="flex-1 space-y-2.5">
              {recommendations.slice(0, 3).map((r, i) => (
                <motion.div key={i} whileHover={{ x: 3 }} className="rounded-2xl border border-line/70 bg-white/70 p-3.5 transition hover:border-peri/40">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">{r.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold leading-snug text-ink">{r.title}</div>
                      <div className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-ink-soft">{r.reason}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/app/recommendations" className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-peri-soft py-2.5 text-[12.5px] font-bold text-peri-deep transition hover:bg-peri/15">
              View all recommendations <ChevronRight size={14} />
            </Link>
          </Glass>
        </FadeIn>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* upcoming quizzes */}
        <FadeIn>
          <Glass className="h-full p-6">
            <h2 className="mb-4 font-display text-[16px] font-bold text-ink">Upcoming quizzes</h2>
            <div className="space-y-3">
              {upcomingQuizzes.map(q => (
                <Link to="/app/quizzes" key={q.title} className="block rounded-2xl border border-line/70 bg-white/70 p-3.5 transition hover:-translate-y-0.5 hover:border-peri/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: q.color }} />
                    <span className="text-[11px] font-bold text-muted">{q.subject} · {q.questions} questions</span>
                  </div>
                  <div className="mt-1 text-[13px] font-bold leading-snug text-ink">{q.title}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#c76a92]">{q.due}</span>
                    <Chip tone="lilac" className="!text-[10px]">{q.difficulty}</Chip>
                  </div>
                </Link>
              ))}
            </div>
          </Glass>
        </FadeIn>

        {/* recent activity */}
        <FadeIn delay={0.06}>
          <Glass className="h-full p-6">
            <h2 className="mb-4 font-display text-[16px] font-bold text-ink">Recent activity</h2>
            <div className="relative space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-line">
              {recentActivity.map((a, i) => (
                <div key={i} className="relative flex gap-3 pl-0">
                  <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm" style={{ background: `${a.color}26` }}>{a.icon}</span>
                  <div>
                    <div className="text-[12.5px] font-medium leading-snug text-ink">{a.text}</div>
                    <div className="mt-0.5 text-[10.5px] text-muted">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Glass>
        </FadeIn>

        {/* subject progress */}
        <FadeIn delay={0.12}>
          <Glass className="h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[16px] font-bold text-ink">Subject progress</h2>
              <Link to="/app/courses" className="text-[12px] font-bold text-peri-deep hover:underline">All courses</Link>
            </div>
            <div className="space-y-3.5">
              {subjects.slice(0, 5).map(s => (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="flex items-center gap-1.5 font-semibold text-ink">{s.icon} {s.name}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.progress}%</span>
                  </div>
                  <Bar value={s.progress} color={s.color} />
                </div>
              ))}
            </div>
          </Glass>
        </FadeIn>
      </div>
    </div>
  )
}
