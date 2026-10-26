import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, SendHorizonal, Paperclip, Mic, ImagePlus, Copy, RefreshCw, Check,
  FileText, Plus, MessagesSquare, BookMarked, ThumbsUp, ThumbsDown, X,
} from 'lucide-react'
import { Chip } from '../../components/ui'
import { usePoints } from '../../lib/points'
import { getStudentId, mlRequest, type TutorSeed } from '../../lib/mlApi'

const API_URL = import.meta.env.VITE_TUTOR_API_URL ?? '/api/chat'

type Msg = {
  role: 'user' | 'ai'
  content: string
  citations?: { doc: string; page: string }[]
  attachment?: string // display name
  image?: string // data URL sent to the vision model
  error?: boolean
  persistenceWarning?: string
}

type Conversation = {
  id: string
  title: string
  updatedAt: string
  messageCount: number
}

type GeneratedQuiz = {
  quiz_id: number
  questions: { question: string; options: string[] }[]
}

function isQuizRequest(text: string) {
  return /\b(?:quiz|quizzes|test|practice questions?)\b/i.test(text) &&
    /\b(?:generate|create|make|build|give|start|take|quiz me|test me)\b/i.test(text)
}

function requestedQuizTopic(text: string) {
  const match = /\b(?:on|about|covering)\s+(.+?)[?.!]*$/i.exec(text)
  return match?.[1]?.trim() || undefined
}

async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL.replace(/\/$/, '')}/history`)
  const data = await res.json() as { conversations?: Conversation[]; error?: string }
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return Array.isArray(data.conversations) ? data.conversations : []
}

const suggested = [
  'Explain memoization vs tabulation with an example',
  'Summarize Unit 3 of my ML notes',
  'Generate 5 practice questions on B+ trees',
  'Why does my recursive Fibonacci time out?',
]

/* ---------- lightweight, XSS-safe markdown rendering ---------- */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const inline = (s: string) =>
  escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-peri-soft px-1 py-0.5 font-mono text-[12px] text-peri-deep">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-peri-deep">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

type Block = { type: 'text'; value: string } | { type: 'code'; lang: string; value: string }

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  const re = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) blocks.push({ type: 'text', value: text.slice(last, m.index) })
    blocks.push({ type: 'code', lang: m[1] || 'text', value: m[2].replace(/\n$/, '') })
    last = re.lastIndex
  }
  if (last < text.length) blocks.push({ type: 'text', value: text.slice(last) })
  return blocks
}

function TextBlock({ value }: { value: string }) {
  return (
    <>
      {value.split(/\n{2,}/).filter(p => p.trim()).map((p, i) => {
        const lines = p.split('\n')
        const cls = `text-[13.5px] leading-relaxed text-ink ${i > 0 ? 'mt-2.5' : ''}`
        const heading = /^(#{1,4})\s+(.*)/.exec(lines[0])
        if (heading && lines.length === 1) {
          return <p key={i} className={`${cls} font-display font-bold`} dangerouslySetInnerHTML={{ __html: inline(heading[2]) }} />
        }
        if (lines.every(l => /^\s*([-*]|\d+\.)\s+/.test(l))) {
          const ordered = /^\s*\d+\./.test(lines[0])
          const Tag = ordered ? 'ol' : 'ul'
          return (
            <Tag key={i} className={`${cls} ml-5 ${ordered ? 'list-decimal' : 'list-disc'} space-y-1`}>
              {lines.map((l, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: inline(l.replace(/^\s*([-*]|\d+\.)\s+/, '')) }} />
              ))}
            </Tag>
          )
        }
        return <p key={i} className={cls} dangerouslySetInnerHTML={{ __html: inline(p).replace(/\n/g, '<br/>') }} />
      })}
    </>
  )
}

function CodeBlock({ lang, body }: { lang: string; body: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(body).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#3b3a52]">
      <div className="flex items-center justify-between bg-[#2e2d42] px-3.5 py-2">
        <span className="font-mono text-[10.5px] font-medium text-[#a9a6c9]">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[10.5px] font-semibold text-[#a9a6c9] transition hover:text-white">
          {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#26253a] p-3.5 font-mono text-[11.5px] leading-relaxed text-[#d8d6ee]">{body}</pre>
    </div>
  )
}

function AiMessage({ msg, onRegenerate }: { msg: Msg; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-peri to-lilac text-white shadow">
        <Sparkles size={14} />
      </div>
      <div className="min-w-0 max-w-[85%] space-y-3">
        <div className={`glass rounded-2xl rounded-tl-md px-4 py-3.5 ${msg.error ? 'border border-blush/60' : ''}`}>
          {parseBlocks(msg.content).map((b, i) =>
            b.type === 'code'
              ? <CodeBlock key={i} lang={b.lang} body={b.value} />
              : <TextBlock key={i} value={b.value} />
          )}
          {msg.persistenceWarning && (
            <p className="mt-3 border-t border-line/70 pt-2 text-[11px] text-muted">
              {msg.persistenceWarning}
            </p>
          )}
          {msg.citations && (
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line/70 pt-2.5">
              <span className="flex items-center gap-1 text-[10.5px] font-bold text-muted"><BookMarked size={11} /> Sources:</span>
              {msg.citations.map((c, i) => (
                <button key={i} className="flex items-center gap-1 rounded-lg bg-peri-soft px-2 py-1 text-[10.5px] font-semibold text-peri-deep transition hover:bg-peri/20">
                  <FileText size={10} /> {c.doc} · {c.page}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copy} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted transition hover:bg-white hover:text-ink">
            {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={onRegenerate} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted transition hover:bg-white hover:text-ink">
            <RefreshCw size={12} /> {msg.error ? 'Retry' : 'Regenerate'}
          </button>
          <button className="rounded-lg px-1.5 py-1 text-muted transition hover:bg-white hover:text-mint"><ThumbsUp size={12} /></button>
          <button className="rounded-lg px-1.5 py-1 text-muted transition hover:bg-white hover:text-blush"><ThumbsDown size={12} /></button>
        </div>
      </div>
    </div>
  )
}

export default function Tutor({ compact = false, userMemory = '' }: { compact?: boolean; userMemory?: string }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Msg[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [conversationId, setConversationId] = useState<string>(() => crypto.randomUUID())
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [recording, setRecording] = useState(false)
  const [attachment, setAttachment] = useState<{ name: string; image: string } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { addPoints } = usePoints()
  const rewardedRef = useRef(0)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const refreshHistory = async () => {
    try {
      setConversations(await fetchConversations())
      setHistoryError('')
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : 'Unable to load history.')
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    fetchConversations()
      .then((items) => {
        if (mounted) {
          setConversations(items)
          setHistoryError('')
        }
      })
      .catch((error: unknown) => {
        if (mounted) setHistoryError(error instanceof Error ? error.message : 'Unable to load history.')
      })
      .finally(() => {
        if (mounted) setHistoryLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const openConversation = async (id: string) => {
    if (typing) return
    setHistoryError('')
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/history/${encodeURIComponent(id)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setMessages(Array.isArray(data.messages) ? data.messages : [])
      setConversationId(id)
      setActiveConversationId(id)
      setAttachment(null)
      setInput('')
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : 'Unable to open conversation.')
    }
  }

  const startNewConversation = () => {
    if (typing) return
    setMessages([])
    setInput('')
    setAttachment(null)
    setConversationId(crypto.randomUUID())
    setActiveConversationId(null)
  }

  // Calls the Express route with the full thread; appends the reply (or an error message)
  const ask = async (thread: Msg[]) => {
    setTyping(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: thread.filter(m => !m.error).map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content,
            image: m.image,
          })),
          userMemory,
          conversationId,
          studentId: getStudentId(),
        }),
      })
      const responseText = await res.text()
      let data: { reply?: string; error?: string; warning?: string; conversationId?: string } = {}
      try {
        const parsed: unknown = JSON.parse(responseText)
        if (parsed && typeof parsed === 'object') {
          const payload = parsed as Record<string, unknown>
          data = {
            reply: typeof payload.reply === 'string' ? payload.reply : undefined,
            error: typeof payload.error === 'string' ? payload.error : undefined,
            warning: typeof payload.warning === 'string' ? payload.warning : undefined,
            conversationId: typeof payload.conversationId === 'string' ? payload.conversationId : undefined,
          }
        }
      } catch {
        // Non-JSON server errors are reported below using the HTTP status.
      }
      if (!res.ok) {
        throw new Error(data.error ?? `Tutor service returned HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}.`)
      }
      setMessages(m => [...m, {
        role: 'ai',
        content: data.reply ?? 'No response generated.',
        persistenceWarning: data.warning,
      }])
      if (data.conversationId) {
        setConversationId(data.conversationId)
        setActiveConversationId(data.conversationId)
      }
      void refreshHistory()
      // ---- points: +5 per tutoring exchange (max 3 per session) ----
      if (rewardedRef.current < 3) {
        rewardedRef.current += 1
        addPoints(5, 'AI tutoring session')
      }
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Sorry, I couldn't reach the tutor right now. Please try again."
      setMessages(m => [...m, { role: 'ai', error: true, content: message }])
    } finally {
      setTyping(false)
    }
  }

  const send = (text?: string) => {
    const t = (text ?? input).trim()
    if (!t || typing) return
    const userMsg: Msg = { role: 'user', content: t, attachment: attachment?.name, image: attachment?.image }
    const thread = [...messages, userMsg]
    setMessages(thread)
    setInput('')
    setAttachment(null)

    if (isQuizRequest(t)) {
      let previousAnswerIndex = -1
      for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index].role === 'ai' && !messages[index].error) {
          previousAnswerIndex = index
          break
        }
      }
      const previousQuestion = previousAnswerIndex >= 0
        ? [...messages.slice(0, previousAnswerIndex)].reverse().find(
            message => message.role === 'user' && !isQuizRequest(message.content),
          )
        : undefined
      const previousAnswer = previousAnswerIndex >= 0 ? messages[previousAnswerIndex] : undefined
      const topic = requestedQuizTopic(t) || previousQuestion?.content
      const requestedCount = Number(/\b(\d{1,2})\s+(?:questions|qs)\b/i.exec(t)?.[1] ?? 5)

      if (!topic) {
        setMessages([...thread, {
          role: 'ai',
          content: 'Sure — what topic should I make the quiz about? You can name a topic here, or ask me about it first and then say “generate a quiz.”',
        }])
        return
      }

      setTyping(true)
      void mlRequest<GeneratedQuiz>('/quizzes', {
        student_id: getStudentId(),
        topic: topic.slice(0, 300),
        num_questions: Math.min(Math.max(requestedCount, 1), 20),
        context_question: previousQuestion?.content.slice(0, 4000),
        context_answer: previousAnswer?.content.slice(0, 6000),
      }).then(quiz => {
        setMessages([...thread, {
          role: 'ai',
          content: `I generated a ${quiz.questions.length}-question quiz on “${topic}”. Opening it now.`,
        }])
        navigate('/app/quizzes', { state: { generatedQuiz: quiz, topic } })
      }).catch(error => {
        setMessages([...thread, {
          role: 'ai',
          error: true,
          content: error instanceof Error ? error.message : 'Unable to generate a quiz. Please try again.',
        }])
      }).finally(() => setTyping(false))
      return
    }

    ask(thread)
  }

  const regenerate = () => {
    if (typing) return
    // drop the last AI reply, then re-ask with the thread ending at the last user message
    const thread = messages.slice(0, -1)
    if (!thread.length) return
    setMessages(thread)
    ask(thread)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAttachment({ name: file.name, image: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-4 md:h-[calc(100vh-9.5rem)]">
      {/* history sidebar */}
      {!compact && (
        <div className="glass hidden w-60 shrink-0 flex-col rounded-3xl p-3 xl:flex">
          <button onClick={startNewConversation} disabled={typing} className="mb-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-peri to-lilac py-2.5 text-[12.5px] font-bold text-white shadow transition hover:-translate-y-0.5 disabled:opacity-50">
            <Plus size={14} /> New conversation
          </button>
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">History</span>
            <button onClick={() => void refreshHistory()} title="Refresh history" className="text-[10px] font-semibold text-peri-deep transition hover:text-ink">Refresh</button>
          </div>
          {historyError && <p role="alert" className="px-2 pb-2 text-[10px] leading-relaxed text-[#c76a92]">{historyError}</p>}
          <div className="flex-1 space-y-1 overflow-y-auto">
            {historyLoading ? (
              <p className="px-3 py-2 text-[11px] text-muted">Loading history…</p>
            ) : conversations.length === 0 ? (
              <p className="px-3 py-2 text-[11px] leading-relaxed text-muted">Your saved conversations will appear here.</p>
            ) : conversations.map((conversation) => {
              const date = new Date(conversation.updatedAt)
              const time = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString()
              const selected = activeConversationId === conversation.id
              return (
                <button
                  key={conversation.id}
                  onClick={() => void openConversation(conversation.id)}
                  disabled={typing}
                  title={conversation.title}
                  className={`w-full rounded-xl px-3 py-2 text-left transition disabled:opacity-50 ${selected ? 'bg-peri-soft' : 'hover:bg-white/70'}`}
                >
                  <div className={`flex items-center gap-1.5 truncate text-[12px] font-semibold ${selected ? 'text-peri-deep' : 'text-ink'}`}>
                    <MessagesSquare size={12} className="shrink-0 opacity-60" /> {conversation.title || 'New conversation'}
                  </div>
                  <div className="mt-0.5 flex justify-between pl-[18px] text-[10px] text-muted">
                    <span>{time}</span>
                    <span>{conversation.messageCount} {conversation.messageCount === 1 ? 'exchange' : 'exchanges'}</span>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-2 rounded-2xl bg-lilac-soft p-3 text-[11px] leading-relaxed text-[#7a63b8]">
            <strong className="font-bold">Vision enabled:</strong> attach an image, diagram or code screenshot and ask about it.
          </div>
        </div>
      )}

      {/* chat area */}
      <div className="glass flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-peri to-lilac text-white">
              <Sparkles size={16} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-mint" />
            </div>
            <div>
              <div className="font-display text-[14px] font-bold text-ink">Tutor Agent</div>
              <div className="text-[10.5px] font-medium text-muted">Gemini 2.5 Flash · vision · online</div>
            </div>
          </div>
          <Chip tone="mint">Personalized</Chip>
        </div>

        {/* messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-peri to-lilac text-white shadow-[0_16px_40px_-12px_rgba(125,136,230,0.8)]">
                <Sparkles size={28} />
              </motion.div>
              <h2 className="mt-5 font-display text-xl font-extrabold text-ink">How can I help you learn today?</h2>
              <p className="mt-1.5 max-w-sm text-[13px] text-ink-soft">Ask me anything — I can also read images, flowcharts and code screenshots you attach.</p>
              <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {suggested.map(s => (
                  <button key={s} onClick={() => send(s)} className="rounded-2xl border border-line bg-white/70 px-4 py-3 text-left text-[12.5px] font-semibold text-ink-soft transition hover:-translate-y-0.5 hover:border-peri/50 hover:text-peri-deep hover:shadow-md">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const previousQuestion = m.role === 'ai'
                ? [...messages.slice(0, i)].reverse().find(message => message.role === 'user')?.content
                : undefined
              const seed: TutorSeed | undefined = previousQuestion && !m.error
                ? { question: previousQuestion, answer: m.content }
                : undefined
              return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                {m.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%]">
                      {m.image && (
                        <img src={m.image} alt={m.attachment ?? 'attachment'} className="mb-1.5 ml-auto max-h-48 rounded-xl border border-line object-contain" />
                      )}
                      {m.attachment && (
                        <div className="mb-1.5 ml-auto flex w-fit items-center gap-1.5 rounded-xl bg-lilac-soft px-3 py-1.5 text-[11px] font-semibold text-[#7a63b8]">
                          <FileText size={12} /> {m.attachment}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap rounded-2xl rounded-tr-md bg-gradient-to-br from-peri to-[#8f8ce0] px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-[0_8px_24px_-10px_rgba(125,136,230,0.8)]">
                        {m.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <AiMessage msg={m} onRegenerate={regenerate} />
                    {seed && (
                      <div className="ml-11 mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate('/app/courses', { state: { seed } })}
                          className="rounded-lg border border-line bg-white/75 px-3 py-2 text-[11px] font-bold text-peri-deep transition hover:border-peri/50"
                        >Build a course from this answer</button>
                        <button
                          onClick={() => navigate('/app/quizzes', { state: { seed } })}
                          className="rounded-lg border border-line bg-white/75 px-3 py-2 text-[11px] font-bold text-peri-deep transition hover:border-peri/50"
                        >Quiz me on this answer</button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
              )
            })}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-peri to-lilac text-white"><Sparkles size={14} /></div>
              <div className="glass flex items-center gap-2.5 rounded-2xl rounded-tl-md px-4 py-3.5">
                <span className="text-[11.5px] font-semibold text-muted">Thinking</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-peri" />)}
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* composer */}
        <div className="border-t border-line/70 p-4">
          {attachment && (
            <div className="mb-2 flex w-fit items-center gap-2 rounded-xl bg-peri-soft px-3 py-1.5 text-[11.5px] font-semibold text-peri-deep">
              <img src={attachment.image} alt="" className="h-6 w-6 rounded object-cover" />
              {attachment.name}
              <button onClick={() => setAttachment(null)} className="transition hover:text-ink"><X size={12} /></button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-white/85 p-2 transition focus-within:border-peri focus-within:shadow-[0_0_0_3px_rgba(125,136,230,0.14)]">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            <button onClick={() => fileRef.current?.click()} title="Attach image" className="rounded-xl p-2 text-muted transition hover:bg-mist hover:text-peri-deep"><Paperclip size={17} /></button>
            <button onClick={() => fileRef.current?.click()} title="Upload image" className="hidden rounded-xl p-2 text-muted transition hover:bg-mist hover:text-peri-deep sm:block"><ImagePlus size={17} /></button>
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything about your courses…"
              className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[13.5px] text-ink outline-none placeholder:text-muted"
            />
            <button
              onClick={() => setRecording(!recording)}
              title="Voice input"
              className={`relative rounded-xl p-2 transition ${recording ? 'pulse-ring bg-blush-soft text-[#c76a92]' : 'text-muted hover:bg-mist hover:text-peri-deep'}`}
            >
              <Mic size={17} />
            </button>
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="rounded-xl bg-gradient-to-r from-peri to-lilac p-2.5 text-white shadow transition enabled:hover:-translate-y-0.5 disabled:opacity-40"
            >
              <SendHorizonal size={16} />
            </button>
          </div>
          <div className="mt-2 text-center text-[10.5px] text-muted">
            {recording ? <span className="font-bold text-[#c76a92]">● Listening… speak your question</span> : 'EduMind AI can make mistakes — double-check important answers. · Markdown, code & images supported'}
          </div>
        </div>
      </div>
    </div>
  )
}