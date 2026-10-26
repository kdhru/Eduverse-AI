import { motion } from 'framer-motion'
import { CheckCircle2, CircleDot, Circle, Sparkles } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar } from '../../components/ui'
import { roadmap } from '../../lib/data'

const FLOW = ['Semester', 'Subjects', 'Concepts', 'Practice', 'Revision', 'Assessment']

export default function Roadmap() {
  return (
    <div>
      <PageHead
        crumbs={['Home', 'Study Roadmap']}
        title="Study Roadmap"
        subtitle="Personalized by the Roadmap Agent · recalibrated every Sunday from your quiz telemetry"
      />

      {/* flow strip */}
      <FadeIn>
        <Glass className="mb-7 overflow-x-auto p-5">
          <div className="flex min-w-max items-center justify-center gap-2 md:gap-3">
            {FLOW.map((f, i) => (
              <div key={f} className="flex items-center gap-2 md:gap-3">
                <div className={`rounded-2xl px-4 py-2.5 text-[12.5px] font-bold shadow-sm transition ${i <= 2 ? 'bg-gradient-to-r from-peri to-lilac text-white' : 'border border-line bg-white/80 text-ink-soft'}`}>
                  {f}
                </div>
                {i < FLOW.length - 1 && (
                  <svg width="26" height="10" className="shrink-0 text-lilac">
                    <line x1="0" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="2" className={i < 2 ? 'flow-dash' : ''} strokeDasharray={i < 2 ? undefined : '3 4'} opacity={i < 2 ? 1 : 0.4} />
                    <path d="M18 1 L25 5 L18 9" fill="none" stroke="currentColor" strokeWidth="2" opacity={i < 2 ? 1 : 0.4} />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[11.5px] font-medium text-muted">You are in the <strong className="text-peri-deep">Concepts</strong> phase · Week 9 of 16 · 56% through the semester plan</div>
        </Glass>
      </FadeIn>

      {/* timeline */}
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-4 left-[19px] top-4 w-0.5 rounded bg-gradient-to-b from-mint via-peri to-line md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-6">
          {roadmap.map((r, i) => {
            const Icon = r.status === 'done' ? CheckCircle2 : r.status === 'active' ? CircleDot : Circle
            const iconColor = r.status === 'done' ? 'text-[#3d9a6e] bg-mint-soft' : r.status === 'active' ? 'text-peri-deep bg-peri-soft' : 'text-muted bg-white'
            return (
              <FadeIn key={r.phase} delay={i * 0.05}>
                <div className={`relative flex gap-5 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-0 z-10 md:left-1/2 md:-translate-x-1/2">
                    <motion.div whileHover={{ scale: 1.15 }} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md ${iconColor}`}>
                      <Icon size={18} />
                    </motion.div>
                  </div>
                  <div className={`ml-14 w-full md:ml-0 md:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <Glass hover className={`p-5 ${r.status === 'active' ? 'shadow-[0_0_0_2px_rgba(125,136,230,0.35),0_18px_50px_-20px_rgba(125,136,230,0.5)]' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{r.icon}</span>
                        <Chip tone={r.status === 'done' ? 'mint' : r.status === 'active' ? 'peri' : 'ink'}>
                          {r.status === 'done' ? 'Completed' : r.status === 'active' ? 'In progress' : 'Upcoming'}
                        </Chip>
                      </div>
                      <h3 className="mt-2.5 font-display text-[16px] font-bold text-ink">{r.phase}</h3>
                      <div className="text-[11px] font-bold text-muted">{r.period}</div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{r.detail}</p>
                      <ul className="mt-3 space-y-1.5">
                        {r.items.map(it => (
                          <li key={it} className="flex items-center gap-2 text-[12px] font-medium text-ink-soft">
                            <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'done' ? 'bg-mint' : r.status === 'active' ? 'bg-peri' : 'bg-line'}`} /> {it}
                          </li>
                        ))}
                      </ul>
                      {r.status === 'active' && <div className="mt-3.5"><Bar value={42} color="#7d88e6" /><div className="mt-1.5 text-[10.5px] font-bold text-peri-deep">Phase progress · 42%</div></div>}
                    </Glass>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>

      <FadeIn>
        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-3xl bg-gradient-to-r from-peri-soft to-lilac-soft p-5">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-peri-deep" />
          <p className="text-[13px] leading-relaxed text-ink-soft">
            <strong className="font-bold text-peri-deep">Roadmap Agent insight:</strong> at your current pace you’ll finish the Concepts phase 3 days early.
            I’ve reallocated that buffer to extra Dynamic Programming practice — your highest-impact weak topic — which lifts your predicted final score from 85% to 88%.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
