import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import { Glass, Chip, PageHead } from '../../components/ui'
import { notifications as seed } from '../../lib/data'

const FILTERS = ['All', 'Quizzes', 'Assignments', 'AI', 'Courses', 'Achievements'] as const
const catMap: Record<string, string> = { quiz: 'Quizzes', assignment: 'Assignments', ai: 'AI', course: 'Courses', badge: 'Achievements' }

export default function Notifications() {
  const [items, setItems] = useState(seed)
  const [filter, setFilter] = useState<typeof FILTERS[number]>('All')
  const filtered = items.filter(n => filter === 'All' || catMap[n.kind] === filter)
  const unread = items.filter(n => !n.read).length

  return (
    <div className="mx-auto max-w-3xl">
      <PageHead crumbs={['Home', 'Notifications']} title="Notification Center" subtitle={`${unread} unread`}
        actions={
          <button onClick={() => setItems(i => i.map(n => ({ ...n, read: true })))} className="flex items-center gap-1.5 rounded-xl border border-line bg-white/80 px-4 py-2.5 text-[12.5px] font-bold text-ink-soft transition hover:text-peri-deep">
            <CheckCheck size={14} /> Mark all read
          </button>
        } />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition ${filter === f ? 'bg-gradient-to-r from-peri to-lilac text-white shadow' : 'bg-white/70 text-ink-soft hover:bg-white'}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-2.5">
        <AnimatePresence>
          {filtered.map(n => (
            <motion.div key={n.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Glass hover className={`flex items-start gap-3.5 p-4.5 !rounded-2xl p-4 ${!n.read ? 'shadow-[inset_3px_0_0_0_#7d88e6]' : ''}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg" style={{ background: `${n.color}22` }}>{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[13.5px] leading-snug ${!n.read ? 'font-bold text-ink' : 'font-semibold text-ink-soft'}`}>{n.title}</span>
                    <Chip tone="ink">{catMap[n.kind]}</Chip>
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ink-soft">{n.body}</p>
                  <div className="mt-1 text-[10.5px] font-semibold text-muted">{n.time}</div>
                </div>
                {!n.read && (
                  <button onClick={() => setItems(i => i.map(x => x.id === n.id ? { ...x, read: true } : x))} className="shrink-0 rounded-lg px-2 py-1 text-[10.5px] font-bold text-peri-deep transition hover:bg-peri-soft">Mark read</button>
                )}
              </Glass>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
