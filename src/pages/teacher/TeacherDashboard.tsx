import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UploadCloud, ClipboardList, Wand2, CalendarCheck2, Sparkles, Search,
  TrendingUp, TrendingDown, GraduationCap, CheckCircle2, X, FileText, Plus,
} from 'lucide-react'
import { ResponsiveContainer, ComposedChart, Bar as RBar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Glass, Chip, PageHead, FadeIn, Bar } from '../../components/ui'
import { teacherStudents, classPerformance } from '../../lib/data'

const tt = { borderRadius: 14, border: '1px solid #e7e5f2', background: 'rgba(255,255,255,0.96)', boxShadow: '0 10px 30px -10px rgba(93,95,160,0.3)', fontSize: 12, fontFamily: 'Figtree' }

export default function TeacherDashboard() {
  const [q, setQ] = useState('')
  const [quizModal, setQuizModal] = useState(false)
  const [generated, setGenerated] = useState(false)
  const students = teacherStudents.filter(s => s.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-5">
      <PageHead
        crumbs={['Faculty', 'Dashboard']}
        title="Faculty Command Center"
        subtitle="CS301 Python · CS302 DSA · CS305 ML · 64 students · Spring 2026"
        actions={
          <div className="flex gap-2">
            <button onClick={() => { setQuizModal(true); setGenerated(false) }} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"><Wand2 size={14} /> AI Quiz Creator</button>
            <button className="flex items-center gap-1.5 rounded-xl border border-line bg-white/80 px-4 py-2.5 text-[13px] font-bold text-ink-soft transition hover:text-peri-deep"><UploadCloud size={14} /> Upload materials</button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Users size={17} />, label: 'Active students', value: '64', sub: '58 active this week', tone: 'bg-peri-soft text-peri-deep' },
          { icon: <ClipboardList size={17} />, label: 'Pending submissions', value: '17', sub: 'LRU Cache assignment', tone: 'bg-butter-soft text-[#b08b2e]' },
          { icon: <CalendarCheck2 size={17} />, label: 'Avg attendance', value: '91%', sub: '▲ 2% vs last month', tone: 'bg-mint-soft text-[#3d9a6e]' },
          { icon: <GraduationCap size={17} />, label: 'Class average', value: '76%', sub: 'Predicted final: 79%', tone: 'bg-lilac-soft text-[#7a63b8]' },
        ].map((k, i) => (
          <FadeIn key={k.label} delay={i * 0.05}>
            <Glass hover className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${k.tone}`}>{k.icon}</div>
              <div>
                <div className="text-[11.5px] font-semibold text-muted">{k.label}</div>
                <div className="font-display text-xl font-extrabold text-ink">{k.value}</div>
                <div className="text-[10.5px] font-semibold text-muted">{k.sub}</div>
              </div>
            </Glass>
          </FadeIn>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* class performance chart */}
        <FadeIn className="lg:col-span-2">
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Class performance · CS302 DSA</h3>
            <p className="mb-3 text-[11.5px] text-muted">Weekly average score vs engagement index</p>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={classPerformance} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="#e7e5f2" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} cursor={{ fill: 'rgba(125,136,230,0.06)' }} />
                <Legend wrapperStyle={{ fontSize: 11.5 }} />
                <RBar dataKey="avg" name="Avg score" fill="#b8bef0" radius={[7, 7, 0, 0]} />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#ab96e0" strokeWidth={2.5} dot={{ r: 3, fill: '#ab96e0' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* AI insights */}
        <FadeIn delay={0.06}>
          <Glass className="flex h-full flex-col p-6">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Sparkles size={15} className="text-lilac" /> AI teaching insights</h3>
            <div className="mt-3 flex-1 space-y-2.5">
              {[
                { icon: '⚠️', text: '9 students share the same misconception on DP base cases — detected from quiz distractor analysis. A 10-min recap is suggested.' },
                { icon: '📉', text: 'Priya Nair’s engagement dropped 31% in 2 weeks. Prediction model flags at-risk (0.72). Early outreach recommended.' },
                { icon: '💡', text: 'Quiz 24 item 7 had a 0.19 discrimination index — consider replacing it. The Quiz Agent drafted an alternative.' },
              ].map((i, ix) => (
                <div key={ix} className="rounded-2xl border border-line/70 bg-white/70 p-3.5 text-[12px] leading-relaxed text-ink-soft">
                  <span className="mr-1.5">{i.icon}</span>{i.text}
                </div>
              ))}
            </div>
            <button className="mt-3 rounded-xl bg-peri-soft py-2.5 text-[12.5px] font-bold text-peri-deep transition hover:bg-peri/15">View full report</button>
          </Glass>
        </FadeIn>
      </div>

      {/* student management table */}
      <FadeIn>
        <Glass className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 p-5">
            <div>
              <h3 className="font-display text-[15px] font-bold text-ink">Manage students</h3>
              <p className="text-[11.5px] text-muted">Risk scores from XGBoost early-warning model</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search students…" className="rounded-xl border border-line bg-white/80 py-2 pl-8 pr-3 text-[12.5px] outline-none transition focus:border-peri" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line/70 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-5 py-3">Student</th><th className="px-4 py-3">Performance</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3">Trend</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Predicted final</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.name} className="border-b border-line/40 transition hover:bg-white/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold text-white" style={{ background: s.color }}>{s.initials}</span>
                        <div><div className="text-[13px] font-bold text-ink">{s.name}</div><div className="text-[10.5px] text-muted">{s.roll}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><div className="w-24"><Bar value={s.performance} color={s.performance >= 75 ? '#8fd4b8' : s.performance >= 60 ? '#f2d491' : '#f0b9cf'} /><span className="text-[10.5px] font-bold text-ink-soft">{s.performance}%</span></div></td>
                    <td className="px-4 py-3.5 text-[12.5px] font-semibold text-ink-soft">{s.attendance}%</td>
                    <td className="px-4 py-3.5">{s.trend === 'up' ? <TrendingUp size={15} className="text-[#3d9a6e]" /> : <TrendingDown size={15} className="text-[#c76a92]" />}</td>
                    <td className="px-4 py-3.5"><Chip tone={s.risk === 'Low' ? 'mint' : s.risk === 'Medium' ? 'butter' : 'blush'}>{s.risk}</Chip></td>
                    <td className="px-4 py-3.5 font-display text-[13.5px] font-bold text-ink">{s.predicted}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Glass>
      </FadeIn>

      {/* quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: <ClipboardList size={17} />, title: 'Create assignment', desc: 'With AI-drafted rubric', tone: 'bg-peri-soft text-peri-deep' },
          { icon: <CalendarCheck2 size={17} />, title: 'Take attendance', desc: 'Today · CS302 · 10 AM slot', tone: 'bg-mint-soft text-[#3d9a6e]' },
          { icon: <FileText size={17} />, title: 'Course management', desc: 'Syllabus, modules & pacing', tone: 'bg-lilac-soft text-[#7a63b8]' },
        ].map((a, i) => (
          <FadeIn key={a.title} delay={i * 0.05}>
            <Glass hover className="flex cursor-pointer items-center gap-4 p-5">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.tone}`}>{a.icon}</span>
              <div><div className="font-display text-[14px] font-bold text-ink">{a.title}</div><div className="text-[11.5px] text-muted">{a.desc}</div></div>
            </Glass>
          </FadeIn>
        ))}
      </div>

      {/* AI quiz creator modal */}
      <AnimatePresence>
        {quizModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm" onClick={() => setQuizModal(false)}>
            <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink"><Wand2 size={17} className="text-lilac" /> AI Quiz Creator</h3>
                <button onClick={() => setQuizModal(false)} className="rounded-full p-1.5 text-muted transition hover:bg-mist"><X size={16} /></button>
              </div>
              {!generated ? (
                <div className="mt-5 space-y-3.5">
                  <div><label className="text-[11px] font-bold uppercase tracking-wider text-muted">Topic</label>
                    <input defaultValue="Dynamic Programming — state design" className="mt-1 w-full rounded-xl border border-line bg-mist/60 px-3.5 py-2.5 text-[13px] outline-none transition focus:border-peri" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[11px] font-bold uppercase tracking-wider text-muted">Questions</label>
                      <select className="mt-1 w-full rounded-xl border border-line bg-mist/60 px-3.5 py-2.5 text-[13px] outline-none"><option>10</option><option>15</option><option>20</option></select></div>
                    <div><label className="text-[11px] font-bold uppercase tracking-wider text-muted">Difficulty</label>
                      <select className="mt-1 w-full rounded-xl border border-line bg-mist/60 px-3.5 py-2.5 text-[13px] outline-none"><option>Adaptive</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                  </div>
                  <div><label className="text-[11px] font-bold uppercase tracking-wider text-muted">Source material</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-mist/60 px-3.5 py-2.5 text-[12.5px] font-semibold text-ink-soft"><FileText size={13} className="text-peri" /> DSA_DynamicProgramming_Slides.pptx</div></div>
                  <button onClick={() => setGenerated(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"><Sparkles size={15} /> Generate quiz</button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-soft text-[#3d9a6e]"><CheckCircle2 size={26} /></div>
                  <h4 className="mt-3 font-display text-[16px] font-bold text-ink">Quiz drafted!</h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">10 questions generated from your slides — 6 MCQ, 2 coding, 1 fill-in, 1 subjective. Bloom’s coverage: Remember → Analyze.</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setQuizModal(false)} className="flex-1 rounded-xl border border-line py-2.5 text-[12.5px] font-bold text-ink-soft">Review items</button>
                    <button onClick={() => setQuizModal(false)} className="flex-1 rounded-xl bg-gradient-to-r from-peri to-lilac py-2.5 text-[12.5px] font-bold text-white shadow"><Plus size={12} className="mr-1 inline" /> Publish to class</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
