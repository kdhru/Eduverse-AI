import { useState } from 'react'
import {
  Users, ServerCog, Database, Activity, Cpu, HardDrive, ShieldCheck, FileText,
  Search, MoreHorizontal, CircleDot, Download, Building2,
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Glass, Chip, PageHead, FadeIn, Ring, Bar } from '../../components/ui'
import { adminUsers, aiUsage, serverMetrics, systemLogs } from '../../lib/data'

const tt = { borderRadius: 14, border: '1px solid #e7e5f2', background: 'rgba(255,255,255,0.96)', boxShadow: '0 10px 30px -10px rgba(93,95,160,0.3)', fontSize: 12, fontFamily: 'Figtree' }

export default function AdminDashboard() {
  const [q, setQ] = useState('')
  const users = adminUsers.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.role.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-5">
      <PageHead
        crumbs={['Admin', 'System Overview']}
        title="Administration Console"
        subtitle="Meridian University tenant · production · ap-south-1"
        actions={<Chip tone="mint"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3d9a6e]" /> All systems operational</Chip>}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Users size={17} />, label: 'Total users', value: '2,847', sub: '2,412 students · 391 faculty · 44 admin', tone: 'bg-peri-soft text-peri-deep' },
          { icon: <Activity size={17} />, label: 'AI requests (24 h)', value: '48.2k', sub: '▲ 12% · p95 latency 1.9 s', tone: 'bg-lilac-soft text-[#7a63b8]' },
          { icon: <Building2 size={17} />, label: 'Departments', value: '14', sub: '86 active courses this term', tone: 'bg-sky-soft text-[#4a7fb5]' },
          { icon: <Database size={17} />, label: 'Vector index', value: '1.2M', sub: 'chunks · FAISS · 38 GB', tone: 'bg-mint-soft text-[#3d9a6e]' },
        ].map((k, i) => (
          <FadeIn key={k.label} delay={i * 0.05}>
            <Glass hover className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${k.tone}`}>{k.icon}</div>
              <div className="min-w-0">
                <div className="text-[11.5px] font-semibold text-muted">{k.label}</div>
                <div className="font-display text-xl font-extrabold text-ink">{k.value}</div>
                <div className="truncate text-[10.5px] font-semibold text-muted">{k.sub}</div>
              </div>
            </Glass>
          </FadeIn>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* AI usage chart */}
        <FadeIn className="lg:col-span-2">
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">AI usage — requests per hour</h3>
            <p className="mb-3 text-[11.5px] text-muted">Llama 3 primary · Mistral fallback · last 24 hours</p>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={aiUsage} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ab96e0" stopOpacity={0.4} /><stop offset="100%" stopColor="#ab96e0" stopOpacity={0.03} /></linearGradient>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7d88e6" stopOpacity={0.4} /><stop offset="100%" stopColor="#7d88e6" stopOpacity={0.03} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#e7e5f2" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10.5, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} />
                <Area type="monotone" dataKey="tutor" name="Tutor Agent" stackId="1" stroke="#7d88e6" fill="url(#gB)" strokeWidth={2} />
                <Area type="monotone" dataKey="quiz" name="Quiz Agent" stackId="1" stroke="#ab96e0" fill="url(#gA)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* server health */}
        <FadeIn delay={0.06}>
          <Glass className="p-6">
            <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><ServerCog size={15} className="text-peri" /> Server health</h3>
            <div className="mt-4 space-y-4">
              {serverMetrics.map(m => (
                <div key={m.name}>
                  <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold">
                    <span className="flex items-center gap-1.5 text-ink">{m.icon === 'cpu' ? <Cpu size={13} className="text-muted" /> : m.icon === 'disk' ? <HardDrive size={13} className="text-muted" /> : <Database size={13} className="text-muted" />} {m.name}</span>
                    <span style={{ color: m.value > 80 ? '#c76a92' : m.value > 60 ? '#b08b2e' : '#3d9a6e' }}>{m.value}%</span>
                  </div>
                  <Bar value={m.value} color={m.value > 80 ? '#f0b9cf' : m.value > 60 ? '#f2d491' : '#8fd4b8'} />
                  <div className="mt-0.5 text-[10px] text-muted">{m.detail}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line/70 pt-4 text-center">
              <div><div className="font-display text-lg font-extrabold text-[#3d9a6e]">99.98%</div><div className="text-[10px] font-bold text-muted">Uptime (30 d)</div></div>
              <div><div className="font-display text-lg font-extrabold text-ink">42 ms</div><div className="text-[10px] font-bold text-muted">API p50</div></div>
            </div>
          </Glass>
        </FadeIn>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* user management */}
        <FadeIn className="lg:col-span-2">
          <Glass className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 p-5">
              <div><h3 className="font-display text-[15px] font-bold text-ink">User & role management</h3><p className="text-[11.5px] text-muted">RBAC · SSO via institutional IdP</p></div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search users…" className="rounded-xl border border-line bg-white/80 py-2 pl-8 pr-3 text-[12.5px] outline-none transition focus:border-peri" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead><tr className="border-b border-line/70 text-[10.5px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-5 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last active</th><th className="px-4 py-3" />
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.name} className="border-b border-line/40 transition hover:bg-white/60">
                      <td className="px-5 py-3"><div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold text-white" style={{ background: u.color }}>{u.initials}</span>
                        <div><div className="text-[13px] font-bold text-ink">{u.name}</div><div className="text-[10.5px] text-muted">{u.email}</div></div>
                      </div></td>
                      <td className="px-4 py-3"><Chip tone={u.role === 'Admin' ? 'blush' : u.role === 'Teacher' ? 'lilac' : 'peri'}>{u.role}</Chip></td>
                      <td className="px-4 py-3 text-[12.5px] font-semibold text-ink-soft">{u.dept}</td>
                      <td className="px-4 py-3"><span className={`flex items-center gap-1 text-[11.5px] font-bold ${u.status === 'Active' ? 'text-[#3d9a6e]' : 'text-muted'}`}><CircleDot size={11} /> {u.status}</span></td>
                      <td className="px-4 py-3 text-[12px] font-medium text-muted">{u.lastActive}</td>
                      <td className="px-4 py-3"><button className="rounded-lg p-1.5 text-muted transition hover:bg-mist hover:text-ink"><MoreHorizontal size={15} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Glass>
        </FadeIn>

        {/* db + reports */}
        <FadeIn delay={0.06}>
          <div className="space-y-5">
            <Glass className="p-6">
              <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><Database size={15} className="text-peri" /> Database monitoring</h3>
              <div className="mt-4 flex items-center justify-around">
                <div className="text-center"><Ring value={64} size={78} stroke={7} color="#7d88e6" sub="PG pool" /></div>
                <div className="text-center"><Ring value={31} size={78} stroke={7} color="#ab96e0" sub="Redis mem" /></div>
              </div>
              <div className="mt-4 space-y-1.5 text-[11.5px] font-semibold text-ink-soft">
                <div className="flex justify-between"><span>PostgreSQL 16 · primary</span><span className="text-[#3d9a6e]">healthy</span></div>
                <div className="flex justify-between"><span>Read replica lag</span><span>84 ms</span></div>
                <div className="flex justify-between"><span>Redis hit rate</span><span className="text-[#3d9a6e]">96.4%</span></div>
                <div className="flex justify-between"><span>Last backup</span><span>02:00 IST · verified</span></div>
              </div>
            </Glass>
            <Glass className="p-6">
              <h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><FileText size={15} className="text-peri" /> Reports</h3>
              <div className="mt-3 space-y-2">
                {['Monthly AI usage & cost', 'Learning outcomes summary', 'Security & access audit'].map(r => (
                  <button key={r} className="flex w-full items-center justify-between rounded-xl border border-line bg-white/70 px-3.5 py-2.5 text-[12.5px] font-semibold text-ink transition hover:border-peri/40">
                    {r} <Download size={13} className="text-muted" />
                  </button>
                ))}
              </div>
            </Glass>
          </div>
        </FadeIn>
      </div>

      {/* logs */}
      <FadeIn>
        <Glass className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/70 p-5">
            <div><h3 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-ink"><ShieldCheck size={15} className="text-peri" /> System logs</h3><p className="text-[11.5px] text-muted">Live tail · filtered to warn+ and notable info</p></div>
            <Chip tone="ink">streaming</Chip>
          </div>
          <div className="max-h-64 overflow-y-auto bg-[#26253a] p-4 font-mono text-[11px] leading-relaxed">
            {systemLogs.map((l, i) => (
              <div key={i} className="flex gap-3 py-0.5">
                <span className="shrink-0 text-[#6f6c94]">{l.time}</span>
                <span className={`w-12 shrink-0 font-bold ${l.level === 'ERROR' ? 'text-[#f0a1bd]' : l.level === 'WARN' ? 'text-[#ecd08a]' : 'text-[#8fd4b8]'}`}>{l.level}</span>
                <span className="text-[#c9c6e4]">{l.msg}</span>
              </div>
            ))}
          </div>
        </Glass>
      </FadeIn>
    </div>
  )
}
