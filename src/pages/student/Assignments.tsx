import { useState } from 'react'
import { Upload, CheckCircle2, Clock3, AlertCircle, Coins } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar } from '../../components/ui'
import { assignments as seed } from '../../lib/data'
import { usePoints } from '../../lib/points'

const statusMap = {
  submitted: { chip: 'mint' as const, icon: <CheckCircle2 size={14} />, label: 'Submitted' },
  pending: { chip: 'butter' as const, icon: <Clock3 size={14} />, label: 'In progress' },
  overdue: { chip: 'blush' as const, icon: <AlertCircle size={14} />, label: 'Due soon' },
}

export default function Assignments() {
  const [assignments, setAssignments] = useState(seed.map(a => ({ ...a })))
  const { addPoints } = usePoints()
  const done = assignments.filter(a => a.status === 'submitted').length

  const submit = (title: string) => {
    setAssignments(as => as.map(a => a.title === title ? { ...a, status: 'submitted', progress: 100, grade: 'Pending review' } : a))
    addPoints(40, 'Assignment submitted')
  }

  return (
    <div>
      <PageHead crumbs={['Home', 'Assignments']} title="Assignments" subtitle={`${done} of ${assignments.length} submitted this month · average grade A− · +40 pts per on-time submission`} />
      <FadeIn>
        <Glass className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex-1">
            <div className="mb-1.5 flex justify-between text-[12px] font-bold"><span className="text-muted">Monthly completion</span><span className="text-peri-deep">{Math.round((done / assignments.length) * 100)}%</span></div>
            <Bar value={(done / assignments.length) * 100} color="#7d88e6" />
          </div>
          <div className="flex gap-6 text-center">
            <div><div className="font-display text-xl font-extrabold text-[#3d9a6e]">{done}</div><div className="text-[10.5px] font-bold text-muted">Submitted</div></div>
            <div><div className="font-display text-xl font-extrabold text-[#b08b2e]">{assignments.filter(a => a.status === 'pending').length}</div><div className="text-[10.5px] font-bold text-muted">In progress</div></div>
            <div><div className="font-display text-xl font-extrabold text-[#c76a92]">{assignments.filter(a => a.status === 'overdue').length}</div><div className="text-[10.5px] font-bold text-muted">Due soon</div></div>
          </div>
        </Glass>
      </FadeIn>
      <div className="space-y-3.5">
        {assignments.map((a, i) => {
          const s = statusMap[a.status as keyof typeof statusMap]
          return (
            <FadeIn key={a.title} delay={i * 0.04}>
              <Glass hover className="flex flex-wrap items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl" style={{ background: `${a.color}22` }}>{a.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[14.5px] font-bold text-ink">{a.title}</h3>
                    <Chip tone={s.chip}>{s.icon} {s.label}</Chip>
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-muted">{a.subject} · {a.detail}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[12.5px] font-bold ${a.status === 'overdue' ? 'text-[#c76a92]' : 'text-ink'}`}>{a.due}</div>
                  {a.grade ? <div className="text-[11px] font-bold text-[#3d9a6e]">Grade: {a.grade}</div> : (
                    <button onClick={() => submit(a.title)} className="mt-1 flex items-center gap-1 rounded-xl bg-peri-soft px-3 py-1.5 text-[11.5px] font-bold text-peri-deep transition hover:bg-peri/15">
                      <Upload size={11} /> Submit <span className="ml-0.5 flex items-center gap-0.5 text-[#b08b2e]"><Coins size={10} />+40</span>
                    </button>
                  )}
                </div>
              </Glass>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
