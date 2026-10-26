import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Glass, PageHead, FadeIn, Chip } from '../../components/ui'
import { calendarEvents } from '../../lib/data'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarPage() {
  const [selected, setSelected] = useState(21)
  // January 2026 starts on Thursday → offset 3 for Mon-first grid
  const offset = 3
  const days = 31
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const selectedEvents = calendarEvents[selected] ?? []

  return (
    <div>
      <PageHead crumbs={['Home', 'Calendar']} title="Calendar" subtitle="Quizzes, deadlines and AI-scheduled study blocks in one place" />
      <div className="grid gap-5 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <Glass className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-ink">January 2026</h2>
              <div className="flex gap-1.5">
                <button className="rounded-xl border border-line bg-white/70 p-2 text-ink-soft transition hover:text-ink"><ChevronLeft size={15} /></button>
                <button className="rounded-xl border border-line bg-white/70 p-2 text-ink-soft transition hover:text-ink"><ChevronRight size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {DOW.map(d => <div key={d} className="pb-1 text-[10.5px] font-bold uppercase tracking-wider text-muted">{d}</div>)}
              {cells.map((d, i) => d === null ? <div key={`e${i}`} /> : (
                <button key={d} onClick={() => setSelected(d)}
                  className={`relative aspect-square rounded-2xl text-[13px] font-semibold transition-all ${
                    d === selected ? 'bg-gradient-to-br from-peri to-lilac text-white shadow-[0_8px_20px_-8px_rgba(125,136,230,0.8)]'
                    : d === 21 ? 'bg-peri-soft text-peri-deep'
                    : 'bg-white/60 text-ink-soft hover:bg-white'
                  }`}>
                  {d}
                  {calendarEvents[d] && (
                    <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {calendarEvents[d].slice(0, 3).map((ev, j) => (
                        <span key={j} className="h-1 w-1 rounded-full" style={{ background: d === selected ? 'white' : ev.color }} />
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Glass>
        </FadeIn>
        <FadeIn delay={0.07}>
          <Glass className="h-full p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold text-ink">Jan {selected}</h3>
              {selected === 21 && <Chip tone="peri">Today</Chip>}
            </div>
            <div className="mt-4 space-y-2.5">
              {selectedEvents.length === 0 && (
                <div className="rounded-2xl bg-white/60 p-4 text-[12.5px] text-muted">No events — the Roadmap Agent suggests a 45-min spaced-review block at 5 PM.</div>
              )}
              {selectedEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-white/70 p-3.5">
                  <span className="h-8 w-1.5 rounded-full" style={{ background: ev.color }} />
                  <div className="text-[13px] font-bold text-ink">{ev.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-line/70 pt-4">
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-muted">Legend</div>
              <div className="space-y-1.5 text-[11.5px] font-semibold text-ink-soft">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#f2d491]" /> Quizzes & exams</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ab96e0]" /> Assignment deadlines</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#7d88e6]" /> AI-scheduled study blocks</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#9cc5ee]" /> Labs & lectures</div>
              </div>
            </div>
          </Glass>
        </FadeIn>
      </div>
    </div>
  )
}
