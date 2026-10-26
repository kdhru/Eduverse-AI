import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserRound, BrainCog, Sparkles, ListChecks, Map, LineChart, Lightbulb, DatabaseZap, Boxes, Network, Cpu, MessageSquareText, ArrowDown } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn } from '../../components/ui'

const AGENTS = [
  { icon: <Sparkles size={16} />, name: 'Tutor Agent', desc: 'Grounded Q&A with citations', tone: 'bg-peri-soft text-peri-deep border-peri/30' },
  { icon: <ListChecks size={16} />, name: 'Quiz Agent', desc: 'IRT-adaptive item generation', tone: 'bg-lilac-soft text-[#7a63b8] border-lilac/30' },
  { icon: <Map size={16} />, name: 'Roadmap Agent', desc: 'Curriculum sequencing', tone: 'bg-sky-soft text-[#4a7fb5] border-sky/30' },
  { icon: <LineChart size={16} />, name: 'Performance Agent', desc: 'XGBoost + SHAP forecasting', tone: 'bg-mint-soft text-[#3d9a6e] border-mint/30' },
  { icon: <Lightbulb size={16} />, name: 'Recommendation Agent', desc: 'Next-best-action ranking', tone: 'bg-blush-soft text-[#c76a92] border-blush/30' },
]

const PIPELINE = [
  { icon: <DatabaseZap size={17} />, name: 'RAG Engine', desc: 'Hybrid retrieval · semantic + BM25 rerank over your documents', meta: 'LangChain retriever · top-k = 8' },
  { icon: <Boxes size={17} />, name: 'Vector Database', desc: 'FAISS index · 1,432 chunks · bge-large embeddings (1024-d)', meta: 'IVF-PQ · 12 ms avg lookup' },
  { icon: <Network size={17} />, name: 'Knowledge Graph', desc: 'Neo4j concept graph · prerequisite traversal & gap detection', meta: '2,840 nodes · 9,120 edges' },
  { icon: <Cpu size={17} />, name: 'Large Language Model', desc: 'Llama 3 70B (4-bit) · Mistral fallback · guarded decoding', meta: '820 ms median inference' },
  { icon: <MessageSquareText size={17} />, name: 'Final Response', desc: 'Cited, markdown-formatted answer streamed to the student', meta: 'With confidence + sources' },
]

const STEPS = 4 + PIPELINE.length // request, orchestrator, agents, then pipeline

export default function Workflow() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % STEPS), 1600)
    return () => clearInterval(t)
  }, [])

  const Connector = ({ on }: { on: boolean }) => (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center">
        <svg width="12" height="30">
          <line x1="6" y1="0" x2="6" y2="22" stroke={on ? '#7d88e6' : '#d9d7ea'} strokeWidth="2" className={on ? 'flow-dash' : ''} />
        </svg>
        <ArrowDown size={13} className={on ? 'text-peri' : 'text-line'} />
      </div>
    </div>
  )

  return (
    <div>
      <PageHead
        crumbs={['Home', 'AI Workflow']}
        title="Multi-Agent AI Workflow"
        subtitle="Live view of how a student request flows through the orchestrated agent architecture"
        actions={<Chip tone="mint"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3d9a6e]" /> Pipeline live</Chip>}
      />

      <div className="mx-auto max-w-2xl">
        {/* student request */}
        <FadeIn>
          <Glass className={`p-5 transition-all duration-500 ${active === 0 ? 'shadow-[0_0_0_2px_rgba(125,136,230,0.4),0_16px_44px_-16px_rgba(125,136,230,0.5)]' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-lilac text-white"><UserRound size={18} /></div>
              <div className="flex-1">
                <div className="font-display text-[15px] font-bold text-ink">Student Request</div>
                <div className="text-[12px] text-ink-soft">“Explain memoization vs tabulation from my DSA slides”</div>
              </div>
              <Chip tone="peri">t = 0 ms</Chip>
            </div>
          </Glass>
        </FadeIn>

        <Connector on={active === 0} />

        {/* orchestrator */}
        <FadeIn delay={0.05}>
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-peri via-[#8f8ce0] to-lilac p-5 text-white shadow-[0_16px_40px_-14px_rgba(125,136,230,0.7)] transition-all duration-500 ${active === 1 ? 'scale-[1.015]' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"><BrainCog size={18} className={active === 1 ? 'animate-spin [animation-duration:3s]' : ''} /></div>
              <div className="flex-1">
                <div className="font-display text-[15px] font-bold">AI Orchestrator</div>
                <div className="text-[12px] text-white/85">Intent classification → routes to Tutor Agent (confidence 0.94) · spawns parallel context calls</div>
              </div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">t + 38 ms</span>
            </div>
          </div>
        </FadeIn>

        <Connector on={active === 1} />

        {/* agents */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {AGENTS.map((a, i) => (
              <motion.div
                key={a.name}
                animate={active === 2 && i === 0 ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.8 }}
                className={`rounded-2xl border bg-white/75 p-3 text-center backdrop-blur transition-all duration-500 ${active === 2 && i === 0 ? 'shadow-[0_0_0_2px_rgba(125,136,230,0.45)]' : 'border-line'}`}
              >
                <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${a.tone.split(' border')[0]}`}>{a.icon}</div>
                <div className="mt-2 text-[11.5px] font-bold leading-tight text-ink">{a.name}</div>
                <div className="mt-0.5 text-[9.5px] leading-snug text-muted">{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <Connector on={active === 2} />

        {/* pipeline */}
        {PIPELINE.map((p, i) => (
          <div key={p.name}>
            <FadeIn delay={0.05 * i}>
              <Glass className={`p-5 transition-all duration-500 ${active === 3 + i ? 'shadow-[0_0_0_2px_rgba(125,136,230,0.4),0_16px_44px_-16px_rgba(125,136,230,0.5)]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${active === 3 + i ? 'bg-gradient-to-br from-peri to-lilac text-white' : 'bg-peri-soft text-peri-deep'}`}>{p.icon}</div>
                  <div className="flex-1">
                    <div className="font-display text-[15px] font-bold text-ink">{p.name}</div>
                    <div className="text-[12px] text-ink-soft">{p.desc}</div>
                  </div>
                  <Chip tone="ink" className="hidden sm:inline-flex">{p.meta}</Chip>
                </div>
              </Glass>
            </FadeIn>
            {i < PIPELINE.length - 1 && <Connector on={active === 3 + i} />}
          </div>
        ))}

        <FadeIn>
          <div className="mt-6 rounded-3xl bg-gradient-to-r from-mint-soft to-sky-soft p-5 text-[12.5px] leading-relaxed text-ink-soft">
            <strong className="font-bold text-[#3d9a6e]">End-to-end trace:</strong> median request completes in <strong>1.18 s</strong> —
            retrieval 110 ms · graph traversal 260 ms (parallel) · LLM generation 820 ms · formatting 12 ms.
            Redis semantic cache short-circuits 34% of repeat questions in under 90 ms.
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
