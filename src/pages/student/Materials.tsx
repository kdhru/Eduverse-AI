import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UploadCloud, FileText, Presentation, BookOpen, FileType2, StickyNote, Eye, Download, Trash2, X, Sparkles, CheckCircle2 } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn } from '../../components/ui'
import { materials as seed } from '../../lib/data'

const CATS = ['All', 'Lecture Notes', 'Slides', 'Books', 'Notes', 'Previous Papers', 'Transcripts']

const typeIcon: Record<string, { icon: React.ReactNode; tone: string }> = {
  PDF: { icon: <FileText size={18} />, tone: 'bg-blush-soft text-[#c76a92]' },
  PPT: { icon: <Presentation size={18} />, tone: 'bg-butter-soft text-[#b08b2e]' },
  DOC: { icon: <FileType2 size={18} />, tone: 'bg-sky-soft text-[#4a7fb5]' },
  Book: { icon: <BookOpen size={18} />, tone: 'bg-mint-soft text-[#3d9a6e]' },
  Notes: { icon: <StickyNote size={18} />, tone: 'bg-lilac-soft text-[#7a63b8]' },
}

export default function Materials() {
  const [files, setFiles] = useState(seed)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [preview, setPreview] = useState<typeof seed[number] | null>(null)
  const [dragging, setDragging] = useState(false)
  const [justUploaded, setJustUploaded] = useState(false)

  const filtered = useMemo(
    () => files.filter(f =>
      (cat === 'All' || f.category === cat) &&
      (f.name.toLowerCase().includes(query.toLowerCase()) || f.subject.toLowerCase().includes(query.toLowerCase()))),
    [files, query, cat],
  )

  const simulateUpload = () => {
    setDragging(false)
    setJustUploaded(true)
    setFiles(f => [{ name: 'New_Upload_LectureNotes.pdf', type: 'PDF', size: '2.1 MB', category: 'Lecture Notes', subject: 'ML', uploaded: 'Just now', pages: 24, indexed: false }, ...f])
    setTimeout(() => setJustUploaded(false), 2500)
  }

  return (
    <div>
      <PageHead crumbs={['Home', 'Study Materials']} title="RAG Knowledge Center" subtitle={`${files.length} documents · ${files.filter(f => f.indexed).length} indexed in FAISS · 1,432 vector chunks`} />

      {/* uploader */}
      <FadeIn>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); simulateUpload() }}
          onClick={simulateUpload}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
            dragging ? 'scale-[1.01] border-peri bg-peri-soft/70' : 'border-line bg-white/50 hover:border-peri/50 hover:bg-white/70'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_12px_30px_-10px_rgba(125,136,230,0.8)]">
            <UploadCloud size={24} />
          </div>
          <h3 className="mt-3.5 font-display text-[16px] font-bold text-ink">Drop files to add to your knowledge base</h3>
          <p className="mt-1 text-[12.5px] text-ink-soft">PDF · PPTX · DOCX · notes · books · previous-year papers · video transcripts (max 50 MB)</p>
          <AnimatePresence>
            {justUploaded && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-1.5 rounded-full bg-mint-soft px-3.5 py-1.5 text-[12px] font-bold text-[#3d9a6e]">
                <CheckCircle2 size={13} /> Uploaded — chunking & embedding in progress…
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* search + filters */}
      <FadeIn delay={0.05}>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search files or subjects…"
              className="w-full rounded-2xl border border-line bg-white/80 py-2.5 pl-9 pr-4 text-[13px] outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition ${cat === c ? 'bg-gradient-to-r from-peri to-lilac text-white shadow' : 'bg-white/70 text-ink-soft hover:bg-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* file grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((f, i) => {
            const t = typeIcon[f.type] ?? typeIcon.PDF
            return (
              <motion.div key={f.name} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25, delay: i * 0.02 }}>
                <Glass hover className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tone}`}>{t.icon}</div>
                    {f.indexed
                      ? <Chip tone="mint"><Sparkles size={10} /> Indexed</Chip>
                      : <Chip tone="butter">Processing…</Chip>}
                  </div>
                  <h3 className="mt-3 truncate font-display text-[13.5px] font-bold text-ink" title={f.name}>{f.name}</h3>
                  <div className="mt-1 text-[11px] font-semibold text-muted">{f.subject} · {f.category} · {f.pages} pages · {f.size}</div>
                  <div className="mt-1 text-[10.5px] text-muted">Uploaded {f.uploaded}</div>
                  <div className="mt-4 flex gap-1.5">
                    <button onClick={() => setPreview(f)} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-peri-soft py-2 text-[11.5px] font-bold text-peri-deep transition hover:bg-peri/15"><Eye size={12} /> Preview</button>
                    <button className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-line bg-white/70 py-2 text-[11.5px] font-bold text-ink-soft transition hover:text-ink"><Download size={12} /> Download</button>
                    <button onClick={() => setFiles(fs => fs.filter(x => x.name !== f.name))} className="flex items-center justify-center rounded-xl border border-line bg-white/70 px-2.5 text-[#c76a92] transition hover:bg-blush-soft"><Trash2 size={13} /></button>
                  </div>
                </Glass>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm font-semibold text-muted">No documents match “{query}” in {cat}.</div>
      )}

      {/* preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
            <motion.div
              initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText size={17} className="shrink-0 text-peri" />
                  <span className="truncate font-display text-[14px] font-bold text-ink">{preview.name}</span>
                </div>
                <button onClick={() => setPreview(null)} className="rounded-full p-1.5 text-muted transition hover:bg-mist"><X size={16} /></button>
              </div>
              <div className="p-5">
                <div className="rounded-2xl bg-mist p-5">
                  <div className="mx-auto w-full max-w-xs rounded-xl bg-white p-5 shadow-md">
                    <div className="skeleton mb-3 h-3.5 w-3/4 rounded" />
                    <div className="skeleton mb-2 h-2.5 w-full rounded" />
                    <div className="skeleton mb-2 h-2.5 w-full rounded" />
                    <div className="skeleton mb-2 h-2.5 w-5/6 rounded" />
                    <div className="skeleton mb-4 h-2.5 w-2/3 rounded" />
                    <div className="skeleton mb-2 h-20 w-full rounded-lg" />
                    <div className="skeleton h-2.5 w-4/5 rounded" />
                  </div>
                  <div className="mt-3 text-center text-[11px] font-semibold text-muted">Page 1 of {preview.pages} · rendered preview</div>
                </div>
                <div className="mt-4 rounded-2xl bg-peri-soft p-4 text-[12px] leading-relaxed text-peri-deep">
                  <strong className="flex items-center gap-1 font-bold"><Sparkles size={12} /> AI summary:</strong>
                  This document covers {preview.subject === 'ML' ? 'gradient descent, backpropagation derivation, and vanishing-gradient mitigation strategies' : preview.subject === 'DSA' ? 'memoization, tabulation, and classic DP formulations including knapsack and LCS' : 'core concepts with worked examples and end-of-chapter exercises'}. {preview.indexed ? 'Fully indexed — the Tutor Agent can cite it.' : 'Indexing in progress.'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
