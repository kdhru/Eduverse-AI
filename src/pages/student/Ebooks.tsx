import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, UploadCloud, Sparkles, ListChecks, ChevronLeft, ChevronRight, CheckCircle2,
  Coins, FileText, Search, Trash2, BookMarked, Wand2, ArrowLeft, XCircle, RotateCcw, Play, Clock3,
} from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar, Ring } from '../../components/ui'
import { usePoints } from '../../lib/points'

// ---------------- types & seed data ----------------
type EbookQuiz = { question: string; options: string[]; answer: number; explanation: string }
type Chapter = { title: string; minutes: number; content: string[] }
type Ebook = {
  id: string
  title: string
  author: string
  format: string
  size: string
  cover: string        // emoji
  color: string
  category: string
  uploaded: string
  chapters: Chapter[]
  summary: { overview: string; keyPoints: string[]; concepts: string[] }
  quiz: EbookQuiz[]
}

const SEED_BOOKS: Ebook[] = [
  {
    id: 'clean-python',
    title: 'Clean Code in Python',
    author: 'M. Anaya',
    format: 'PDF', size: '6.4 MB', cover: '🐍', color: '#7d88e6', category: 'Programming', uploaded: 'Jan 15',
    chapters: [
      {
        title: 'Introduction: Code Quality & Pythonic Thinking', minutes: 12,
        content: [
          'Clean code is not about aesthetics — it is about reducing the cost of change. Every line you write will be read many more times than it is written, so optimizing for readability is optimizing for velocity.',
          'Pythonic code embraces the language\'s idioms: iteration protocols instead of index juggling, context managers instead of manual cleanup, and comprehensions where they clarify — never where they obscure.',
          'The chapter closes with a practical rule: if you need a comment to explain WHAT a block does, extract it into a well-named function. Comments should explain WHY, never WHAT.',
        ],
      },
      {
        title: 'Decorators & Descriptors', minutes: 18,
        content: [
          'A decorator is simply a callable that takes a callable and returns a callable. This chapter demystifies the @ syntax by showing that @timer above a function is exactly equivalent to func = timer(func).',
          'Descriptors power almost everything magical in Python — properties, methods, classmethod, staticmethod. A class implementing __get__, __set__ or __delete__ participates in attribute lookup.',
          'Best practice: use functools.wraps in every decorator you write to preserve the wrapped function\'s metadata, and prefer class-based decorators when you need to hold state.',
        ],
      },
      {
        title: 'SOLID Principles in Python', minutes: 22,
        content: [
          'Single Responsibility does not mean "does one thing" — it means "has one reason to change". A class serving two stakeholders will eventually be torn in two directions.',
          'The chapter reframes Dependency Inversion for a duck-typed language: depend on protocols (structural typing via typing.Protocol) rather than concrete classes, and inject collaborators through constructors.',
          'Liskov violations in Python usually appear as isinstance checks scattered through the codebase — a smell that the hierarchy is lying about substitutability.',
        ],
      },
      {
        title: 'Unit Testing & Refactoring', minutes: 16,
        content: [
          'Tests are the executable specification of your design. The chapter advocates the Arrange-Act-Assert structure and one behavioural assertion per test.',
          'Mock at architectural boundaries only — mocking internals welds your tests to the implementation and makes refactoring painful instead of safe.',
          'Refactoring without tests is just changing stuff. The safe loop is: cover the seam, make the smallest transformation, run the suite, commit.',
        ],
      },
    ],
    summary: {
      overview: 'A practitioner\'s guide to writing Python that survives contact with real teams. The book argues that clean code is an economic decision: readable, well-factored modules reduce the cost of every future change. It moves from idioms (iteration protocols, context managers) through advanced mechanics (decorators, descriptors) to design principles (SOLID adapted for duck typing) and finishes with a testing-first refactoring discipline.',
      keyPoints: [
        'Optimize for readability — code is read 10× more than it is written',
        'Decorators are just callables returning callables; always use functools.wraps',
        'Depend on Protocols, not concrete classes (Pythonic Dependency Inversion)',
        'Single Responsibility = one reason to change, not one function',
        'Mock only at architecture boundaries; test behaviour, not implementation',
      ],
      concepts: ['Iteration protocol', 'Context managers', 'Descriptors', 'typing.Protocol', 'Arrange-Act-Assert', 'Seams & refactoring'],
    },
    quiz: [
      { question: 'According to the book, comments should primarily explain…', options: ['What the code does', 'Why the code exists', 'Who wrote the code', 'When the code was written'], answer: 1, explanation: 'If a comment explains WHAT, extract a well-named function instead. Comments earn their keep by capturing intent and trade-offs — the WHY.' },
      { question: 'A decorator in Python is best described as…', options: ['A special compiler directive', 'A callable that takes and returns a callable', 'A subclass of function', 'A macro expanded at import time'], answer: 1, explanation: '@timer above a function is exactly func = timer(func) — plain higher-order functions, no magic.' },
      { question: 'The book\'s reading of Single Responsibility is that a class should have…', options: ['Exactly one method', 'One reason to change', 'No dependencies', 'Fewer than 100 lines'], answer: 1, explanation: 'SRP is about change pressure from stakeholders, not method counts. Two masters ⇒ two future directions of change ⇒ split.' },
      { question: 'Where does the book say you should place mocks?', options: ['Around every function call', 'At architectural boundaries only', 'Never — mocks are banned', 'Only in integration tests'], answer: 1, explanation: 'Mocking internals couples tests to implementation. Boundary mocks keep refactoring safe while isolating external systems.' },
      { question: 'Which mechanism powers properties, methods and classmethod under the hood?', options: ['Metaclasses', 'Descriptors', 'Closures', 'Slots'], answer: 1, explanation: 'Objects defining __get__/__set__/__delete__ participate in attribute lookup — that protocol is the descriptor protocol.' },
    ],
  },
  {
    id: 'grokking-algos',
    title: 'Grokking Algorithms',
    author: 'A. Bhargava',
    format: 'EPUB', size: '11.2 MB', cover: '🧮', color: '#ab96e0', category: 'Algorithms', uploaded: 'Jan 12',
    chapters: [
      {
        title: 'Big O & Binary Search', minutes: 14,
        content: [
          'Big O describes how an algorithm\'s work grows with input size — it counts operations, not seconds. O(log n) binary search on a billion items needs at most ~30 steps.',
          'Binary search demands a sorted collection: repeatedly halve the search space by comparing against the middle element.',
          'The chapter\'s core intuition: algorithm speed is measured in growth of operations, and constants are ignored because growth dominates at scale.',
        ],
      },
      {
        title: 'Recursion & Divide-and-Conquer', minutes: 17,
        content: [
          'Every recursive function has two parts: the base case (when to stop) and the recursive case (how to shrink the problem). Forgetting the base case gives infinite loops.',
          'Divide-and-conquer solves problems by reducing them to smaller instances of themselves — quicksort partitions around a pivot then sorts each side.',
          'The call stack is the hidden data structure of recursion: every call pushes a frame, which is why deep recursion can be memory-hungry.',
        ],
      },
      {
        title: 'Hash Tables', minutes: 13,
        content: [
          'Hash tables map keys to array slots through a hash function, giving O(1) average lookups, inserts and deletes — the closest thing to magic in data structures.',
          'Collisions are inevitable (pigeonhole principle); chaining with linked lists is the classic resolution. A good hash function distributes keys evenly.',
          'Load factor above ~0.7 means it\'s time to resize. Real-world uses: caches, deduplication, DNS resolution.',
        ],
      },
      {
        title: 'Graphs, BFS & Dijkstra', minutes: 21,
        content: [
          'Breadth-first search answers two questions: is there a path, and what is the shortest path in unweighted graphs. It explores neighbours level by level using a queue.',
          'Dijkstra\'s algorithm extends shortest-path to weighted graphs — always expand the cheapest known node. It fails with negative edge weights (use Bellman-Ford there).',
          'Model relationships as graphs everywhere: social networks, package dependencies, currency exchange — then shortest-path becomes a universal hammer.',
        ],
      },
      {
        title: 'Dynamic Programming & Greedy', minutes: 19,
        content: [
          'Greedy algorithms pick the locally best move at each step — sometimes optimal (scheduling), sometimes just a good approximation (set cover, NP-complete problems).',
          'Dynamic programming solves problems with overlapping subproblems by filling a grid — the knapsack chapter builds the table cell by cell to maximize value under a weight budget.',
          'The DP recipe: define the grid axes, express each cell in terms of previous cells, and the answer is usually the last cell.',
        ],
      },
    ],
    summary: {
      overview: 'An illustrated, intuition-first tour of the algorithms every developer actually uses. Rather than proofs, it builds mental models: binary search as halving, recursion as a call stack, hash tables as magic arrays, BFS as ripples in a pond, Dijkstra as always expanding the cheapest frontier, and dynamic programming as filling a grid. Each concept is anchored to a real use case, from caching to route planning.',
      keyPoints: [
        'Big O counts growth of operations, not wall-clock seconds',
        'Every recursion = base case + recursive case (+ hidden call stack)',
        'Hash tables give O(1) average operations; watch the load factor',
        'BFS finds shortest unweighted paths; Dijkstra handles weights (no negatives)',
        'DP = grid of subproblems; greedy = locally best, sometimes globally wrong',
      ],
      concepts: ['Big O', 'Binary search', 'Call stack', 'Hash collisions', 'BFS / queues', 'Dijkstra', 'Knapsack DP', 'NP-completeness'],
    },
    quiz: [
      { question: 'Binary search on 1,000,000,000 sorted items takes at most about…', options: ['1,000 steps', '30 steps', '1,000,000 steps', '100 steps'], answer: 1, explanation: 'log₂(10⁹) ≈ 30 — each comparison halves the remaining search space.' },
      { question: 'What are the two required parts of every recursive function?', options: ['Loop and counter', 'Base case and recursive case', 'Input and output', 'Stack and heap'], answer: 1, explanation: 'The base case stops the recursion; the recursive case shrinks the problem toward it.' },
      { question: 'Average-case lookup in a well-behaved hash table is…', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answer: 2, explanation: 'The hash function jumps straight to the slot — constant time on average, degrading only with heavy collisions.' },
      { question: 'Dijkstra\'s algorithm fails when the graph has…', options: ['Cycles', 'Negative edge weights', 'More than 1000 nodes', 'Unsorted vertices'], answer: 1, explanation: 'Negative edges can make an already-finalized node improvable — Bellman-Ford handles that case.' },
      { question: 'The dynamic programming chapter solves knapsack by…', options: ['Sorting items by value', 'Filling a grid of subproblems', 'Random sampling', 'Binary searching capacities'], answer: 1, explanation: 'Each cell = best value for a sub-capacity and item subset, built from previously computed cells.' },
    ],
  },
  {
    id: 'ml-basics',
    title: 'Make Your Own Neural Network',
    author: 'T. Rashid',
    format: 'PDF', size: '4.8 MB', cover: '🧠', color: '#8fd4b8', category: 'Machine Learning', uploaded: 'Jan 8',
    chapters: [
      {
        title: 'How Neural Networks Learn', minutes: 15,
        content: [
          'A neural network is layers of simple nodes, each applying a weighted sum followed by a squashing function (sigmoid). Intelligence emerges from many simple parts, not clever nodes.',
          'Learning means adjusting weights to reduce error. The error at the output is known; the trick is deciding how much each earlier weight is to blame.',
          'The moderation idea: signals are combined, squashed, and passed forward — the sigmoid keeps values in a workable range and provides the smooth gradients learning needs.',
        ],
      },
      {
        title: 'Backpropagation, Gently', minutes: 20,
        content: [
          'Backpropagation splits output error among incoming links in proportion to their weights — stronger links carry more blame. This is just the chain rule wearing friendly clothes.',
          'Gradient descent walks downhill on the error surface: compute the slope with respect to each weight, then nudge weights a small step (the learning rate) against the slope.',
          'Too large a learning rate overshoots the valley; too small crawls. The chapter tunes it experimentally on MNIST digits.',
        ],
      },
      {
        title: 'Building It in Python', minutes: 24,
        content: [
          'The full network is ~150 lines of Python + numpy: an __init__ that builds weight matrices, a train() implementing forward pass + backprop, and a query() for inference.',
          'Weight initialization matters: sampling from a normal distribution scaled by 1/√(incoming links) keeps early signals in the sigmoid\'s sensitive zone.',
          'Trained on MNIST, this tiny network reaches ~97% accuracy — the chapter\'s point is that the core of deep learning fits in your head.',
        ],
      },
    ],
    summary: {
      overview: 'A gentle, first-principles construction of a working neural network, ending in ~150 lines of Python that hit 97% on MNIST. The book\'s gift is intuition: weighted sums as votes, sigmoid as moderation, backpropagation as splitting blame proportionally to link strength, and gradient descent as walking downhill in fog. Math appears only after the ideas are already obvious.',
      keyPoints: [
        'Networks are simple nodes: weighted sum → sigmoid → forward',
        'Backprop = distributing output error backwards in proportion to weights',
        'Gradient descent: step against the slope; learning rate sets the stride',
        'Initialize weights ~ N(0, 1/√fan-in) to keep sigmoids sensitive',
        'A 3-layer network in numpy reaches ~97% on MNIST',
      ],
      concepts: ['Sigmoid activation', 'Weight matrices', 'Chain rule', 'Learning rate', 'MNIST', 'Weight initialization'],
    },
    quiz: [
      { question: 'In the book\'s model, backpropagation splits error among links according to…', options: ['Link age', 'Link weight (strength)', 'Random assignment', 'Node depth'], answer: 1, explanation: 'Stronger links contributed more to the output, so they receive proportionally more of the blame.' },
      { question: 'A learning rate that is too large causes…', options: ['Slow crawling', 'Overshooting the error minimum', 'Perfect convergence', 'Weight decay'], answer: 1, explanation: 'Big steps bounce across the valley instead of settling into it — training oscillates or diverges.' },
      { question: 'The recommended weight initialization samples from a distribution scaled by…', options: ['1/√(incoming links)', 'The number of epochs', 'The output error', 'π/4'], answer: 0, explanation: 'Scaling by 1/√fan-in keeps initial signals inside the sigmoid\'s sensitive region, so gradients stay useful.' },
      { question: 'The complete working network in the book reaches roughly what MNIST accuracy?', options: ['67%', '82%', '97%', '99.9%'], answer: 2, explanation: 'About 97% with a simple 3-layer numpy network — the point being that the essence of deep learning is small.' },
    ],
  },
]

// generic content for user-uploaded books
const GENERIC_UPLOAD = (name: string): Ebook => ({
  id: `upload-${Date.now()}`,
  title: name.replace(/\.(pdf|epub|docx?|mobi)$/i, '').replace(/[_-]/g, ' '),
  author: 'Uploaded by you',
  format: name.split('.').pop()?.toUpperCase() ?? 'PDF',
  size: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
  cover: '📕', color: '#f0b9cf', category: 'My Uploads', uploaded: 'Just now',
  chapters: [
    { title: 'Chapter 1 — Foundations', minutes: 14, content: ['The RAG engine has chunked and indexed this chapter. Key definitions and framing concepts were detected and linked to your knowledge graph.', 'As you read, the Tutor Agent can answer questions grounded in this exact text — try asking it to explain any paragraph.', 'Mark the chapter complete when done to earn points and update your mastery model.'] },
    { title: 'Chapter 2 — Core Concepts', minutes: 18, content: ['This chapter contains the densest concept cluster in the book (detected via embedding similarity). The AI recommends slowing down here.', 'Highlighted terms have been cross-referenced with your course materials — 4 concepts overlap with your current syllabus.', 'A targeted quiz for this chapter is available in the Quiz tab.'] },
    { title: 'Chapter 3 — Applications & Practice', minutes: 16, content: ['Worked examples in this chapter map to 6 practice problems the Quiz Agent generated automatically.', 'The Performance Agent will track which examples you linger on to refine your weak-topic detection.', 'Finish this chapter to unlock the full-book summary and final quiz.'] },
  ],
  summary: {
    overview: 'AI-generated summary: this uploaded book was chunked into 142 passages, embedded with bge-large, and indexed into your personal FAISS store. The three detected sections move from foundational definitions through core mechanisms to applied practice. Nine key concepts were extracted and linked to your existing knowledge graph, with four overlapping your current semester syllabus.',
    keyPoints: [
      'The book follows a foundations → mechanisms → applications arc',
      '9 key concepts extracted; 4 overlap with your current courses',
      'Densest concept cluster detected in Chapter 2 — read slowly there',
      '6 practice problems were auto-generated from worked examples',
      'Full text is now citable by your AI Tutor with page references',
    ],
    concepts: ['Auto-extracted concept 1', 'Auto-extracted concept 2', 'Cross-referenced syllabus topics', 'Generated practice set'],
  },
  quiz: [
    { question: 'Based on the indexed structure, this book\'s chapters move from…', options: ['Applications to theory', 'Foundations to applications', 'Random topics', 'Exercises to definitions'], answer: 1, explanation: 'The RAG analysis detected a foundations → core concepts → applications arc across the three sections.' },
    { question: 'How many extracted concepts overlap with your current syllabus?', options: ['0', '2', '4', '9'], answer: 2, explanation: 'Four of the nine extracted concepts matched nodes already present in your semester knowledge graph.' },
    { question: 'Which chapter did the AI flag as the densest and recommend reading slowly?', options: ['Chapter 1', 'Chapter 2', 'Chapter 3', 'None'], answer: 1, explanation: 'Embedding-similarity analysis found the tightest concept cluster in Chapter 2.' },
    { question: 'What becomes possible after a book is indexed into your FAISS store?', options: ['Nothing changes', 'The AI Tutor can cite it in answers', 'The book is shared publicly', 'It replaces your course materials'], answer: 1, explanation: 'Indexed passages are retrievable at question time, so tutor answers are grounded in this exact text with references.' },
  ],
})

// ---------------- component ----------------
type Tab = 'read' | 'summary' | 'quiz'

export default function Ebooks() {
  const [books, setBooks] = useState<Ebook[]>(SEED_BOOKS)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Ebook | null>(null)
  const [tab, setTab] = useState<Tab>('read')
  const [chapterIdx, setChapterIdx] = useState(0)
  const [readChapters, setReadChapters] = useState<Record<string, number[]>>({ 'clean-python': [0, 1], 'grokking-algos': [0], 'ml-basics': [] })
  const [summaryReady, setSummaryReady] = useState<Record<string, boolean>>({})
  const [summarizing, setSummarizing] = useState(false)
  const [dragging, setDragging] = useState(false)
  // quiz state
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizPicked, setQuizPicked] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizDone, setQuizDone] = useState(false)
  const [quizEarned, setQuizEarned] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const { addPoints } = usePoints()

  const progressOf = (b: Ebook) => Math.round(((readChapters[b.id]?.length ?? 0) / b.chapters.length) * 100)

  const upload = (name?: string) => {
    const book = GENERIC_UPLOAD(name ?? 'My_Custom_eBook.pdf')
    setBooks(bs => [book, ...bs])
    addPoints(15, 'eBook uploaded & indexed')
  }

  const openBook = (b: Ebook, t: Tab = 'read') => {
    setSelected(b)
    setTab(t)
    setChapterIdx(0)
    resetQuiz()
  }

  const resetQuiz = () => { setQuizIdx(0); setQuizPicked(null); setQuizAnswers([]); setQuizDone(false); setQuizEarned(0) }

  const markChapterRead = () => {
    if (!selected) return
    const done = readChapters[selected.id] ?? []
    if (done.includes(chapterIdx)) return
    setReadChapters(rc => ({ ...rc, [selected.id]: [...done, chapterIdx] }))
    addPoints(20, `Chapter completed · ${selected.title}`)
  }

  const generateSummary = () => {
    if (!selected || summaryReady[selected.id]) return
    setSummarizing(true)
    setTimeout(() => {
      setSummaryReady(s => ({ ...s, [selected.id]: true }))
      setSummarizing(false)
      addPoints(10, 'Book summarized with AI')
    }, 1800)
  }

  const answerQuiz = (i: number) => {
    if (quizPicked !== null || !selected) return
    setQuizPicked(i)
    setTimeout(() => {
      const nextAnswers = [...quizAnswers, i]
      setQuizAnswers(nextAnswers)
      setQuizPicked(null)
      if (quizIdx < selected.quiz.length - 1) {
        setQuizIdx(q => q + 1)
      } else {
        const correct = selected.quiz.filter((q, k) => nextAnswers[k] === q.answer).length
        const pts = correct * 10 + 25
        setQuizEarned(pts)
        setQuizDone(true)
        addPoints(pts, `Book quiz · ${correct}/${selected.quiz.length} correct`)
      }
    }, 1400)
  }

  const filtered = books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.category.toLowerCase().includes(query.toLowerCase()))

  // =============== DETAIL / LEARNING VIEW ===============
  if (selected) {
    const done = readChapters[selected.id] ?? []
    const chapter = selected.chapters[chapterIdx]
    const bookProgress = progressOf(selected)
    const hasSummary = !!summaryReady[selected.id]

    return (
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 rounded-xl border border-line bg-white/80 px-3.5 py-2 text-[12.5px] font-bold text-ink-soft transition hover:text-peri-deep">
            <ArrowLeft size={14} /> Back to library
          </button>
          <div className="flex items-center gap-2">
            <Chip tone="ink">{selected.format} · {selected.size}</Chip>
            <Chip tone={bookProgress === 100 ? 'mint' : 'peri'}>{bookProgress}% learned</Chip>
          </div>
        </div>

        <FadeIn>
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-3xl p-5" style={{ background: `linear-gradient(120deg, ${selected.color}26, ${selected.color}0d)` }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl shadow-sm" style={{ background: `${selected.color}30` }}>{selected.cover}</div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-extrabold text-ink md:text-2xl">{selected.title}</h1>
              <div className="text-[12.5px] font-semibold text-ink-soft">{selected.author} · {selected.category} · {selected.chapters.length} chapters · {selected.chapters.reduce((a, c) => a + c.minutes, 0)} min total</div>
              <div className="mt-2 max-w-md"><Bar value={bookProgress} color={selected.color} /></div>
            </div>
          </div>
        </FadeIn>

        {/* tabs */}
        <div className="mb-5 flex gap-1.5 rounded-2xl bg-white/70 p-1.5">
          {([
            ['read', <BookOpen size={14} key="r" />, 'Read'],
            ['summary', <Wand2 size={14} key="s" />, 'AI Summary'],
            ['quiz', <ListChecks size={14} key="q" />, 'Book Quiz'],
          ] as const).map(([t, icon, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === 'quiz') resetQuiz() }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition ${
                tab === t ? 'bg-gradient-to-r from-peri to-lilac text-white shadow' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---------- READ TAB ---------- */}
          {tab === 'read' && (
            <motion.div key="read" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-5 lg:grid-cols-3">
                {/* chapter list */}
                <Glass className="h-fit p-5">
                  <h3 className="mb-3 font-display text-[14px] font-bold text-ink">Chapters</h3>
                  <div className="space-y-1.5">
                    {selected.chapters.map((c, i) => (
                      <button
                        key={c.title}
                        onClick={() => setChapterIdx(i)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                          i === chapterIdx ? 'bg-peri-soft text-peri-deep' : 'text-ink-soft hover:bg-white/70'
                        }`}
                      >
                        {done.includes(i)
                          ? <CheckCircle2 size={15} className="shrink-0 text-[#3d9a6e]" />
                          : <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-line text-[8px] font-bold">{i + 1}</span>}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-bold">{c.title}</span>
                          <span className="text-[10px] font-semibold text-muted">{c.minutes} min read</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-lilac-soft p-3.5 text-[11px] leading-relaxed text-[#7a63b8]">
                    <strong className="font-bold">RAG indexed:</strong> ask the AI Tutor anything about this book — answers cite exact passages.
                  </div>
                </Glass>

                {/* reader */}
                <Glass className="p-6 lg:col-span-2 md:p-8">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted">Chapter {chapterIdx + 1} of {selected.chapters.length} · <Clock3 size={10} className="inline" /> {chapter.minutes} min</div>
                  <h2 className="font-display text-xl font-extrabold text-ink">{chapter.title}</h2>
                  <div className="mt-5 space-y-4">
                    {chapter.content.map((p, i) => (
                      <p key={i} className="text-[14px] leading-[1.85] text-ink-soft first-letter:text-lg first-letter:font-bold first-letter:text-ink">{p}</p>
                    ))}
                  </div>

                  <div className="mt-7 border-t border-line/70 pt-5">
                    <button
                      onClick={markChapterRead}
                      disabled={done.includes(chapterIdx)}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[13.5px] font-bold transition ${
                        done.includes(chapterIdx)
                          ? 'cursor-default bg-mint-soft text-[#3d9a6e]'
                          : 'bg-gradient-to-r from-[#e8c76a] to-[#d9a53a] text-white shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {done.includes(chapterIdx)
                        ? <><CheckCircle2 size={16} /> Chapter completed · +20 pts earned</>
                        : <><Coins size={16} /> Mark chapter complete · earn +20 pts</>}
                    </button>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => setChapterIdx(i => Math.max(0, i - 1))}
                        disabled={chapterIdx === 0}
                        className="flex items-center gap-1 rounded-xl border border-line bg-white/70 px-4 py-2 text-[12.5px] font-bold text-ink-soft transition enabled:hover:text-peri-deep disabled:opacity-40"
                      >
                        <ChevronLeft size={14} /> Previous
                      </button>
                      {chapterIdx === selected.chapters.length - 1 ? (
                        <button onClick={() => setTab('quiz')} className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2 text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5">
                          Take the book quiz <ListChecks size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setChapterIdx(i => Math.min(selected.chapters.length - 1, i + 1))}
                          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2 text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5"
                        >
                          Next chapter <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </Glass>
              </div>
            </motion.div>
          )}

          {/* ---------- SUMMARY TAB ---------- */}
          {tab === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {!hasSummary ? (
                <Glass className="mx-auto max-w-2xl p-10 text-center">
                  {summarizing ? (
                    <>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-peri to-lilac text-white shadow-lg">
                        <Sparkles size={26} className="animate-spin [animation-duration:2.5s]" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-extrabold text-ink">Summarizing “{selected.title}”…</h3>
                      <p className="mt-1.5 text-[13px] text-ink-soft">Retrieving all {selected.chapters.length} chapters → extracting key concepts → compressing with Llama 3</p>
                      <div className="mx-auto mt-6 max-w-sm space-y-2.5">
                        <div className="skeleton h-3 w-full rounded-full" />
                        <div className="skeleton h-3 w-5/6 rounded-full" />
                        <div className="skeleton h-3 w-4/6 rounded-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-lilac-soft text-[#7a63b8]"><Wand2 size={26} /></div>
                      <h3 className="mt-4 font-display text-lg font-extrabold text-ink">Generate an AI summary of this book</h3>
                      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-soft">
                        The Tutor Agent will read all {selected.chapters.length} chapters, extract the key concepts, and produce a structured summary with study points — grounded entirely in this book's text.
                      </p>
                      <button onClick={generateSummary} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5">
                        <Sparkles size={15} /> Summarize with AI · +10 pts
                      </button>
                    </>
                  )}
                </Glass>
              ) : (
                <div className="grid gap-5 lg:grid-cols-3">
                  <Glass className="p-6 lg:col-span-2">
                    <Chip tone="lilac" className="mb-3"><Sparkles size={11} /> AI-generated · grounded in book text</Chip>
                    <h3 className="font-display text-lg font-extrabold text-ink">Book overview</h3>
                    <p className="mt-3 text-[13.5px] leading-[1.85] text-ink-soft">{selected.summary.overview}</p>
                    <h4 className="mt-6 font-display text-[15px] font-bold text-ink">Key takeaways</h4>
                    <ul className="mt-3 space-y-2.5">
                      {selected.summary.keyPoints.map((k, i) => (
                        <motion.li key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-peri-soft text-[10px] font-extrabold text-peri-deep">{i + 1}</span>
                          {k}
                        </motion.li>
                      ))}
                    </ul>
                  </Glass>
                  <div className="space-y-5">
                    <Glass className="p-6">
                      <h4 className="font-display text-[14px] font-bold text-ink">Extracted concepts</h4>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selected.summary.concepts.map(c => <Chip key={c} tone="sky">{c}</Chip>)}
                      </div>
                      <div className="mt-4 rounded-2xl bg-mint-soft p-3.5 text-[11.5px] leading-relaxed text-[#3d9a6e]">
                        These concepts were linked into your knowledge graph — mastery updates as you quiz on them.
                      </div>
                    </Glass>
                    <Glass className="p-6 text-center">
                      <h4 className="font-display text-[14px] font-bold text-ink">Ready to test yourself?</h4>
                      <p className="mt-1.5 text-[12px] text-ink-soft">{selected.quiz.length} questions generated from this book.</p>
                      <button onClick={() => { setTab('quiz'); resetQuiz() }} className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac py-2.5 text-[13px] font-bold text-white shadow transition hover:-translate-y-0.5">
                        <ListChecks size={14} /> Take the book quiz
                      </button>
                    </Glass>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ---------- QUIZ TAB ---------- */}
          {tab === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {!quizDone ? (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <Chip tone="lilac">Question {quizIdx + 1} of {selected.quiz.length}</Chip>
                    <Chip tone="butter"><Coins size={11} /> +10 per correct · +25 finish bonus</Chip>
                  </div>
                  <Bar value={(quizIdx / selected.quiz.length) * 100} color="#ab96e0" className="mb-5 !h-1.5" />
                  <AnimatePresence mode="wait">
                    <motion.div key={quizIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                      <Glass className="p-7">
                        <Chip tone="sky" className="mb-3"><BookMarked size={11} /> Generated from “{selected.title}”</Chip>
                        <h2 className="font-display text-lg font-bold leading-snug text-ink">{selected.quiz[quizIdx].question}</h2>
                        <div className="mt-5 space-y-2.5">
                          {selected.quiz[quizIdx].options.map((o, i) => {
                            const isPicked = quizPicked === i
                            const isCorrect = i === selected.quiz[quizIdx].answer
                            const revealed = quizPicked !== null
                            return (
                              <button
                                key={o}
                                onClick={() => answerQuiz(i)}
                                disabled={revealed}
                                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[13.5px] font-semibold transition-all ${
                                  revealed && isCorrect
                                    ? 'border-[#8fd4b8] bg-mint-soft text-[#3d9a6e]'
                                    : revealed && isPicked && !isCorrect
                                      ? 'border-[#f0b9cf] bg-blush-soft text-[#c76a92]'
                                      : revealed
                                        ? 'border-line bg-white/50 text-muted'
                                        : 'border-line bg-white/70 text-ink-soft hover:border-peri/40 hover:bg-white'
                                }`}
                              >
                                {revealed && isCorrect ? <CheckCircle2 size={17} className="shrink-0" />
                                  : revealed && isPicked ? <XCircle size={17} className="shrink-0" />
                                  : <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-line text-[9px] font-bold">{String.fromCharCode(65 + i)}</span>}
                                {o}
                              </button>
                            )
                          })}
                        </div>
                        <AnimatePresence>
                          {quizPicked !== null && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                              <div className="mt-4 rounded-2xl bg-peri-soft p-4 text-[12.5px] leading-relaxed text-peri-deep">
                                <strong className="font-bold">Explanation: </strong>{selected.quiz[quizIdx].explanation}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Glass>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <FadeIn>
                  <Glass className="mx-auto max-w-lg p-8 text-center">
                    {(() => {
                      const correct = selected.quiz.filter((q, k) => quizAnswers[k] === q.answer).length
                      const score = Math.round((correct / selected.quiz.length) * 100)
                      return (
                        <>
                          <Ring value={score} size={120} stroke={10} color={score >= 70 ? '#8fd4b8' : score >= 40 ? '#f2d491' : '#f0b9cf'} sub="book mastery" />
                          <h3 className="mt-4 font-display text-xl font-extrabold text-ink">
                            {score === 100 ? 'Book fully mastered! 🏆' : score >= 70 ? 'Great understanding! 🎉' : 'Re-read & retry! 🌱'}
                          </h3>
                          <p className="mt-1.5 text-[13px] text-ink-soft">{correct} of {selected.quiz.length} correct on “{selected.title}”</p>
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.3 }}
                            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-butter-soft to-[#fbeecb] py-3 shadow-[inset_0_0_0_1px_rgba(232,185,79,0.35)]"
                          >
                            <Coins size={17} className="text-[#d9a53a]" />
                            <span className="font-display text-lg font-extrabold text-[#b08b2e]">+{quizEarned} points earned</span>
                          </motion.div>
                          {score < 100 && (
                            <div className="mt-4 rounded-2xl bg-lilac-soft p-4 text-left text-[12px] leading-relaxed text-[#7a63b8]">
                              <strong className="flex items-center gap-1 font-bold"><Sparkles size={12} /> AI recommendation:</strong>
                              Re-read the chapters covering the questions you missed, then retake — mastery updates on your best attempt.
                            </div>
                          )}
                          <div className="mt-5 flex gap-2">
                            <button onClick={resetQuiz} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-white/70 py-2.5 text-[12.5px] font-bold text-ink-soft transition hover:text-peri-deep">
                              <RotateCcw size={13} /> Retake quiz
                            </button>
                            <button onClick={() => setTab('read')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac py-2.5 text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5">
                              <BookOpen size={13} /> Back to reading
                            </button>
                          </div>
                        </>
                      )
                    })()}
                  </Glass>
                </FadeIn>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // =============== LIBRARY VIEW ===============
  return (
    <div>
      <PageHead
        crumbs={['Home', 'My eBooks']}
        title="eBook Learning Hub"
        subtitle="Upload any book · read it · summarize it with AI · quiz yourself until it's fully learned"
        actions={
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5">
            <UploadCloud size={14} /> Upload eBook
          </button>
        }
      />
      <input ref={fileRef} type="file" accept=".pdf,.epub,.doc,.docx,.mobi" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f.name); e.target.value = '' }} />

      {/* upload zone */}
      <FadeIn>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files?.[0]?.name) }}
          onClick={() => fileRef.current?.click()}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
            dragging ? 'scale-[1.01] border-peri bg-peri-soft/70' : 'border-line bg-white/50 hover:border-peri/50 hover:bg-white/70'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_12px_30px_-10px_rgba(125,136,230,0.8)]">
            <BookMarked size={24} />
          </div>
          <h3 className="mt-3.5 font-display text-[16px] font-bold text-ink">Drop your eBook here to start learning from it</h3>
          <p className="mt-1 text-[12.5px] text-ink-soft">PDF · EPUB · DOCX · MOBI — the AI chunks, indexes and builds chapters, summaries & quizzes automatically · <span className="font-bold text-[#b08b2e]">+15 pts per upload</span></p>
        </div>
      </FadeIn>

      {/* pipeline strip */}
      <FadeIn delay={0.05}>
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {[
            { icon: <UploadCloud size={16} />, t: '1 · Upload', d: 'Any book or document', tone: 'bg-peri-soft text-peri-deep' },
            { icon: <BookOpen size={16} />, t: '2 · Read', d: 'Chapter-by-chapter, +20 pts each', tone: 'bg-sky-soft text-[#4a7fb5]' },
            { icon: <Wand2 size={16} />, t: '3 · Summarize', d: 'AI key points & concepts', tone: 'bg-lilac-soft text-[#7a63b8]' },
            { icon: <ListChecks size={16} />, t: '4 · Quiz', d: 'Prove mastery, earn points', tone: 'bg-mint-soft text-[#3d9a6e]' },
          ].map(s => (
            <div key={s.t} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-white/70 p-3.5">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
              <div><div className="text-[12px] font-bold text-ink">{s.t}</div><div className="text-[10.5px] font-semibold text-muted">{s.d}</div></div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* search */}
      <FadeIn delay={0.08}>
        <div className="relative mb-5 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search your library…"
            className="w-full rounded-2xl border border-line bg-white/80 py-2.5 pl-9 pr-4 text-[13px] outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
          />
        </div>
      </FadeIn>

      {/* book grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map(b => {
            const p = progressOf(b)
            return (
              <motion.div key={b.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25 }}>
                <Glass hover className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: `${b.color}22` }}>{b.cover}</div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Chip tone="ink"><FileText size={10} /> {b.format} · {b.size}</Chip>
                      {p === 100 && <Chip tone="mint"><CheckCircle2 size={10} /> Fully learned</Chip>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-[10.5px] font-bold tracking-wide text-muted">{b.category.toUpperCase()} · {b.uploaded}</div>
                    <h3 className="mt-0.5 font-display text-[16px] font-bold leading-snug text-ink">{b.title}</h3>
                    <div className="text-[12px] font-semibold text-ink-soft">{b.author}</div>
                  </div>
                  <div className="mt-3.5">
                    <div className="mb-1.5 flex justify-between text-[11px] font-bold">
                      <span className="text-muted">{readChapters[b.id]?.length ?? 0}/{b.chapters.length} chapters read</span>
                      <span style={{ color: b.color }}>{p}%</span>
                    </div>
                    <Bar value={p} color={b.color} />
                  </div>
                  <div className="mt-auto space-y-2 pt-4">
                    <button onClick={() => openBook(b, 'read')} className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold text-white shadow transition hover:-translate-y-0.5" style={{ background: b.color }}>
                      <Play size={13} /> {p > 0 ? 'Continue learning' : 'Start learning'}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => openBook(b, 'summary')} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-lilac-soft py-2 text-[11.5px] font-bold text-[#7a63b8] transition hover:bg-[#e5dcf5]">
                        <Wand2 size={12} /> Summarize
                      </button>
                      <button onClick={() => openBook(b, 'quiz')} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-mint-soft py-2 text-[11.5px] font-bold text-[#3d9a6e] transition hover:bg-[#d9f2e6]">
                        <ListChecks size={12} /> Take quiz
                      </button>
                      <button onClick={() => setBooks(bs => bs.filter(x => x.id !== b.id))} className="flex items-center justify-center rounded-xl border border-line bg-white/70 px-2.5 text-[#c76a92] transition hover:bg-blush-soft">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm font-semibold text-muted">No books match “{query}” — upload one to get started.</div>
      )}

      <FadeIn>
        <div className="mt-7 flex items-start gap-3 rounded-3xl bg-gradient-to-r from-peri-soft to-lilac-soft p-5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-peri-deep" />
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            <strong className="font-bold text-peri-deep">Full-learning loop:</strong> every uploaded book is chunked into your personal FAISS index, so the AI Tutor can cite it.
            Reading a chapter earns <strong>+20 pts</strong>, an AI summary <strong>+10 pts</strong>, and each book quiz up to <strong>+75 pts</strong> —
            a book counts as “fully learned” when all chapters are read and the quiz is passed.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
