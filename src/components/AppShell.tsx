import { useState, type ReactNode } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Sparkles, MessagesSquare, Map, ListChecks, ClipboardList,
  LineChart, AlertTriangle, Lightbulb, FolderOpen, StickyNote, CalendarDays, Bell, Settings,
  Network, Workflow, Menu, X, Search, Flame, LogOut, GraduationCap, Users, FilePlus2,
  BrainCircuit, ServerCog, ShieldCheck, Building2, ChevronDown, UserRound, Coins, BookMarked
} from 'lucide-react'
import { notifications } from '../lib/data'
import { usePoints, levelFor } from '../lib/points'

type Role = 'student' | 'teacher' | 'admin'

const NAV: Record<Role, { group: string; items: { to: string; label: string; icon: ReactNode; end?: boolean }[] }[]> = {
  student: [
    {
      group: 'Learn',
      items: [
        { to: '/app', label: 'Dashboard', icon: <LayoutDashboard size={17} />, end: true },
        { to: '/app/courses', label: 'My Courses', icon: <BookOpen size={17} /> },
        { to: '/app/ebooks', label: 'My eBooks', icon: <BookMarked size={17} /> },
        { to: '/app/tutor', label: 'AI Courses', icon: <Sparkles size={17} /> },
        { to: '/app/chat', label: 'AI Chat', icon: <MessagesSquare size={17} /> },
        { to: '/app/roadmap', label: 'Study Roadmap', icon: <Map size={17} /> },
      ],
    },
    {
      group: 'Practice',
      items: [
        { to: '/app/quizzes', label: 'Adaptive Quizzes', icon: <ListChecks size={17} /> },
        { to: '/app/assignments', label: 'Assignments', icon: <ClipboardList size={17} /> },
        { to: '/app/rewards', label: 'Rewards & Points', icon: <Coins size={17} /> },
      ],
    },
    {
      group: 'Intelligence',
      items: [
        { to: '/app/analytics', label: 'Performance Analytics', icon: <LineChart size={17} /> },
        { to: '/app/weak-topics', label: 'Weak Topics', icon: <AlertTriangle size={17} /> },
        { to: '/app/recommendations', label: 'Recommendations', icon: <Lightbulb size={17} /> },
        { to: '/app/knowledge-graph', label: 'Knowledge Graph', icon: <Network size={17} /> },
        { to: '/app/workflow', label: 'AI Workflow', icon: <Workflow size={17} /> },
      ],
    },
    {
      group: 'Library',
      items: [
        { to: '/app/materials', label: 'Study Materials', icon: <FolderOpen size={17} /> },
        { to: '/app/notes', label: 'Notes', icon: <StickyNote size={17} /> },
        { to: '/app/calendar', label: 'Calendar', icon: <CalendarDays size={17} /> },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/app/notifications', label: 'Notifications', icon: <Bell size={17} /> },
        { to: '/app/settings', label: 'Settings', icon: <Settings size={17} /> },
      ],
    },
  ],
  teacher: [
    {
      group: 'Teach',
      items: [
        { to: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={17} />, end: true },
        { to: '/teacher/students', label: 'Manage Students', icon: <Users size={17} /> },
        { to: '/teacher/materials', label: 'Course Materials', icon: <FilePlus2 size={17} /> },
        { to: '/teacher/quiz-creator', label: 'AI Quiz Creator', icon: <BrainCircuit size={17} /> },
      ],
    },
    {
      group: 'Insight',
      items: [
        { to: '/teacher/analytics', label: 'Student Analytics', icon: <LineChart size={17} /> },
        { to: '/app/workflow', label: 'AI Workflow', icon: <Workflow size={17} /> },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/app/notifications', label: 'Notifications', icon: <Bell size={17} /> },
        { to: '/app/settings', label: 'Settings', icon: <Settings size={17} /> },
      ],
    },
  ],
  admin: [
    {
      group: 'Platform',
      items: [
        { to: '/admin', label: 'Overview', icon: <LayoutDashboard size={17} />, end: true },
        { to: '/admin/users', label: 'Users & Roles', icon: <ShieldCheck size={17} /> },
        { to: '/admin/courses', label: 'Courses & Departments', icon: <Building2 size={17} /> },
        { to: '/admin/system', label: 'System Health', icon: <ServerCog size={17} /> },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/app/notifications', label: 'Notifications', icon: <Bell size={17} /> },
        { to: '/app/settings', label: 'Settings', icon: <Settings size={17} /> },
      ],
    },
  ],
}

const ROLE_META: Record<Role, { name: string; sub: string; avatar: string; color: string }> = {
  student: { name: 'Aarav Sharma', sub: 'B.Tech CSE · Sem 5', avatar: 'AS', color: 'from-peri to-lilac' },
  teacher: { name: 'Prof. Ritu Mehta', sub: 'Dept. of CSE', avatar: 'RM', color: 'from-lilac to-blush' },
  admin: { name: 'Meera Krishnan', sub: 'Platform Admin', avatar: 'MK', color: 'from-sky to-mint' },
}

export default function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const meta = ROLE_META[role]
  const unread = notifications.filter(n => n.unread).length
  const { balance, totalEarned } = usePoints()
  const lvl = levelFor(totalEarned)

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_6px_18px_-6px_rgba(125,136,230,0.7)]">
          <GraduationCap size={19} />
        </div>
        <div>
          <div className="font-display text-[15px] font-bold leading-none text-ink">EduMind AI</div>
          <div className="mt-0.5 text-[10px] font-medium tracking-wide text-muted">MULTI-AGENT LEARNING</div>
        </div>
      </Link>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {NAV[role].map(section => (
          <div key={section.group}>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{section.group}</div>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-peri-soft to-lilac-soft text-peri-deep shadow-[inset_0_0_0_1px_rgba(125,136,230,0.18)]'
                        : 'text-ink-soft hover:bg-white/70 hover:text-ink'
                    }`
                  }
                >
                  <span className="opacity-80 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-2xl bg-gradient-to-br from-peri to-lilac p-4 text-white shadow-[0_10px_30px_-10px_rgba(125,136,230,0.6)]">
        <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} /> EduMind Pro</div>
        <p className="mt-1 text-[11px] leading-relaxed text-white/85">Unlimited AI tutoring, priority inference & advanced analytics.</p>
        <button className="mt-2.5 w-full rounded-xl bg-white/95 py-1.5 text-xs font-bold text-peri-deep transition hover:bg-white">Upgrade</button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-mist">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-line/70 bg-white/60 backdrop-blur-xl lg:block">
        {sidebar}
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[264px] bg-white shadow-2xl lg:hidden"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-full p-1.5 text-muted hover:bg-mist"><X size={18} /></button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[248px]">
        {/* topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line/70 bg-white/65 px-4 backdrop-blur-xl md:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-ink-soft hover:bg-white lg:hidden"><Menu size={19} /></button>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              placeholder="Search courses, topics, materials…  ⌘K"
              className="w-full rounded-2xl border border-line bg-white/80 py-2 pl-9 pr-4 text-[13px] text-ink outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
            />
          </div>
          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-1.5">
            {role === 'student' && (
              <>
                <Link
                  to="/app/ebooks"
                  className="mr-0.5 hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-peri-soft to-lilac-soft px-3 py-1.5 text-xs font-bold text-peri-deep shadow-[inset_0_0_0_1px_rgba(125,136,230,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(125,136,230,0.6)] sm:flex"
                  title="Upload & learn from your own eBooks"
                >
                  <BookMarked size={13} /> eBooks
                </Link>
                <Link
                  to="/app/rewards"
                  className="mr-1 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-butter-soft to-[#fbeecb] px-3 py-1.5 text-xs font-bold text-[#b08b2e] shadow-[inset_0_0_0_1px_rgba(232,185,79,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(232,185,79,0.6)]"
                  title={`Level ${lvl.index} · ${lvl.name}`}
                >
                  <Coins size={13} className="text-[#d9a53a]" />
                  <motion.span key={balance} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
                    {balance.toLocaleString()}
                  </motion.span>
                  <span className="hidden text-[10px] font-extrabold text-[#d9a53a] md:inline">pts</span>
                </Link>
                <div className="mr-1 hidden items-center gap-1.5 rounded-full bg-butter-soft px-3 py-1.5 text-xs font-bold text-[#b08b2e] lg:flex">
                  <Flame size={13} className="flicker text-[#e8a33d]" /> 17-day streak
                </div>
              </>
            )}

            {/* notifications */}
            <div className="relative">
              <button onClick={() => { setBellOpen(!bellOpen); setProfileOpen(false) }} className="relative rounded-xl p-2 text-ink-soft transition hover:bg-white">
                <Bell size={18} />
                {unread > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blush text-[9px] font-bold text-white">{unread}</span>}
              </button>
              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-20px_rgba(93,95,160,0.4)]"
                  >
                    <div className="flex items-center justify-between border-b border-line px-4 py-3">
                      <span className="text-sm font-bold text-ink">Notifications</span>
                      <span className="text-[11px] font-semibold text-peri-deep">{unread} new</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.slice(0, 4).map((n, i) => (
                        <div key={i} className="flex gap-3 border-b border-line/60 px-4 py-3 transition hover:bg-mist">
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-peri' : 'bg-line'}`} />
                          <div>
                            <div className="text-[12.5px] font-semibold text-ink">{n.title}</div>
                            <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-soft">{n.body}</div>
                            <div className="mt-1 text-[10px] text-muted">{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/app/notifications" onClick={() => setBellOpen(false)} className="block bg-mist px-4 py-2.5 text-center text-xs font-bold text-peri-deep transition hover:bg-peri-soft">
                      View all notifications
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setBellOpen(false) }} className="flex items-center gap-2 rounded-2xl py-1 pl-1 pr-2 transition hover:bg-white">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-xs font-bold text-white`}>{meta.avatar}</span>
                <ChevronDown size={14} className="hidden text-muted sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-20px_rgba(93,95,160,0.4)]"
                  >
                    <div className="border-b border-line px-4 py-3">
                      <div className="text-sm font-bold text-ink">{meta.name}</div>
                      <div className="text-[11px] text-muted">{meta.sub}</div>
                    </div>
                    <div className="p-1.5">
                      <div className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">Switch role (demo)</div>
                      {([['student', '/app', 'Student'], ['teacher', '/teacher', 'Teacher'], ['admin', '/admin', 'Administrator']] as const).map(([r, path, label]) => (
                        <button
                          key={r}
                          onClick={() => { setProfileOpen(false); navigate(path) }}
                          className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition ${role === r ? 'bg-peri-soft text-peri-deep' : 'text-ink-soft hover:bg-mist'}`}
                        >
                          <UserRound size={14} /> {label} view
                        </button>
                      ))}
                      <div className="my-1 border-t border-line" />
                      <button onClick={() => navigate('/login')} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium text-[#c76a92] transition hover:bg-blush-soft">
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="relative flex-1 p-4 md:p-6 lg:p-8">
          <div className="aurora opacity-50" />
          <div className="relative z-10 mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
