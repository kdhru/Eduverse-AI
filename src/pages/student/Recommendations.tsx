import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn } from '../../components/ui'
import { recommendations } from '../../lib/data'

export default function Recommendations() {
  return (
    <div>
      <PageHead
        crumbs={['Home', 'Recommendations']}
        title="AI Recommendations"
        subtitle="Ranked by expected score impact · generated 20 minutes ago by the Recommendation Agent"
      />

      <FadeIn>
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-peri via-[#8f8ce0] to-lilac p-6 text-white shadow-[0_18px_44px_-16px_rgba(125,136,230,0.8)]">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-white/80"><Sparkles size={14} /> Today’s focus</div>
          <h2 className="mt-1.5 font-display text-xl font-extrabold md:text-2xl">Clear Dynamic Programming before Friday’s mock</h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/85">
            Combining your quiz telemetry, forgetting curve, and the exam blueprint, the single highest-leverage action this week is a
            focused DP sprint: 2 guided sessions + 30 adaptive questions. Expected gain: <strong>+4.8 points</strong> on your predicted final.
          </p>
          <Link to="/app/quizzes" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-peri-deep shadow transition hover:-translate-y-0.5">
            Start the sprint <ArrowRight size={14} />
          </Link>
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((r, i) => (
          <FadeIn key={r.title} delay={i * 0.05}>
            <Glass hover className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm">{r.icon}</span>
                <Chip tone={r.priority === 'High' ? 'blush' : r.priority === 'Medium' ? 'butter' : 'mint'}>{r.priority} priority</Chip>
              </div>
              <h3 className="mt-3 font-display text-[15px] font-bold leading-snug text-ink">{r.title}</h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-soft">{r.reason}</p>
              <button className="mt-4 flex w-fit items-center gap-1.5 rounded-xl bg-peri-soft px-4 py-2 text-[12.5px] font-bold text-peri-deep transition hover:gap-2.5 hover:bg-peri/15">
                {r.action} <ArrowRight size={13} />
              </button>
            </Glass>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
