import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, Sparkles, ArrowRight, Bot, Network, ListChecks, LineChart, Map,
  FolderOpen, ShieldCheck, Zap, BookOpenCheck, BrainCircuit, ChevronDown,
  Quote, Mail, MapPin, Phone, Github, Twitter, Linkedin, Layers, Database, Cpu, Cloud,
} from 'lucide-react'
import { useState } from 'react'
import { FadeIn, Glass, Chip } from '../components/ui'

const features = [
  { icon: <Bot size={20} />, title: 'Multi-Agent AI Tutor', desc: 'Five specialized agents — Tutor, Quiz, Roadmap, Performance and Recommendation — orchestrated to answer from your own course materials.', tone: 'bg-peri-soft text-peri-deep' },
  { icon: <FolderOpen size={20} />, title: 'RAG Knowledge Center', desc: 'Upload PDFs, slides, books and past papers. FAISS-powered retrieval grounds every answer with citations to your documents.', tone: 'bg-lilac-soft text-[#7a63b8]' },
  { icon: <ListChecks size={20} />, title: 'Adaptive Quizzing', desc: 'Item-response theory calibrates difficulty in real time — MCQ, fill-in, true/false, coding and subjective questions.', tone: 'bg-sky-soft text-[#4a7fb5]' },
  { icon: <Network size={20} />, title: 'Knowledge Graph', desc: 'Neo4j maps every concept you learn. Explore prerequisites, spot gaps, and watch mastery propagate through the graph.', tone: 'bg-mint-soft text-[#3d9a6e]' },
  { icon: <LineChart size={20} />, title: 'Predictive Analytics', desc: 'XGBoost + SHAP forecast exam outcomes and explain exactly which habits move your score — weeks in advance.', tone: 'bg-blush-soft text-[#c76a92]' },
  { icon: <Map size={20} />, title: 'Personal Roadmaps', desc: 'Semester → subjects → concepts → practice → revision → assessment. A living plan that adapts to your forgetting curve.', tone: 'bg-butter-soft text-[#b08b2e]' },
]

const steps = [
  { n: '01', title: 'Upload your materials', desc: 'Drop in lecture PDFs, slides, notes and previous-year papers. The RAG engine chunks, embeds and indexes everything in seconds.' },
  { n: '02', title: 'AI maps your knowledge', desc: 'A diagnostic assessment plus the knowledge graph pinpoint exactly what you know, what you almost know, and what needs work.' },
  { n: '03', title: 'Agents build your plan', desc: 'The orchestrator coordinates tutor, quiz and roadmap agents into one personalized study plan with daily goals.' },
  { n: '04', title: 'Learn, adapt, master', desc: 'Every question you answer refines the model. Difficulty adapts, weak topics resurface, and predictions sharpen.' },
]

const benefits = [
  { stat: '38%', label: 'faster concept mastery', desc: 'versus self-paced study in our 12-week pilot cohort (n = 240 students)' },
  { stat: '2.4×', label: 'more practice retention', desc: 'spaced-repetition scheduling tuned to each learner’s forgetting curve' },
  { stat: '91%', label: 'at-risk prediction AUC', desc: 'early-warning model gives teachers 4+ weeks of intervention lead time' },
  { stat: '<1.2s', label: 'median AI response', desc: 'quantized Llama 3 inference with Redis semantic caching' },
]

const stack = [
  { group: 'Frontend', icon: <Layers size={16} />, items: ['React 19', 'TypeScript', 'Material UI', 'Recharts'] },
  { group: 'Backend', icon: <Cpu size={16} />, items: ['FastAPI', 'Pydantic', 'Celery', 'WebSockets'] },
  { group: 'AI / ML', icon: <BrainCircuit size={16} />, items: ['LangChain', 'Llama 3 / Mistral', 'RAG + FAISS', 'Neo4j', 'XGBoost', 'SHAP'] },
  { group: 'Data', icon: <Database size={16} />, items: ['PostgreSQL', 'Redis', 'pgvector', 'MinIO'] },
  { group: 'Deployment', icon: <Cloud size={16} />, items: ['Docker', 'AWS ECS', 'CloudFront', 'GitHub Actions'] },
]

const testimonials = [
  { name: 'Diya Patel', role: 'CS Undergraduate, Sem 5', quote: 'The AI tutor actually cites my own lecture PDFs. It feels like office hours that never close — my DSA score went from 61% to 92% in one semester.', avatar: 'DP', color: 'from-peri to-lilac' },
  { name: 'Prof. Ritu Mehta', role: 'Faculty, Computer Science', quote: 'The risk predictions flagged three struggling students in week 4 — weeks before the mid-term would have. That lead time changed their outcomes.', avatar: 'RM', color: 'from-lilac to-blush' },
  { name: 'Kabir Malhotra', role: 'B.Tech Student', quote: 'The knowledge graph showed me my OOP gaps were really closure gaps. One targeted week of adaptive drills fixed what months of rereading didn’t.', avatar: 'KM', color: 'from-sky to-mint' },
  { name: 'Dr. S. Kulkarni', role: 'Dept. Head, ECE', quote: 'Enterprise-grade admin tooling with real observability. We rolled out to 1,200 students with a two-person IT team.', avatar: 'SK', color: 'from-mint to-butter' },
]

const faqs = [
  { q: 'How does the AI answer from my own documents?', a: 'When you upload a file, it is split into semantic chunks, embedded, and stored in a FAISS vector index. At question time, the RAG engine retrieves the most relevant chunks and the LLM answers strictly from them — with inline citations back to page numbers, so you can verify every claim.' },
  { q: 'Which AI models power EduMind?', a: 'The default stack runs Llama 3 (70B, quantized) for tutoring and Mistral for fast quiz generation, orchestrated through LangChain. Institutions can swap in any OpenAI-compatible endpoint or self-host entirely on-prem.' },
  { q: 'How do adaptive quizzes calibrate difficulty?', a: 'We use a 2-parameter item-response-theory model. Each answer updates your latent ability estimate (θ); the quiz agent then selects the next item that maximizes information at your current level — so questions stay in the productive-struggle zone.' },
  { q: 'Is student data private?', a: 'Yes. All documents and embeddings live in your institution’s isolated tenant. Nothing is used for model training, data is encrypted at rest (AES-256) and in transit, and the platform is designed for FERPA/GDPR alignment.' },
  { q: 'Can teachers create their own quizzes?', a: 'Teachers can generate quizzes from any uploaded material in one click, edit every generated item, control difficulty distribution, and push assignments to specific cohorts with deadlines and auto-grading.' },
  { q: 'What does the knowledge graph add?', a: 'Concepts rarely fail in isolation. The Neo4j graph links every topic to its prerequisites, so when you struggle with, say, backpropagation, the system checks upstream nodes like the chain rule — and remediates the true root cause.' },
]

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-display text-[15px] font-semibold text-ink">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-peri transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{a}</p>
      </motion.div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-mist">
      <div className="aurora" />
      <div className="dotgrid pointer-events-none absolute inset-x-0 top-0 h-[42rem] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      {/* nav */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_6px_18px_-6px_rgba(125,136,230,0.7)]">
                <GraduationCap size={19} />
              </div>
              <span className="font-display text-lg font-bold text-ink">EduMind <span className="text-peri-deep">AI</span></span>
            </Link>
            <nav className="hidden items-center gap-6 text-[13px] font-semibold text-ink-soft md:flex">
              <a href="#features" className="transition hover:text-peri-deep">Features</a>
              <a href="#how" className="transition hover:text-peri-deep">How it Works</a>
              <a href="#stack" className="transition hover:text-peri-deep">Technology</a>
              <a href="#faq" className="transition hover:text-peri-deep">FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-4 py-2 text-[13px] font-bold text-ink-soft transition hover:bg-white hover:text-ink">Login</Link>
              <Link to="/register" className="rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(125,136,230,0.8)] transition hover:shadow-[0_10px_26px_-8px_rgba(125,136,230,1)]">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <FadeIn>
              <Chip tone="peri" className="mb-5 !px-3.5 !py-1.5"><Sparkles size={13} /> IEEE Research Prototype · Multi-Agent RAG Architecture</Chip>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink md:text-[3.4rem]">
                Learning that <span className="bg-gradient-to-r from-peri-deep via-lilac to-blush bg-clip-text text-transparent">thinks along</span> with every student
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
                EduMind AI orchestrates five specialized AI agents over your own course materials —
                tutoring with citations, generating adaptive quizzes, mapping knowledge graphs,
                and predicting outcomes before exams ever arrive.
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/register" className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_-10px_rgba(125,136,230,0.9)] transition-all hover:-translate-y-0.5">
                  Start Learning <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/login" className="glass rounded-2xl px-6 py-3.5 text-sm font-bold text-peri-deep transition-all hover:-translate-y-0.5">
                  Login to Dashboard
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] font-semibold text-muted">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-mint" /> FERPA-aligned privacy</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-butter" /> &lt;1.2s AI responses</span>
                <span className="flex items-center gap-1.5"><BookOpenCheck size={14} className="text-lilac" /> Grounded in your materials</span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="relative">
            <div className="floaty relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-peri/25 via-lilac/20 to-blush/25 blur-3xl" />
              <img src="/images/hero.png" alt="EduMind AI neural learning illustration" className="relative w-full rounded-[2.5rem] border border-white/80 shadow-[0_30px_80px_-30px_rgba(93,95,160,0.5)]" />
              <motion.div
                className="glass-deep absolute -left-4 top-8 hidden rounded-2xl px-4 py-3 sm:block"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-ink"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-mint-soft text-[#3d9a6e]"><LineChart size={14} /></span> Predicted score</div>
                <div className="mt-1 font-display text-xl font-extrabold text-[#3d9a6e]">88 ± 3%</div>
              </motion.div>
              <motion.div
                className="glass-deep absolute -right-3 bottom-10 hidden rounded-2xl px-4 py-3 sm:block"
                animate={{ y: [0, 9, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-ink"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-peri-soft text-peri-deep"><Bot size={14} /></span> Tutor Agent</div>
                <div className="mt-1 text-[11px] font-medium text-ink-soft">“Cited from your Unit 3 PDF, p. 42”</div>
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* trust marquee */}
        <FadeIn delay={0.35}>
          <div className="mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="marquee flex w-max items-center gap-12 text-sm font-bold tracking-wide text-muted/80">
              {[...Array(2)].flatMap((_, k) =>
                ['NATIONAL INSTITUTE OF TECH', 'ORCHID UNIVERSITY', 'ST. XAVIER\u2019S COLLEGE', 'MERIDIAN POLYTECHNIC', 'AUРORA SCHOOL OF CS', 'DELTA ENGINEERING', 'LUMEN ACADEMY', 'CASCADE UNIVERSITY'].map((n, i) => (
                  <span key={`${k}-${i}`} className="flex items-center gap-2"><GraduationCap size={15} className="text-lilac" />{n}</span>
                )),
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <Chip tone="lilac" className="mb-4">Platform Capabilities</Chip>
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">One platform, five AI agents, zero guesswork</h2>
          <p className="mt-3 text-[15px] text-ink-soft">Every module below is live in this prototype — click through after signing in.</p>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.06}>
              <Glass hover className="h-full p-6">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${f.tone}`}>{f.icon}</div>
                <h3 className="font-display text-[17px] font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{f.desc}</p>
              </Glass>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <Chip tone="sky" className="mb-4">How it Works</Chip>
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">From uploaded PDF to mastered concept</h2>
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.08}>
              <div className="relative h-full">
                {i < steps.length - 1 && <div className="absolute -right-5 top-10 hidden text-line lg:block"><ArrowRight size={20} /></div>}
                <Glass hover className="h-full p-6">
                  <div className="font-display text-3xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_#ab96e0]">{s.n}</div>
                  <h3 className="mt-3 font-display text-[16px] font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{s.desc}</p>
                </Glass>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* benefits */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <div className="glass-deep relative overflow-hidden rounded-[2.5rem] p-8 md:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lilac/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky/25 blur-3xl" />
          <FadeIn className="relative mx-auto mb-12 max-w-2xl text-center">
            <Chip tone="mint" className="mb-4">Measured Benefits</Chip>
            <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">Outcomes, not just features</h2>
          </FadeIn>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <FadeIn key={b.label} delay={i * 0.08} className="text-center">
                <div className="font-display text-5xl font-extrabold text-transparent bg-gradient-to-br from-peri-deep to-lilac bg-clip-text">{b.stat}</div>
                <div className="mt-2 font-display text-[15px] font-bold text-ink">{b.label}</div>
                <p className="mx-auto mt-1.5 max-w-[15rem] text-[12.5px] leading-relaxed text-ink-soft">{b.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* tech stack */}
      <section id="stack" className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <Chip tone="blush" className="mb-4">Technology Stack</Chip>
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">Research-grade architecture, production-ready ops</h2>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stack.map((s, i) => (
            <FadeIn key={s.group} delay={i * 0.06}>
              <Glass hover className="h-full p-5">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-peri-deep">{s.icon}{s.group}</div>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {s.items.map(t => <span key={t} className="rounded-lg bg-white/80 px-2 py-1 text-[11px] font-semibold text-ink-soft shadow-sm">{t}</span>)}
                </div>
              </Glass>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
          <Chip tone="butter" className="mb-4">Testimonials</Chip>
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">Loved by students, trusted by faculty</h2>
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.07}>
              <Glass hover className="h-full p-6">
                <Quote size={22} className="text-lilac" />
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} text-xs font-bold text-white`}>{t.avatar}</span>
                  <div>
                    <div className="text-sm font-bold text-ink">{t.name}</div>
                    <div className="text-[11.5px] text-muted">{t.role}</div>
                  </div>
                </div>
              </Glass>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="relative z-10 mx-auto max-w-3xl px-4 py-20">
        <FadeIn className="mx-auto mb-10 max-w-2xl text-center">
          <Chip tone="peri" className="mb-4">FAQ</Chip>
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">Everything you’re wondering</h2>
        </FadeIn>
        <div className="space-y-3">
          {faqs.map((f, i) => <FadeIn key={f.q} delay={i * 0.05}><Faq {...f} /></FadeIn>)}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-peri via-[#8f8ce0] to-lilac p-10 text-center text-white shadow-[0_30px_80px_-30px_rgba(125,136,230,0.8)] md:p-16">
            <div className="dotgrid absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold md:text-4xl">Your AI study team is waiting</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/85">Join the pilot cohort — upload one PDF and watch five agents turn it into a personalized curriculum.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/register" className="rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-peri-deep shadow-lg transition hover:-translate-y-0.5">Start Learning Free</Link>
                <Link to="/app/workflow" className="rounded-2xl border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">Explore the Architecture</Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-line/70 bg-white/50 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-lilac text-white"><GraduationCap size={18} /></div>
              <span className="font-display text-lg font-bold text-ink">EduMind AI</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">Intelligent Multi-Agent Personalized Learning Platform. An IEEE research prototype exploring orchestrated RAG for education.</p>
            <div className="mt-4 flex gap-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink-soft shadow-sm transition hover:text-peri-deep"><Icon size={16} /></a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-display text-sm font-bold text-ink">Platform</div>
            <ul className="mt-3 space-y-2 text-[13px] font-medium text-ink-soft">
              <li><Link to="/app" className="transition hover:text-peri-deep">Student Dashboard</Link></li>
              <li><Link to="/teacher" className="transition hover:text-peri-deep">Teacher Dashboard</Link></li>
              <li><Link to="/admin" className="transition hover:text-peri-deep">Admin Console</Link></li>
              <li><Link to="/app/workflow" className="transition hover:text-peri-deep">Multi-Agent Workflow</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-sm font-bold text-ink">Research</div>
            <ul className="mt-3 space-y-2 text-[13px] font-medium text-ink-soft">
              <li><a href="#stack" className="transition hover:text-peri-deep">Architecture</a></li>
              <li><a href="#how" className="transition hover:text-peri-deep">RAG Pipeline</a></li>
              <li><a href="#features" className="transition hover:text-peri-deep">Adaptive IRT Engine</a></li>
              <li><a href="#faq" className="transition hover:text-peri-deep">Privacy & Ethics</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-sm font-bold text-ink">Contact</div>
            <ul className="mt-3 space-y-2.5 text-[13px] font-medium text-ink-soft">
              <li className="flex items-center gap-2"><Mail size={14} className="text-peri" /> research@edumind.ai</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-peri" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-peri" /> AI Research Lab, Block C,<br />Meridian University Campus</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line/70 py-5 text-center text-[12px] font-medium text-muted">
          © 2025 EduMind AI · IEEE Research Prototype · Built with React, FastAPI, LangChain & Llama 3
        </div>
      </footer>
    </div>
  )
}
