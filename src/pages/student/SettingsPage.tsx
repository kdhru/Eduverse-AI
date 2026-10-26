import { useState } from 'react'
import { UserRound, Palette, Globe, ShieldCheck, BrainCircuit, Bell, Moon, Sun } from 'lucide-react'
import { Glass, PageHead, FadeIn, Toggle, Chip } from '../../components/ui'
import { student } from '../../lib/data'

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <Glass className="p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-peri-soft text-peri-deep">{icon}</span>
        <div>
          <h2 className="font-display text-[15px] font-bold text-ink">{title}</h2>
          <p className="text-[11.5px] text-muted">{desc}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </Glass>
  )
}

const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <div><div className="text-[13px] font-semibold text-ink">{label}</div>{sub && <div className="text-[11px] text-muted">{sub}</div>}</div>
    {children}
  </div>
)

export default function SettingsPage() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('English')
  const [toggles, setToggles] = useState({ analytics: true, share: false, personalize: true, citations: true, voice: false, quizRem: true, deadlines: true, aiRecs: true, badges: true, digest: false })
  const set = (k: keyof typeof toggles) => (v: boolean) => setToggles(t => ({ ...t, [k]: v }))

  return (
    <div className="mx-auto max-w-3xl">
      <PageHead crumbs={['Home', 'Settings']} title="Settings" subtitle="Profile, appearance, privacy and AI preferences" />
      <div className="space-y-5">
        <FadeIn>
          <Section icon={<UserRound size={17} />} title="Profile" desc="Your identity across EduMind">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-peri to-lilac font-display text-xl font-bold text-white shadow-lg">{student.avatar}</div>
              <div className="min-w-0 flex-1">
                <input defaultValue={student.name} className="w-full max-w-xs rounded-xl border border-line bg-white/80 px-3.5 py-2 text-[13px] font-semibold text-ink outline-none transition focus:border-peri" />
                <div className="mt-1.5 text-[11.5px] text-muted">{student.email} · {student.program}</div>
              </div>
              <button className="rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2 text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5">Save changes</button>
            </div>
          </Section>
        </FadeIn>

        <FadeIn delay={0.04}>
          <Section icon={<Palette size={17} />} title="Appearance" desc="Theme & display">
            <Row label="Theme" sub={dark ? 'Dark — coming to the production build' : 'Light · soft pastel'}>
              <div className="flex gap-1.5 rounded-2xl bg-white/70 p-1">
                <button onClick={() => setDark(false)} className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition ${!dark ? 'bg-gradient-to-r from-peri to-lilac text-white shadow' : 'text-ink-soft'}`}><Sun size={13} /> Light</button>
                <button onClick={() => setDark(true)} className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition ${dark ? 'bg-gradient-to-r from-[#4a4a68] to-[#34324a] text-white shadow' : 'text-ink-soft'}`}><Moon size={13} /> Dark</button>
              </div>
            </Row>
            {dark && <div className="rounded-2xl bg-butter-soft p-3.5 text-[12px] font-semibold text-[#b08b2e]">🌙 Dark mode preview is queued for the next prototype iteration — preference saved.</div>}
          </Section>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Section icon={<Globe size={17} />} title="Language" desc="Interface & AI response language">
            <Row label="Display language">
              <select value={lang} onChange={e => setLang(e.target.value)} className="rounded-xl border border-line bg-white/80 px-3.5 py-2 text-[12.5px] font-semibold text-ink outline-none transition focus:border-peri">
                {['English', 'हिन्दी (Hindi)', 'Español', 'Français', '日本語', 'Deutsch'].map(l => <option key={l}>{l}</option>)}
              </select>
            </Row>
          </Section>
        </FadeIn>

        <FadeIn delay={0.12}>
          <Section icon={<ShieldCheck size={17} />} title="Privacy" desc="Control your data footprint">
            <Row label="Learning analytics" sub="Allow performance modelling on your activity"><Toggle on={toggles.analytics} onChange={set('analytics')} /></Row>
            <Row label="Share progress with teachers" sub="Faculty can view your analytics dashboard"><Toggle on={toggles.share} onChange={set('share')} /></Row>
            <div className="rounded-2xl bg-mint-soft p-3.5 text-[11.5px] leading-relaxed text-[#3d9a6e]">Your documents and chat history are stored in your institution’s isolated tenant and are <strong>never</strong> used for model training.</div>
          </Section>
        </FadeIn>

        <FadeIn delay={0.16}>
          <Section icon={<BrainCircuit size={17} />} title="AI Preferences" desc="How the agents behave">
            <Row label="Personalized recommendations" sub="Let the Recommendation Agent rank next actions"><Toggle on={toggles.personalize} onChange={set('personalize')} /></Row>
            <Row label="Always show citations" sub="Every tutor answer links back to source pages"><Toggle on={toggles.citations} onChange={set('citations')} /></Row>
            <Row label="Voice responses" sub="Read AI answers aloud"><Toggle on={toggles.voice} onChange={set('voice')} /></Row>
            <Row label="Response style">
              <div className="flex gap-1.5">{['Concise', 'Detailed'].map((s, i) => <Chip key={s} tone={i === 1 ? 'peri' : 'ink'} className="cursor-pointer">{s}</Chip>)}</div>
            </Row>
          </Section>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Section icon={<Bell size={17} />} title="Notification Settings" desc="What reaches you, and when">
            <Row label="Quiz reminders"><Toggle on={toggles.quizRem} onChange={set('quizRem')} /></Row>
            <Row label="Assignment deadlines"><Toggle on={toggles.deadlines} onChange={set('deadlines')} /></Row>
            <Row label="AI recommendations"><Toggle on={toggles.aiRecs} onChange={set('aiRecs')} /></Row>
            <Row label="Achievement badges"><Toggle on={toggles.badges} onChange={set('badges')} /></Row>
            <Row label="Weekly email digest"><Toggle on={toggles.digest} onChange={set('digest')} /></Row>
          </Section>
        </FadeIn>
      </div>
    </div>
  )
}
