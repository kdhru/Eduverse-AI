import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ZoomIn } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar } from '../../components/ui'
import { knowledgeGraph, type GraphNode } from '../../lib/data'

const W = 900
const H = 560

function masteryColor(m: number) {
  if (m >= 85) return '#8fd4b8'
  if (m >= 70) return '#9cc5ee'
  if (m >= 60) return '#f2d491'
  return '#f0b9cf'
}

type Positioned = { node: GraphNode; x: number; y: number; parent?: Positioned }

function layout(): Positioned[] {
  const root: Positioned = { node: knowledgeGraph, x: W / 2, y: 64 }
  const out: Positioned[] = [root]
  const l1 = knowledgeGraph.children ?? []
  const gap1 = W / (l1.length + 1)
  l1.forEach((c, i) => {
    const p1: Positioned = { node: c, x: gap1 * (i + 1), y: 230, parent: root }
    out.push(p1)
    const l2 = c.children ?? []
    const spread = Math.min(150, gap1 - 10)
    l2.forEach((g, j) => {
      const off = (j - (l2.length - 1) / 2) * (spread / Math.max(1, l2.length - 1) || 0)
      out.push({ node: g, x: p1.x + off, y: 420 + (j % 2) * 62, parent: p1 })
    })
  })
  return out
}

export default function KnowledgeGraph() {
  const nodes = layout()
  const [selected, setSelected] = useState<Positioned>(nodes[0])

  return (
    <div>
      <PageHead
        crumbs={['Home', 'Knowledge Graph']}
        title="Knowledge Graph"
        subtitle="Neo4j concept map for Python Programming · node color = your mastery · click any node to explore"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <Glass className="overflow-hidden p-2">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px]">
                {/* edges */}
                {nodes.filter(n => n.parent).map(n => (
                  <line
                    key={`e-${n.node.id}`}
                    x1={n.parent!.x} y1={n.parent!.y + 22} x2={n.x} y2={n.y - 22}
                    stroke={selected.node.id === n.node.id || selected.node.id === n.parent!.node.id ? '#7d88e6' : '#d9d7ea'}
                    strokeWidth={selected.node.id === n.node.id ? 2.5 : 1.5}
                    className={selected.node.id === n.node.id ? 'flow-dash' : ''}
                  />
                ))}
                {/* nodes */}
                {nodes.map((n, i) => {
                  const isSel = selected.node.id === n.node.id
                  const isRoot = !n.parent
                  const r = isRoot ? 34 : n.node.children ? 27 : 21
                  return (
                    <motion.g
                      key={n.node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, type: 'spring', stiffness: 260, damping: 18 }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(n)}
                    >
                      {isSel && <circle cx={n.x} cy={n.y} r={r + 9} fill="none" stroke="#7d88e6" strokeWidth="2" opacity="0.4" className="flow-dash" />}
                      <circle cx={n.x} cy={n.y} r={r} fill={masteryColor(n.node.mastery)} opacity={0.28} />
                      <circle cx={n.x} cy={n.y} r={r - 5} fill="white" stroke={masteryColor(n.node.mastery)} strokeWidth="2.5" />
                      <text x={n.x} y={n.y + (isRoot ? 5 : 4)} textAnchor="middle" fontSize={isRoot ? 13 : 10} fontWeight="700" fill="#34324a" fontFamily="Gabarito">
                        {n.node.mastery}%
                      </text>
                      <text x={n.x} y={n.y + r + 15} textAnchor="middle" fontSize="11" fontWeight="600" fill={isSel ? '#5a63c8' : '#5b5876'} fontFamily="Figtree">
                        {n.node.label}
                      </text>
                    </motion.g>
                  )
                })}
              </svg>
            </div>
          </Glass>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#8fd4b8]" /> Mastered (85%+)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#9cc5ee]" /> Solid (70–84%)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#f2d491]" /> Developing (60–69%)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#f0b9cf]" /> Weak (&lt;60%)</span>
          </div>
        </FadeIn>

        {/* detail panel */}
        <FadeIn delay={0.08}>
          <AnimatePresence mode="wait">
            <motion.div key={selected.node.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <Glass className="p-6">
                <Chip tone="peri"><ZoomIn size={11} /> Selected concept</Chip>
                <h2 className="mt-2.5 font-display text-xl font-extrabold text-ink">{selected.node.label}</h2>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[12px] font-bold">
                    <span className="text-muted">Mastery</span>
                    <span style={{ color: masteryColor(selected.node.mastery) }}>{selected.node.mastery}%</span>
                  </div>
                  <Bar value={selected.node.mastery} color={masteryColor(selected.node.mastery)} />
                </div>

                {selected.parent && (
                  <div className="mt-4 text-[12px] font-semibold text-muted">
                    Prerequisite path: <button onClick={() => setSelected(selected.parent!)} className="font-bold text-peri-deep hover:underline">{selected.parent.node.label}</button> → {selected.node.label}
                  </div>
                )}

                {selected.node.children && (
                  <div className="mt-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Connected concepts</div>
                    <div className="space-y-1.5">
                      {selected.node.children.map(c => {
                        const target = nodes.find(n => n.node.id === c.id)
                        return (
                          <button key={c.id} onClick={() => target && setSelected(target)} className="flex w-full items-center justify-between rounded-xl border border-line bg-white/70 px-3.5 py-2.5 text-[12.5px] font-semibold text-ink transition hover:border-peri/40 hover:bg-white">
                            {c.label}
                            <span className="font-bold" style={{ color: masteryColor(c.mastery) }}>{c.mastery}%</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-2xl bg-lilac-soft p-4 text-[12px] leading-relaxed text-[#7a63b8]">
                  <strong className="flex items-center gap-1 font-bold"><Sparkles size={12} /> Graph insight:</strong>
                  {selected.node.mastery < 65
                    ? ` “${selected.node.label}” is a weak node. The graph shows it gates ${selected.node.children?.length ?? 2} downstream concepts — remediating it first yields compounding gains.`
                    : selected.node.mastery < 85
                      ? ` You're solid on “${selected.node.label}”. One focused review session should push it to mastered and stabilize dependent skills.`
                      : ` “${selected.node.label}” is mastered — spaced review scheduled in 12 days to maintain retention above 90%.`}
                </div>
              </Glass>
            </motion.div>
          </AnimatePresence>
        </FadeIn>
      </div>
    </div>
  )
}
