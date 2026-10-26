import { useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronRight, CheckCircle2, XCircle, RotateCcw, Target, ArrowRight, BrainCircuit, Sparkles, LoaderCircle } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Ring, Bar } from '../../components/ui'
import { quizQuestions, upcomingQuizzes, type QuizQuestion } from '../../lib/data'
import { usePoints } from '../../lib/points'
import { Coins } from 'lucide-react'
import { getStudentId, mlRequest, type TutorSeed } from '../../lib/mlApi'

type GeneratedQuiz = {
  quiz_id: number
  topic?: string
  questions: { question: string; options: string[] }[]
}
type SavedQuiz = {
  id: number
  topic: string
  question_count: number
  created_at: string
}
type QuizReview = {
  question: string
  correct: boolean
  your_answer: string | null
  right_answer: string
  explanation: string
}
type QuizSubmission = {
  score: number
  total: number
  feedback: string
  review: QuizReview[]
}

const kindLabel: Record<QuizQuestion['kind'], string> = {
  mcq: 'Multiple Choice', fill: 'Fill in the Blank', tf: 'True / False', code: 'Coding', subjective: 'Subjective',
}
const kindTone: Record<QuizQuestion['kind'], 'peri' | 'lilac' | 'sky' | 'mint' | 'blush'> = {
  mcq: 'peri', fill: 'sky', tf: 'mint', code: 'lilac', subjective: 'blush',
}

function isCorrect(q: QuizQuestion, a: string) {
  if (q.kind === 'subjective') return a.trim().length > 40
  if (q.kind === 'fill') return a.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === q.answer.toLowerCase().replace(/[^a-z0-9]/g, '')
  return a === q.answer
}

export default function Quizzes() {
  const location = useLocation()
  const routeState = location.state as {
    seed?: TutorSeed
    generatedQuiz?: GeneratedQuiz
    topic?: string
  } | null
  const seed = routeState?.seed
  const incomingQuiz = routeState?.generatedQuiz ?? null
  const [stage, setStage] = useState<'list' | 'quiz' | 'results'>('list')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [earned, setEarned] = useState(0)
  const { addPoints } = usePoints()
  const [topic, setTopic] = useState(routeState?.topic ?? seed?.question.slice(0, 300) ?? '')
  const [contextQuestion] = useState(seed?.question.slice(0, 4000) ?? '')
  const [contextAnswer] = useState(seed?.answer.slice(0, 6000) ?? '')
  const [questionCount, setQuestionCount] = useState(5)
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(incomingQuiz)
  const [aiStage, setAiStage] = useState<'quiz' | 'results' | null>(incomingQuiz ? 'quiz' : null)
  const [aiIndex, setAiIndex] = useState(0)
  const [aiAnswers, setAiAnswers] = useState<number[]>(incomingQuiz ? Array(incomingQuiz.questions.length).fill(-1) : [])
  const [aiResult, setAiResult] = useState<QuizSubmission | null>(null)
  const [aiEarned, setAiEarned] = useState(0)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([])
  const [savedQuizzesLoading, setSavedQuizzesLoading] = useState(true)
  const [savedQuizzesError, setSavedQuizzesError] = useState('')

  const q = quizQuestions[idx]
  const progress = ((idx) / quizQuestions.length) * 100

  const loadSavedQuizzes = async () => {
    setSavedQuizzesLoading(true)
    setSavedQuizzesError('')
    try {
      const studentId = encodeURIComponent(getStudentId())
      const result = await mlRequest<{ quizzes: SavedQuiz[] }>(`/quizzes?student_id=${studentId}`)
      setSavedQuizzes(result.quizzes)
    } catch (requestError) {
      setSavedQuizzesError(requestError instanceof Error ? requestError.message : 'Unable to load your saved quizzes.')
    } finally {
      setSavedQuizzesLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const studentId = encodeURIComponent(getStudentId())
    void mlRequest<{ quizzes: SavedQuiz[] }>(`/quizzes?student_id=${studentId}`)
      .then(result => {
        if (mounted) setSavedQuizzes(result.quizzes)
      })
      .catch(requestError => {
        if (mounted) {
          setSavedQuizzesError(requestError instanceof Error ? requestError.message : 'Unable to load your saved quizzes.')
        }
      })
      .finally(() => {
        if (mounted) setSavedQuizzesLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const generateAiQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!topic.trim() || aiLoading) return
    setAiLoading(true)
    setAiError('')
    setGeneratedQuiz(null)
    setAiResult(null)
    setAiStage(null)
    try {
      const result = await mlRequest<GeneratedQuiz>('/quizzes', {
        student_id: getStudentId(),
        topic: topic.trim(),
        num_questions: questionCount,
        context_question: contextQuestion || undefined,
        context_answer: contextAnswer || undefined,
      })
      setGeneratedQuiz(result)
      setAiAnswers(Array(result.questions.length).fill(-1))
      void loadSavedQuizzes()
    } catch (requestError) {
      setAiError(requestError instanceof Error ? requestError.message : 'Unable to generate a quiz.')
    } finally {
      setAiLoading(false)
    }
  }

  const openSavedQuiz = async (savedQuiz: SavedQuiz) => {
    if (aiLoading) return
    setAiLoading(true)
    setAiError('')
    try {
      const studentId = encodeURIComponent(getStudentId())
      const result = await mlRequest<GeneratedQuiz>(
        `/quizzes/${savedQuiz.id}?student_id=${studentId}`,
      )
      setTopic(result.topic ?? savedQuiz.topic)
      setGeneratedQuiz(result)
      setAiAnswers(Array(result.questions.length).fill(-1))
      setAiIndex(0)
      setAiResult(null)
      setAiStage('quiz')
    } catch (requestError) {
      setAiError(requestError instanceof Error ? requestError.message : 'Unable to open this quiz.')
    } finally {
      setAiLoading(false)
    }
  }

  const submitAiQuiz = async () => {
    if (!generatedQuiz || aiLoading || aiAnswers.some(answer => answer < 0)) return
    setAiLoading(true)
    setAiError('')
    try {
      const result = await mlRequest<QuizSubmission>(`/quizzes/${generatedQuiz.quiz_id}/submit`, {
        student_id: getStudentId(),
        answers: aiAnswers,
      })
      const points = result.score * 10 + 25
      setAiEarned(points)
      addPoints(points, `AI quiz completed · ${result.score}/${result.total} correct`)
      setAiResult(result)
      setAiStage('results')
    } catch (requestError) {
      setAiError(requestError instanceof Error ? requestError.message : 'Unable to submit your quiz.')
    } finally {
      setAiLoading(false)
    }
  }

  if (generatedQuiz && aiStage === 'quiz') {
    const question = generatedQuiz.questions[aiIndex]
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <Chip tone="lilac">Question {aiIndex + 1} of {generatedQuiz.questions.length}</Chip>
          <Chip tone="ink">{topic}</Chip>
        </div>
        <Bar value={(aiIndex / generatedQuiz.questions.length) * 100} color="#ab96e0" className="mb-6 !h-1.5" />
        <Glass className="p-7">
          <Chip tone="peri" className="mb-3">AI-generated · Multiple Choice</Chip>
          <h2 className="font-display text-xl font-bold leading-snug text-ink">{question.question}</h2>
          <div className="mt-5 space-y-2.5">
            {question.options.map((option, optionIndex) => (
              <button
                key={`${optionIndex}-${option}`}
                onClick={() => setAiAnswers(currentAnswers => currentAnswers.map((answer, index) => index === aiIndex ? optionIndex : answer))}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[13.5px] font-semibold transition-all ${
                  aiAnswers[aiIndex] === optionIndex
                    ? 'border-peri bg-peri-soft text-peri-deep shadow-[0_0_0_3px_rgba(125,136,230,0.15)]'
                    : 'border-line bg-white/70 text-ink-soft hover:border-peri/40 hover:bg-white'
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-current text-[10px]">{String.fromCharCode(65 + optionIndex)}</span>
                {option}
              </button>
            ))}
          </div>
          {aiError && <p role="alert" className="mt-4 text-sm font-medium text-[#b34267]">{aiError}</p>}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setAiStage(null)} className="text-[12.5px] font-bold text-muted transition hover:text-ink">Exit quiz</button>
            {aiIndex < generatedQuiz.questions.length - 1 ? (
              <button
                onClick={() => setAiIndex(index => index + 1)}
                disabled={aiAnswers[aiIndex] < 0}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-peri to-lilac px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-40"
              >Next <ChevronRight size={15} /></button>
            ) : (
              <button
                onClick={() => void submitAiQuiz()}
                disabled={aiLoading || aiAnswers.some(answer => answer < 0)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-40"
              >{aiLoading && <LoaderCircle size={15} className="animate-spin" />} Submit Quiz</button>
            )}
          </div>
        </Glass>
      </div>
    )
  }

  if (generatedQuiz && aiStage === 'results' && aiResult) {
    return (
      <div>
        <PageHead crumbs={['Home', 'Adaptive Quizzes', 'Results']} title="Your AI quiz results" subtitle={`${topic} · results saved to your learning profile`} />
        <div className="grid gap-5 lg:grid-cols-3">
          <Glass className="flex flex-col items-center p-7 text-center">
            <Ring value={Math.round((aiResult.score / aiResult.total) * 100)} size={120} stroke={10} color={aiResult.score / aiResult.total >= 0.7 ? '#8fd4b8' : '#f0b9cf'} sub="score" />
            <h2 className="mt-4 font-display text-xl font-extrabold text-ink">{aiResult.score} of {aiResult.total} correct</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{aiResult.feedback}</p>
            <p className="mt-4 font-bold text-[#b08b2e]">+{aiEarned} points earned</p>
            <button onClick={() => setAiStage(null)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-peri to-lilac py-3 text-sm font-bold text-white">Back to quizzes</button>
          </Glass>
          <div className="space-y-3 lg:col-span-2">
            {aiResult.review.map((item, index) => (
              <Glass key={`${index}-${item.question}`} className="p-5">
                <div className="flex items-start gap-2.5">
                  {item.correct ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#3d9a6e]" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-[#c76a92]" />}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">Q{index + 1}. {item.question}</p>
                    <p className="mt-2 text-xs text-ink-soft">Your answer: {item.your_answer ?? '—'}{!item.correct && <> · Correct: {item.right_answer}</>}</p>
                    <p className="mt-2 border-t border-line/70 pt-2 text-xs leading-relaxed text-ink-soft">{item.explanation}</p>
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const submit = () => {
    const next = [...answers, current]
    setAnswers(next)
    setCurrent('')
    if (idx < quizQuestions.length - 1) setIdx(idx + 1)
    else {
      // ---- points: +10 per correct answer, +25 completion bonus ----
      const correct = quizQuestions.filter((qq, i) => isCorrect(qq, next[i] ?? '')).length
      const pts = correct * 10 + 25
      setEarned(pts)
      addPoints(pts, `Quiz completed · ${correct}/${quizQuestions.length} correct`)
      setStage('results')
    }
  }

  const restart = () => { setStage('list'); setIdx(0); setAnswers([]); setCurrent('') }

  if (stage === 'list') {
    return (
      <div>
        <PageHead crumbs={['Home', 'Adaptive Quizzes']} title="Adaptive Quizzes" subtitle="The Quiz Agent calibrates difficulty to your ability estimate (θ = 0.62) in real time" />
        <Glass className="mb-6 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peri-soft text-peri-deep"><Sparkles size={18} /></span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Generate a quiz from your tutor session</h2>
              <p className="mt-1 text-[13px] text-ink-soft">Questions use the selected topic, your tutor’s answer, and your previous quiz results.</p>
            </div>
          </div>
          <form onSubmit={generateAiQuiz} className="mt-4 grid gap-3 sm:grid-cols-[1fr_130px_auto]">
            <input
              value={topic}
              onChange={event => setTopic(event.target.value)}
              maxLength={300}
              required
              placeholder="Topic or question to practice"
              className="min-w-0 rounded-xl border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none focus:border-peri"
            />
            <select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value))} className="rounded-xl border border-line bg-white/80 px-3 py-3 text-sm text-ink">
              {[3, 5, 8, 10].map(count => <option key={count} value={count}>{count} questions</option>)}
            </select>
            <button disabled={aiLoading || !topic.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-peri to-lilac px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
              {aiLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {aiLoading ? 'Generating…' : 'Generate quiz'}
            </button>
          </form>
          {aiError && <p role="alert" className="mt-3 text-sm font-medium text-[#b34267]">{aiError}</p>}
          {generatedQuiz && (
            <div className="mt-5 rounded-2xl border border-line/70 bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">Ready: {topic}</p>
                  <p className="mt-1 text-xs text-ink-soft">{generatedQuiz.questions.length} questions generated from your learning context.</p>
                </div>
                <button onClick={() => { setAiIndex(0); setAiStage('quiz') }} className="rounded-xl bg-peri-soft px-4 py-2.5 text-sm font-bold text-peri-deep">Start generated quiz</button>
              </div>
            </div>
          )}
        </Glass>
        <Glass className="mb-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Your AI-generated quizzes</h2>
              <p className="mt-1 text-[13px] text-ink-soft">Saved quizzes remain available here when you return.</p>
            </div>
            <button onClick={() => void loadSavedQuizzes()} disabled={savedQuizzesLoading} className="rounded-xl border border-line bg-white/75 px-4 py-2 text-xs font-bold text-peri-deep disabled:opacity-60">
              {savedQuizzesLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {savedQuizzesError && <p role="alert" className="mt-3 text-sm font-medium text-[#b34267]">{savedQuizzesError}</p>}
          {savedQuizzesLoading && savedQuizzes.length === 0 && <p className="mt-4 text-sm text-muted">Loading saved quizzes…</p>}
          {!savedQuizzesLoading && !savedQuizzesError && savedQuizzes.length === 0 && (
            <p className="mt-4 rounded-xl bg-white/70 p-4 text-sm text-ink-soft">No AI quizzes saved yet. Generate one above to see it here.</p>
          )}
          {savedQuizzes.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {savedQuizzes.map(savedQuiz => (
                <div key={savedQuiz.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-white/70 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{savedQuiz.topic}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {savedQuiz.question_count} questions · {new Date(`${savedQuiz.created_at}Z`).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => void openSavedQuiz(savedQuiz)}
                    disabled={aiLoading}
                    className="shrink-0 rounded-xl bg-peri-soft px-3 py-2.5 text-xs font-bold text-peri-deep disabled:opacity-60"
                  >{aiLoading ? 'Opening…' : 'Take quiz'}</button>
                </div>
              ))}
            </div>
          )}
        </Glass>
        <div className="grid gap-5 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lilac via-[#b8a3e6] to-peri p-7 text-white shadow-[0_20px_50px_-18px_rgba(171,150,224,0.8)]">
              <div className="dotgrid absolute inset-0 opacity-15 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)]" />
              <div className="relative">
                <Chip className="!bg-white/20 !text-white"><BrainCircuit size={12} /> Generated 20 min ago by Quiz Agent</Chip>
                <h2 className="mt-3 font-display text-2xl font-extrabold">Dynamic Programming — Adaptive Set</h2>
                <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-white/85">
                  5 questions across MCQ, fill-in, true/false, coding and subjective formats.
                  Items target your weakest DP sub-skills: memoization, optimal substructure and state design.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11.5px] font-bold">
                  {['⏱ ~8 min', '🎯 Adaptive difficulty', '📚 From your slides', '✨ Instant explanations'].map(t => (
                    <span key={t} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{t}</span>
                  ))}
                </div>
                <button onClick={() => setStage('quiz')} className="mt-6 flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#7a63b8] shadow-lg transition hover:-translate-y-0.5">
                  <Zap size={15} /> Start Quiz
                </button>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Glass className="h-full p-6">
              <h3 className="mb-4 font-display text-[15px] font-bold text-ink">Queued for you</h3>
              <div className="space-y-3">
                {upcomingQuizzes.map(u => (
                  <div key={u.title} className="rounded-2xl border border-line/70 bg-white/70 p-3.5">
                    <div className="text-[12.5px] font-bold text-ink">{u.title}</div>
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-muted">{u.subject} · {u.questions} Qs</span>
                      <span className="font-bold text-[#c76a92]">{u.due}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-mint-soft p-3.5 text-[11.5px] leading-relaxed text-[#3d9a6e]">
                <strong>Recent accuracy:</strong> 78% across last 10 quizzes — up 6 points this month.
              </div>
            </Glass>
          </FadeIn>
        </div>
      </div>
    )
  }

  if (stage === 'results') {
    const results = quizQuestions.map((qq, i) => ({ q: qq, a: answers[i], ok: isCorrect(qq, answers[i] ?? '') }))
    const score = Math.round((results.filter(r => r.ok).length / results.length) * 100)
    const weak = results.filter(r => !r.ok).map(r => r.q.topic)
    return (
      <div>
        <PageHead crumbs={['Home', 'Adaptive Quizzes', 'Results']} title="Quiz Results" subtitle="Dynamic Programming — Adaptive Set · submitted just now" />
        <div className="grid gap-5 lg:grid-cols-3">
          <FadeIn>
            <Glass className="flex flex-col items-center p-7 text-center">
              <Ring value={score} size={130} stroke={11} color={score >= 70 ? '#8fd4b8' : score >= 40 ? '#f2d491' : '#f0b9cf'} sub="score" />
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{score >= 80 ? 'Excellent work! 🎉' : score >= 60 ? 'Solid progress! 💪' : 'Keep practicing! 🌱'}</h3>
              <p className="mt-1.5 text-[13px] text-ink-soft">{results.filter(r => r.ok).length} of {results.length} correct · ability estimate θ updated to {score >= 70 ? '0.68 (▲)' : '0.58 (▼)'}</p>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.35 }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-butter-soft to-[#fbeecb] py-3 shadow-[inset_0_0_0_1px_rgba(232,185,79,0.35)]"
              >
                <Coins size={17} className="text-[#d9a53a]" />
                <span className="font-display text-lg font-extrabold text-[#b08b2e]">+{earned} points earned</span>
              </motion.div>
              <div className="mt-1.5 text-[10.5px] font-semibold text-muted">+10 per correct answer · +25 completion bonus → added to your balance</div>
              <div className="mt-4 w-full space-y-2 text-left">
                <div className="flex justify-between text-[12px] font-semibold"><span className="text-muted">Difficulty reached</span><span className="text-ink">Medium–Hard</span></div>
                <div className="flex justify-between text-[12px] font-semibold"><span className="text-muted">Time taken</span><span className="text-ink">6 m 42 s</span></div>
                <div className="flex justify-between text-[12px] font-semibold"><span className="text-muted">Percentile in cohort</span><span className="text-ink">{Math.min(96, score + 8)}th</span></div>
              </div>
              <button onClick={restart} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-peri to-lilac py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5">
                <RotateCcw size={14} /> Back to quizzes
              </button>
            </Glass>
          </FadeIn>

          <FadeIn delay={0.06} className="lg:col-span-2">
            <div className="space-y-4">
              {weak.length > 0 && (
                <Glass className="p-5">
                  <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-ink"><Target size={15} className="text-[#c76a92]" /> Weak topics detected</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {weak.map(w => <Chip key={w} tone="blush">{w}</Chip>)}
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-peri-soft p-3.5 text-[12.5px] font-medium text-peri-deep">
                    <ArrowRight size={14} className="shrink-0" />
                    Suggested next: revisit “State-space design” in your DSA slides (14–22), then a 10-question reinforcement set tomorrow at 10 AM.
                  </div>
                </Glass>
              )}
              {results.map((r, i) => (
                <Glass key={i} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {r.ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#3d9a6e]" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-[#c76a92]" />}
                      <div>
                        <div className="text-[13.5px] font-bold leading-snug text-ink">Q{i + 1}. {r.q.question}</div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <Chip tone={kindTone[r.q.kind]}>{kindLabel[r.q.kind]}</Chip>
                          <Chip tone="ink">{r.q.difficulty}</Chip>
                          <Chip tone="ink">{r.q.topic}</Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 rounded-2xl bg-white/70 p-3.5 text-[12.5px]">
                    <div><span className="font-bold text-muted">Your answer: </span><span className={r.ok ? 'font-semibold text-[#3d9a6e]' : 'font-semibold text-[#c76a92]'}>{r.a || '— skipped'}</span></div>
                    {!r.ok && r.q.kind !== 'subjective' && <div><span className="font-bold text-muted">Correct answer: </span><span className="font-semibold text-ink">{r.q.answer}</span></div>}
                    <div className="border-t border-line/60 pt-1.5 leading-relaxed text-ink-soft"><span className="font-bold text-peri-deep">Explanation: </span>{r.q.explanation}</div>
                  </div>
                </Glass>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    )
  }

  // quiz stage
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <Chip tone="lilac">Question {idx + 1} of {quizQuestions.length}</Chip>
        <Chip tone="ink">{q.difficulty} · {q.topic}</Chip>
      </div>
      <Bar value={progress} color="#ab96e0" className="mb-6 !h-1.5" />

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
          <Glass className="p-7">
            <Chip tone={kindTone[q.kind]} className="mb-3">{kindLabel[q.kind]}</Chip>
            <h2 className="font-display text-xl font-bold leading-snug text-ink">{q.question}</h2>

            {q.code && (
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#26253a] p-4 font-mono text-[12px] leading-relaxed text-[#d8d6ee]">{q.code}</pre>
            )}

            <div className="mt-5 space-y-2.5">
              {q.options ? (
                q.options.map(o => (
                  <button
                    key={o}
                    onClick={() => setCurrent(o)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[13.5px] font-semibold transition-all ${
                      current === o
                        ? 'border-peri bg-peri-soft text-peri-deep shadow-[0_0_0_3px_rgba(125,136,230,0.15)]'
                        : 'border-line bg-white/70 text-ink-soft hover:border-peri/40 hover:bg-white'
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${current === o ? 'border-peri bg-peri' : 'border-line'}`}>
                      {current === o && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span className={q.kind === 'code' ? 'font-mono text-[12.5px]' : ''}>{o}</span>
                  </button>
                ))
              ) : q.kind === 'subjective' ? (
                <textarea
                  rows={5}
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  placeholder="Write your answer (2–3 sentences)…"
                  className="w-full rounded-2xl border border-line bg-white/80 p-4 text-[13.5px] text-ink outline-none transition placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
                />
              ) : (
                <input
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  placeholder="Type your answer…"
                  className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3.5 font-mono text-[14px] text-ink outline-none transition placeholder:font-body placeholder:text-muted focus:border-peri focus:shadow-[0_0_0_3px_rgba(125,136,230,0.15)]"
                />
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={restart} className="text-[12.5px] font-bold text-muted transition hover:text-ink">Exit quiz</button>
              <button
                onClick={submit}
                disabled={!current.trim()}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-peri to-lilac px-6 py-3 text-sm font-bold text-white shadow-lg transition enabled:hover:-translate-y-0.5 disabled:opacity-40"
              >
                {idx === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next'} <ChevronRight size={15} />
              </button>
            </div>
          </Glass>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
