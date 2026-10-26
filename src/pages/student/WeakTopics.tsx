import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Sparkles, Target } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar } from '../../components/ui'
import { weakTopics } from '../../lib/data'

export default function WeakTopics() {
  return (
    <div>
      <PageHead
        crumbs={['Home', 'Weak Topics']}
        title="Weak Topics"
        subtitle="Detected by the Performance Agent from quiz telemetry, response latency and forgetting-curve models"
        actions={<Link to="/app/quizzes" className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"><Target size={14} /> Practice weakest now</Link>}
      />

      <FadeIn>
        <div className="mb-6 flex items-start gap-3 rounded-3xl bg-gradient-to-r from-blush-soft to-lilac-soft p-5">
          <Sparkles size={17} className="mt-0.5 shrink-0 text-[#c76a92]" />
          <p className="text-[13px] leading-relaxed text-ink-soft">
            <strong className="font-bold text-[#c76a92]">Priority focus:</strong> Dynamic Programming and TCP/IP together account for an estimated <strong>7.2 points</strong> of
            your predicted final-score gap. Clearing both moves your prediction from 88% → 93%.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2">
        {weakTopics.map((w, i) => (
          <FadeIn key={w.topic} delay={i * 0.05}>
            <Glass hover className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-[15.5px] font-bold text-ink">{w.topic}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Chip tone="ink">{w.subject}</Chip>
                    <Chip tone={w.impact === 'High' ? 'blush' : w.impact === 'Medium' ? 'butter' : 'mint'}>{w.impact} impact</Chip>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {w.trend === 'up' ? <><TrendingUp size={13} className="text-[#3d9a6e]" /><span className="text-[#3d9a6e]">improving</span></>
                    : w.trend === 'down' ? <><TrendingDown size={13} className="text-[#c76a92]" /><span className="text-[#c76a92]">slipping</span></>
                    : <><Minus size={13} className="text-muted" /><span className="text-muted">flat</span></>}
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11.5px] font-bold">
                  <span className="text-muted">Mastery</span>
                  <span style={{ color: w.mastery < 50 ? '#c76a92' : w.mastery < 62 ? '#b08b2e' : '#3d9a6e' }}>{w.mastery}%</span>
                </div>
                <Bar value={w.mastery} color={w.mastery < 50 ? '#f0b9cf' : w.mastery < 62 ? '#f2d491' : '#8fd4b8'} />
              </div>
              <div className="mt-3.5 flex items-center justify-between text-[11.5px] font-semibold text-muted">
                <span>{w.attempts} recent attempts</span>
                <span>Est. time to clear: <strong className="text-ink">{w.eta}</strong></span>
              </div>
              <div className="mt-3.5 flex gap-2">
                <Link to="/app/quizzes" className="flex-1 rounded-xl bg-peri-soft py-2 text-center text-[12px] font-bold text-peri-deep transition hover:bg-peri/15">Adaptive drill</Link>
                <Link to="/app/tutor" className="flex-1 rounded-xl border border-line bg-white/70 py-2 text-center text-[12px] font-bold text-ink-soft transition hover:border-peri/40 hover:text-peri-deep">Ask AI Tutor</Link>
              </div>
            </Glass>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
