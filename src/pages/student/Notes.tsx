import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pin, Sparkles, Trash2 } from 'lucide-react'
import { Chip, PageHead } from '../../components/ui'
import { usePoints } from '../../lib/points'

type Note = { id: number; title: string; body: string; subject: string; color: string; pinned: boolean; date: string }

const seed: Note[] = [
  { id: 1, title: 'DP state design checklist', body: '1. What changes between subproblems? → that’s your state.\n2. Write the recurrence before any code.\n3. Base cases = smallest valid states.\n4. Memoize on the state tuple, never on mutable args.', subject: 'DSA', color: '#efeffc', pinned: true, date: 'Today' },
  { id: 2, title: 'Backprop — chain rule intuition', body: 'Each layer just multiplies the upstream gradient by its local Jacobian. Vanishing gradients = repeated multiplication by values < 1. ReLU keeps the derivative at 1 for active units.', subject: 'ML', color: '#f3effb', pinned: true, date: 'Yesterday' },
  { id: 3, title: '3NF quick test', body: 'For every FD X → A: either X is a superkey, or A is a prime attribute. If neither → decompose. Remember: BCNF is stricter (X must always be a superkey).', subject: 'DBMS', color: '#edf4fb', pinned: false, date: 'Jan 19' },
  { id: 4, title: 'TCP slow start numbers', body: 'cwnd starts at 1 MSS, doubles every RTT until ssthresh, then +1 MSS per RTT (congestion avoidance). On triple duplicate ACK → fast retransmit, cwnd halves.', subject: 'Networks', color: '#fdf4ec', pinned: false, date: 'Jan 18' },
  { id: 5, title: 'Python generators vs iterators', body: 'Every generator is an iterator, not vice-versa. yield pauses the frame and keeps locals alive. Use generators for pipelines — memory stays O(1).', subject: 'Python', color: '#eef8f2', pinned: false, date: 'Jan 16' },
  { id: 6, title: 'Deadlock — 4 Coffman conditions', body: 'Mutual exclusion · hold & wait · no preemption · circular wait. Break ANY one to prevent deadlock. Banker’s algorithm = avoidance, not prevention.', subject: 'OS', color: '#fbeff4', pinned: false, date: 'Jan 14' },
]

export default function Notes() {
  const [notes, setNotes] = useState(seed)
  const [q, setQ] = useState('')
  const filtered = notes.filter(n => n.title.toLowerCase().includes(q.toLowerCase()) || n.body.toLowerCase().includes(q.toLowerCase()))
  const pinned = filtered.filter(n => n.pinned)
  const rest = filtered.filter(n => !n.pinned)

  const { addPoints } = usePoints()
  const addNote = () => {
    setNotes(n => [{ id: Date.now(), title: 'Untitled note', body: 'Start typing… the AI can summarize any lecture into a note like this.', subject: 'General', color: '#efeffc', pinned: false, date: 'Just now' }, ...n])
    addPoints(10, 'Study note created')
  }

  const NoteCard = ({ n }: { n: Note }) => (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="group rounded-3xl border border-line/60 p-5 shadow-[0_8px_24px_-12px_rgba(93,95,160,0.25)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(93,95,160,0.4)]"
      style={{ background: n.color }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[14.5px] font-bold text-ink">{n.title}</h3>
        <div className="flex gap-1">
          <button onClick={() => setNotes(ns => ns.map(x => x.id === n.id ? { ...x, pinned: !x.pinned } : x))}
            className={`rounded-lg p-1.5 transition ${n.pinned ? 'text-peri-deep' : 'text-muted opacity-0 group-hover:opacity-100'}`}>
            <Pin size={13} fill={n.pinned ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => setNotes(ns => ns.filter(x => x.id !== n.id))} className="rounded-lg p-1.5 text-[#c76a92] opacity-0 transition group-hover:opacity-100"><Trash2 size={13} /></button>
        </div>
      </div>
      <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft">{n.body}</p>
      <div className="mt-3.5 flex items-center justify-between">
        <Chip tone="ink">{n.subject}</Chip>
        <span className="text-[10.5px] font-semibold text-muted">{n.date}</span>
      </div>
    </motion.div>
  )

  return (
    <div>
      <PageHead crumbs={['Home', 'Notes']} title="Notes" subtitle={`${notes.length} notes · synced & searchable by the Tutor Agent`}
        actions={
          <button onClick={addNote} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"><Plus size={14} /> New note</button>
        } />
      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search notes…"
          className="w-full rounded-2xl border border-line bg-white/80 py-2.5 pl-9 pr-4 text-[13px] outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]" />
      </div>
      {pinned.length > 0 && (
        <>
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted"><Pin size={11} /> Pinned</div>
          <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><AnimatePresence>{pinned.map(n => <NoteCard key={n.id} n={n} />)}</AnimatePresence></div>
        </>
      )}
      <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted">All notes</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><AnimatePresence>{rest.map(n => <NoteCard key={n.id} n={n} />)}</AnimatePresence></div>
      <div className="mt-7 flex items-start gap-3 rounded-3xl bg-gradient-to-r from-peri-soft to-lilac-soft p-5">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-peri-deep" />
        <p className="text-[12.5px] leading-relaxed text-ink-soft"><strong className="font-bold text-peri-deep">Smart notes:</strong> every note is embedded into your personal vector index, so the AI Tutor can cite your own notes alongside course PDFs when answering.</p>
      </div>
    </div>
  )
}
