import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Clock3, BookOpen, Lock, Unlock, Coins, CheckCircle2, Sparkles, Crown, LoaderCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import { Glass, Chip, PageHead, FadeIn, Bar, Ring } from '../../components/ui'
import { subjects, lockedCourses } from '../../lib/data'
import { usePoints } from '../../lib/points'
import { getStudentId, mlRequest, type TutorSeed } from '../../lib/mlApi'

type CourseLesson = { title: string; summary: string; content: string | null }
type GeneratedCourse = {
  course_id: number
  course: {
    title: string
    overview: string
    prerequisites: string[]
    modules: { title: string; goal: string; lessons: CourseLesson[] }[]
    completed_lessons: string[]
  }
}
type SavedCourse = {
  id: number
  topic: string
  title: string
  module_count: number
  lesson_count: number
  completed_lessons: number
  created_at: string
}

function hydrateCourse(record: { id: number; data: GeneratedCourse['course'] }): GeneratedCourse {
  return {
    course_id: record.id,
    course: {
      ...record.data,
      completed_lessons: record.data.completed_lessons ?? [],
    },
  }
}

export default function Courses() {
  const { balance, unlocked, unlockCourse, completedLessons, completeLesson } = usePoints()
  const location = useLocation()
  const isAiCoursesPage = location.pathname === '/app/tutor'
  const seed = (location.state as { seed?: TutorSeed } | null)?.seed
  const [topic, setTopic] = useState(seed?.question.slice(0, 300) ?? '')
  const [contextQuestion] = useState(seed?.question.slice(0, 4000) ?? '')
  const [contextAnswer] = useState(seed?.answer.slice(0, 6000) ?? '')
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null)
  const [activeLesson, setActiveLesson] = useState('')
  const [loading, setLoading] = useState(false)
  const [lessonLoading, setLessonLoading] = useState('')
  const [error, setError] = useState('')
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([])
  const [savedCoursesLoading, setSavedCoursesLoading] = useState(true)
  const [savedCoursesError, setSavedCoursesError] = useState('')

  useEffect(() => {
    let mounted = true
    const studentId = encodeURIComponent(getStudentId())
    void mlRequest<{ courses: SavedCourse[] }>(`/courses?student_id=${studentId}`)
      .then(result => {
        if (mounted) setSavedCourses(result.courses)
      })
      .catch(requestError => {
        if (mounted) {
          setSavedCoursesError(requestError instanceof Error ? requestError.message : 'Unable to load saved courses.')
        }
      })
      .finally(() => {
        if (mounted) setSavedCoursesLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const refreshSavedCourses = async () => {
    setSavedCoursesError('')
    try {
      const studentId = encodeURIComponent(getStudentId())
      const result = await mlRequest<{ courses: SavedCourse[] }>(`/courses?student_id=${studentId}`)
      setSavedCourses(result.courses)
    } catch (requestError) {
      setSavedCoursesError(requestError instanceof Error ? requestError.message : 'Unable to load saved courses.')
    }
  }

  const generateCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setGeneratedCourse(null)
    setActiveLesson('')
    try {
      const result = await mlRequest<GeneratedCourse>('/courses', {
        student_id: getStudentId(),
        topic: topic.trim(),
        level: 'auto',
        modules: 5,
        context_question: contextQuestion || undefined,
        context_answer: contextAnswer || undefined,
      })
      setGeneratedCourse(result)
      setSavedCourses(current => [{
        id: result.course_id,
        topic: topic.trim(),
        title: result.course.title,
        module_count: result.course.modules.length,
        lesson_count: result.course.modules.reduce((count, module) => count + module.lessons.length, 0),
        completed_lessons: 0,
        created_at: new Date().toISOString(),
      }, ...current.filter(course => course.id !== result.course_id)])
      const firstLesson = result.course.modules[0]?.lessons[0]
      if (firstLesson) void openLesson(0, 0, result)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate a course.')
    } finally {
      setLoading(false)
    }
  }

  const openLesson = async (
    moduleIndex: number,
    lessonIndex: number,
    course: GeneratedCourse | null = generatedCourse,
  ) => {
    if (!course) return
    const key = `${moduleIndex}-${lessonIndex}`
    const selectedLesson = course.course.modules[moduleIndex]?.lessons[lessonIndex]
    if (!selectedLesson) return
    setActiveLesson(key)
    if (selectedLesson.content) return
    setLessonLoading(key)
    setError('')
    try {
      const studentId = encodeURIComponent(getStudentId())
      const result = await mlRequest<{ content: string }>(
        `/courses/${course.course_id}/lessons/${moduleIndex}/${lessonIndex}?student_id=${studentId}`,
        {},
      )
      setGeneratedCourse(current => {
        if (!current || current.course_id !== course.course_id) return current
        const modules = current.course.modules.map((module, mi) => ({
          ...module,
          lessons: module.lessons.map((lesson, li) =>
            mi === moduleIndex && li === lessonIndex ? { ...lesson, content: result.content } : lesson,
          ),
        }))
        return { ...current, course: { ...current.course, modules } }
      })
      setActiveLesson(key)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate this lesson.')
    } finally {
      setLessonLoading('')
    }
  }

  const resumeCourse = async (courseId: number) => {
    if (loading || lessonLoading) return
    setLoading(true)
    setError('')
    try {
      const studentId = encodeURIComponent(getStudentId())
      const record = await mlRequest<{ id: number; data: GeneratedCourse['course'] }>(
        `/courses/${courseId}?student_id=${studentId}`,
      )
      const course = hydrateCourse(record)
      setGeneratedCourse(course)
      const completed = new Set(course.course.completed_lessons)
      const nextLesson = course.course.modules.flatMap((module, moduleIndex) =>
        module.lessons.map((lesson, lessonIndex) => ({ lesson, moduleIndex, lessonIndex })),
      ).find(item => !completed.has(`${item.moduleIndex}:${item.lessonIndex}`))
      const target = nextLesson ?? course.course.modules.flatMap((module, moduleIndex) =>
        module.lessons.map((lesson, lessonIndex) => ({ lesson, moduleIndex, lessonIndex })),
      ).at(-1)
      if (target) await openLesson(target.moduleIndex, target.lessonIndex, course)
      else setActiveLesson('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to resume this course.')
    } finally {
      setLoading(false)
    }
  }

  const advanceLesson = async () => {
    if (!generatedCourse || !activeLesson || lessonLoading) return
    const [moduleIndex, lessonIndex] = activeLesson.split('-').map(Number)
    const studentId = getStudentId()
    setLessonLoading(activeLesson)
    setError('')
    try {
      const result = await mlRequest<{
        completed_lessons: string[]
        newly_completed: boolean
        course_complete: boolean
      }>(
        `/courses/${generatedCourse.course_id}/lessons/${moduleIndex}/${lessonIndex}/complete`,
        { student_id: studentId },
      )
      const updatedCourse = {
        ...generatedCourse,
        course: { ...generatedCourse.course, completed_lessons: result.completed_lessons },
      }
      setGeneratedCourse(updatedCourse)
      if (result.newly_completed) {
        completeLesson(`ai-course-${generatedCourse.course_id}-${moduleIndex}-${lessonIndex}`)
      }
      setSavedCourses(current => current.map(course =>
        course.id === generatedCourse.course_id
          ? { ...course, completed_lessons: result.completed_lessons.length }
          : course,
      ))

      const nextLesson = generatedCourse.course.modules.flatMap((module, mi) =>
        module.lessons.map((lesson, li) => ({ lesson, moduleIndex: mi, lessonIndex: li })),
      ).find(item => !result.completed_lessons.includes(`${item.moduleIndex}:${item.lessonIndex}`))
      if (nextLesson) {
        await openLesson(nextLesson.moduleIndex, nextLesson.lessonIndex, updatedCourse)
      } else {
        setActiveLesson('')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save lesson progress.')
    } finally {
      setLessonLoading('')
      void refreshSavedCourses()
    }
  }

  const goToPreviousLesson = async () => {
    if (!generatedCourse || !activeLesson || lessonLoading) return
    const [moduleIndex, lessonIndex] = activeLesson.split('-').map(Number)
    const lessons = generatedCourse.course.modules.flatMap((module, mi) =>
      module.lessons.map((lesson, li) => ({ lesson, moduleIndex: mi, lessonIndex: li })),
    )
    const currentIndex = lessons.findIndex(item =>
      item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex,
    )
    const previous = lessons[currentIndex - 1]
    if (previous) await openLesson(previous.moduleIndex, previous.lessonIndex)
  }

  return (
    <div>
      <PageHead
        crumbs={['Home', isAiCoursesPage ? 'AI Courses' : 'My Courses']}
        title={isAiCoursesPage ? 'AI Courses' : 'My Courses'}
        subtitle={isAiCoursesPage
          ? 'Build a course with AI, then start, continue, or review it from here.'
          : 'Your courses, learning progress, and saved AI-generated lessons.'}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/app/rewards" className="flex items-center gap-1.5 rounded-xl border border-[#e8d9a0] bg-[#fdf8e9] px-4 py-2.5 text-[13px] font-bold text-[#b08b2e] transition hover:-translate-y-0.5">
              <Coins size={14} className="text-[#d9a53a]" /> {balance.toLocaleString()} pts
            </Link>
            <Link to="/app/roadmap" className="rounded-xl bg-gradient-to-r from-peri to-lilac px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5">View Roadmap</Link>
          </div>
        }
      />
      <Glass className="mb-6 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peri-soft text-peri-deep"><Sparkles size={18} /></span>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Start a course with AI</h2>
            <p className="mt-1 text-[13px] text-ink-soft">Enter a topic to create a structured course. Your lessons and progress will be saved so you can continue any time.</p>
          </div>
        </div>
        <form onSubmit={generateCourse} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={topic}
            onChange={event => setTopic(event.target.value)}
            maxLength={300}
            required
            placeholder="What do you want to learn?"
            className="min-w-0 flex-1 rounded-xl border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none focus:border-peri"
          />
          <button disabled={loading || !topic.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-peri to-lilac px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Building course…' : 'Generate course'}
          </button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm font-medium text-[#b34267]">{error}</p>}
        {generatedCourse && (
          <div className="mt-5 border-t border-line/70 pt-5">
            <h3 className="font-display text-xl font-bold text-ink">{generatedCourse.course.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{generatedCourse.course.overview}</p>
            {generatedCourse.course.prerequisites.length > 0 && (
              <p className="mt-2 text-xs text-muted"><strong>Prerequisites:</strong> {generatedCourse.course.prerequisites.join(', ')}</p>
            )}
            {(() => {
              const totalLessons = generatedCourse.course.modules.reduce(
                (count, module) => count + module.lessons.length,
                0,
              )
              const completionPercent = totalLessons
                ? Math.round((generatedCourse.course.completed_lessons.length / totalLessons) * 100)
                : 0
              const courseComplete = totalLessons > 0 && completionPercent === 100
              const [activeModuleIndex, activeLessonIndex] = activeLesson
                ? activeLesson.split('-').map(Number)
                : [-1, -1]
              const lesson = generatedCourse.course.modules[activeModuleIndex]?.lessons[activeLessonIndex]
              return (
            <>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-soft">
                <span>{generatedCourse.course.completed_lessons.length} of {totalLessons} lessons complete</span>
                <span>{completionPercent}%</span>
              </div>
              <Bar value={completionPercent} color="#7d88e6" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {generatedCourse.course.modules.map((module, moduleIndex) => (
                <div key={`${module.title}-${moduleIndex}`} className="rounded-2xl border border-line/70 bg-white/60 p-4">
                  <h4 className="font-display font-bold text-ink">{moduleIndex + 1}. {module.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{module.goal}</p>
                  <div className="mt-3 space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const lessonKey = `${moduleIndex}-${lessonIndex}`
                      const complete = generatedCourse.course.completed_lessons.includes(`${moduleIndex}:${lessonIndex}`)
                      return (
                        <div key={`${lesson.title}-${lessonIndex}`} className="rounded-xl bg-white/80 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                                {complete && <CheckCircle2 size={14} className="shrink-0 text-[#3d9a6e]" />}
                                {lesson.title}
                              </p>
                              <p className="mt-0.5 text-xs text-ink-soft">{lesson.summary}</p>
                            </div>
                            <button
                              onClick={() => void openLesson(moduleIndex, lessonIndex)}
                              disabled={lessonLoading !== '' || loading}
                              className="shrink-0 rounded-lg bg-peri-soft px-3 py-2 text-xs font-bold text-peri-deep disabled:opacity-60"
                            >
                              {lessonLoading === lessonKey ? 'Writing…' : activeLesson === lessonKey ? 'Reading' : 'Open'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {lesson && (
              <div className="mt-5 rounded-2xl border border-line/70 bg-white/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-peri-deep">
                  Module {activeModuleIndex + 1} · Lesson {activeLessonIndex + 1}
                </p>
                <h4 className="mt-1 font-display text-lg font-bold text-ink">{lesson.title}</h4>
                {lessonLoading === activeLesson && !lesson.content ? (
                  <div className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
                    <LoaderCircle size={16} className="animate-spin" /> Preparing lesson…
                  </div>
                ) : lesson.content ? (
                  <div className="mt-4 whitespace-pre-wrap border-t border-line/70 pt-4 text-sm leading-relaxed text-ink-soft">
                    {lesson.content}
                  </div>
                ) : null}
                <div className="mt-5 flex flex-wrap justify-between gap-3">
                  <button
                    onClick={() => void goToPreviousLesson()}
                    disabled={lessonLoading !== '' || (activeModuleIndex === 0 && activeLessonIndex === 0)}
                    className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink-soft disabled:opacity-50"
                  ><ChevronLeft size={16} /> Previous lesson</button>
                  <button
                    onClick={() => void advanceLesson()}
                    disabled={!lesson.content || lessonLoading !== '' || courseComplete}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-peri to-lilac px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {lessonLoading === activeLesson ? <LoaderCircle size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {courseComplete ? 'Course complete' : 'Complete & next lesson'}
                    {!courseComplete && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>
            )}
            {courseComplete && (
              <p className="mt-4 rounded-xl bg-mint-soft p-3 text-sm font-semibold text-[#3d9a6e]">
                Course completed! Your progress is saved and you earned points for each completed lesson.
              </p>
            )}
            </>
              )
            })()}
          </div>
        )}
      </Glass>
      <Glass className="mb-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Your saved AI courses</h2>
            <p className="mt-1 text-[13px] text-ink-soft">Course outlines, generated lessons, and lesson progress are saved in the database.</p>
          </div>
          <button
            onClick={() => void refreshSavedCourses()}
            disabled={savedCoursesLoading}
            className="rounded-xl border border-line bg-white/75 px-4 py-2 text-xs font-bold text-peri-deep disabled:opacity-60"
          >{savedCoursesLoading ? 'Loading…' : 'Refresh'}</button>
        </div>
        {savedCoursesError && <p role="alert" className="mt-3 text-sm font-medium text-[#b34267]">{savedCoursesError}</p>}
        {!savedCoursesLoading && !savedCoursesError && savedCourses.length === 0 && (
          <p className="mt-4 rounded-xl bg-white/70 p-4 text-sm text-ink-soft">No generated courses yet. Create one above and it will be saved here.</p>
        )}
        {savedCourses.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {savedCourses.map(course => {
              const progress = course.lesson_count
                ? Math.round((course.completed_lessons / course.lesson_count) * 100)
                : 0
              const isComplete = course.lesson_count > 0 && course.completed_lessons >= course.lesson_count
              const courseAction = isComplete
                ? 'Review course'
                : course.completed_lessons > 0
                  ? 'Continue course'
                  : 'Start course'
              return (
                <div key={course.id} className="rounded-2xl border border-line/70 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display font-bold text-ink">{course.title}</h3>
                      <p className="mt-1 text-xs text-ink-soft">{course.module_count} modules · {course.lesson_count} lessons</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${isComplete ? 'bg-mint-soft text-[#3d9a6e]' : 'bg-peri-soft text-peri-deep'}`}>
                      {isComplete ? 'Completed' : `${progress}%`}
                    </span>
                  </div>
                  <div className="mt-3"><Bar value={progress} color="#7d88e6" /></div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-muted">{course.completed_lessons}/{course.lesson_count} lessons complete</span>
                    <button
                      onClick={() => void resumeCourse(course.id)}
                      disabled={loading || lessonLoading !== ''}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-60 ${isComplete ? 'bg-mint-soft text-[#3d9a6e]' : 'bg-peri-soft text-peri-deep'}`}
                    >{isComplete ? <CheckCircle2 size={12} /> : <Play size={12} />} {courseAction}</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Glass>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((s, i) => {
          const lessonDone = completedLessons.includes(s.id)
          return (
            <FadeIn key={s.id} delay={i * 0.05}>
              <Glass hover className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${s.color}20` }}>{s.icon}</div>
                  <Ring value={s.progress} size={54} stroke={5} color={s.color} />
                </div>
                <div className="mt-4">
                  <div className="text-[11px] font-bold tracking-wide text-muted">{s.code}</div>
                  <h3 className="mt-0.5 font-display text-[16px] font-bold leading-snug text-ink">{s.name}</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Chip tone="ink"><BookOpen size={11} /> {s.done}/{s.modules} modules</Chip>
                  <Chip tone="ink"><Clock3 size={11} /> {s.hours} h studied</Chip>
                  <Chip tone={s.grade.startsWith('A') ? 'mint' : 'butter'}>Grade {s.grade}</Chip>
                </div>
                <div className="mt-4">
                  <Bar value={s.progress} color={s.color} />
                </div>
                <div className="mt-auto space-y-2 pt-4">
                  <button
                    onClick={() => completeLesson(s.id)}
                    disabled={lessonDone}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12.5px] font-bold transition ${
                      lessonDone
                        ? 'cursor-default border-[#bfe6d2] bg-mint-soft text-[#3d9a6e]'
                        : 'border-[#e8d9a0] bg-[#fdf8e9] text-[#b08b2e] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(232,185,79,0.6)]'
                    }`}
                  >
                    {lessonDone ? <><CheckCircle2 size={13} /> Lesson complete · +20 pts earned</> : <><Coins size={13} className="text-[#d9a53a]" /> Complete next lesson · +20 pts</>}
                  </button>
                  <Link to="/app/tutor" className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold text-white shadow transition hover:-translate-y-0.5" style={{ background: s.color }}>
                    <Play size={13} /> Continue learning
                  </Link>
                </div>
              </Glass>
            </FadeIn>
          )
        })}
      </div>

      {/* ---------- Locked premium courses ---------- */}
      <div className="mt-10">
        <FadeIn>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <Crown size={19} className="text-[#d9a53a]" /> Unlock with points
              </h2>
              <p className="mt-1 text-[13px] text-ink-soft">Spend the points you earn from learning to unlock advanced elective tracks.</p>
            </div>
            <Link to="/app/rewards" className="flex items-center gap-1.5 text-[12.5px] font-bold text-peri-deep transition hover:gap-2.5">
              How to earn points <Sparkles size={13} />
            </Link>
          </div>
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lockedCourses.map((c, i) => {
            const isUnlocked = unlocked.includes(c.id)
            const affordable = balance >= c.cost
            return (
              <FadeIn key={c.id} delay={i * 0.05}>
                <Glass hover className={`relative flex h-full flex-col overflow-hidden p-6 ${!isUnlocked ? 'bg-white/50' : ''}`}>
                  {!isUnlocked && (
                    <div className="pointer-events-none absolute -right-8 top-5 rotate-45 bg-gradient-to-r from-[#e8c76a] to-[#d9a53a] px-10 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">
                      Locked
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${!isUnlocked ? 'grayscale-[40%]' : ''}`} style={{ background: `${c.color}20` }}>{c.icon}</div>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isUnlocked ? 'bg-mint-soft text-[#3d9a6e]' : 'bg-[#f3f1fa] text-muted'}`}>
                      {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[11px] font-bold tracking-wide text-muted">{c.code}</div>
                    <h3 className="mt-0.5 font-display text-[16px] font-bold leading-snug text-ink">{c.name}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{c.desc}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Chip tone={c.level === 'Expert' ? 'blush' : c.level === 'Advanced' ? 'lilac' : 'sky'}>{c.level}</Chip>
                    <Chip tone="butter"><Coins size={11} /> {c.cost.toLocaleString()} pts</Chip>
                  </div>
                  <div className="mt-auto pt-4">
                    {isUnlocked ? (
                      <Link to="/app/tutor" className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold text-white shadow transition hover:-translate-y-0.5" style={{ background: c.color }}>
                        <Play size={13} /> Start course
                      </Link>
                    ) : (
                      <motion.button
                        whileTap={affordable ? { scale: 0.96 } : undefined}
                        onClick={() => unlockCourse(c.id, c.cost)}
                        disabled={!affordable}
                        className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition ${
                          affordable
                            ? 'bg-gradient-to-r from-[#e8c76a] to-[#d9a53a] text-white shadow-lg hover:-translate-y-0.5'
                            : 'cursor-not-allowed bg-[#f0eef8] text-muted'
                        }`}
                      >
                        {affordable ? <><Unlock size={13} /> Unlock for {c.cost.toLocaleString()} pts</> : <><Lock size={13} /> Need {(c.cost - balance).toLocaleString()} more pts</>}
                      </motion.button>
                    )}
                  </div>
                </Glass>
              </FadeIn>
            )
          })}
        </div>
        <FadeIn>
          <div className="mt-6 flex items-start gap-3 rounded-3xl bg-gradient-to-r from-peri-soft to-lilac-soft p-5">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-peri-deep" />
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              <strong className="font-bold text-peri-deep">How it works:</strong> earn points by completing lessons (+20), passing adaptive quizzes (+50–150 based on score),
              submitting assignments (+40), keeping your streak (+10/day) and asking the AI Tutor thoughtful questions (+5).
              Points never expire — spend them here or in the <Link to="/app/rewards" className="font-bold text-peri-deep underline decoration-peri/40 underline-offset-2">Rewards Store</Link>.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
