// ---------- Realistic mock data for EduMind AI ----------

export const student = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@university.edu',
  avatar: 'AS',
  program: 'B.Tech Computer Science · Semester 5',
  streak: 17,
  weeklyHours: 23.5,
  performance: 87,
  engagement: 92,
  rank: 4,
}

export const subjects = [
  { id: 'py', name: 'Python Programming', code: 'CS301', progress: 82, color: '#7d88e6', icon: '🐍', modules: 12, done: 10, grade: 'A', hours: 42 },
  { id: 'dsa', name: 'Data Structures & Algorithms', code: 'CS302', progress: 64, color: '#ab96e0', icon: '🌳', modules: 14, done: 9, grade: 'B+', hours: 38 },
  { id: 'ml', name: 'Machine Learning', code: 'CS405', progress: 71, color: '#9cc5ee', icon: '🤖', modules: 10, done: 7, grade: 'A-', hours: 31 },
  { id: 'db', name: 'Database Systems', code: 'CS303', progress: 90, color: '#8fd4b8', icon: '🗄️', modules: 8, done: 7, grade: 'A', hours: 26 },
  { id: 'os', name: 'Operating Systems', code: 'CS304', progress: 55, color: '#f0b9cf', icon: '⚙️', modules: 11, done: 6, grade: 'B', hours: 22 },
  { id: 'cn', name: 'Computer Networks', code: 'CS306', progress: 47, color: '#f2d491', icon: '🌐', modules: 9, done: 4, grade: 'B-', hours: 18 },
]

export const weeklyStudy = [
  { day: 'Mon', hours: 3.5, quizzes: 2 },
  { day: 'Tue', hours: 4.2, quizzes: 3 },
  { day: 'Wed', hours: 2.8, quizzes: 1 },
  { day: 'Thu', hours: 5.1, quizzes: 4 },
  { day: 'Fri', hours: 3.9, quizzes: 2 },
  { day: 'Sat', hours: 2.2, quizzes: 1 },
  { day: 'Sun', hours: 1.8, quizzes: 0 },
]

export const monthlyProgress = [
  { month: 'Aug', score: 62, avg: 58 },
  { month: 'Sep', score: 68, avg: 61 },
  { month: 'Oct', score: 74, avg: 63 },
  { month: 'Nov', score: 79, avg: 66 },
  { month: 'Dec', score: 83, avg: 68 },
  { month: 'Jan', score: 87, avg: 70 },
]

export const radarData = [
  { skill: 'Problem Solving', score: 86 },
  { skill: 'Theory', score: 74 },
  { skill: 'Coding', score: 91 },
  { skill: 'Consistency', score: 82 },
  { skill: 'Speed', score: 68 },
  { skill: 'Retention', score: 77 },
]

export const quizAccuracy = [
  { subject: 'Python', accuracy: 91 },
  { subject: 'DSA', accuracy: 72 },
  { subject: 'ML', accuracy: 78 },
  { subject: 'DBMS', accuracy: 88 },
  { subject: 'OS', accuracy: 65 },
  { subject: 'CN', accuracy: 59 },
]

export const timeSplit = [
  { name: 'Video Lectures', value: 32, color: '#7d88e6' },
  { name: 'Practice', value: 26, color: '#ab96e0' },
  { name: 'Reading', value: 18, color: '#9cc5ee' },
  { name: 'AI Tutor', value: 14, color: '#8fd4b8' },
  { name: 'Revision', value: 10, color: '#f0b9cf' },
]

export const weakTopics = [
  { topic: 'Dynamic Programming', subject: 'DSA', mastery: 42, attempts: 8, trend: 'up', impact: 'High', eta: '2 weeks' },
  { topic: 'TCP/IP Congestion Control', subject: 'Networks', mastery: 38, attempts: 5, trend: 'flat', impact: 'High', eta: '1 week' },
  { topic: 'Process Scheduling', subject: 'OS', mastery: 51, attempts: 6, trend: 'up', impact: 'Medium', eta: '1 week' },
  { topic: 'Backpropagation Math', subject: 'ML', mastery: 55, attempts: 4, trend: 'up', impact: 'Medium', eta: '4 days' },
  { topic: 'B+ Tree Indexing', subject: 'DBMS', mastery: 60, attempts: 3, trend: 'down', impact: 'Low', eta: '3 days' },
  { topic: 'Decorators & Closures', subject: 'Python', mastery: 63, attempts: 4, trend: 'up', impact: 'Low', eta: '3 days' },
]

export const recommendations = [
  { type: 'topic', title: 'Master Dynamic Programming', reason: 'Your last 3 DSA quizzes show 42% mastery on DP. It has high weight in your Semester 5 assessment.', action: 'Start guided path', icon: '🎯', priority: 'High' },
  { type: 'video', title: 'Watch: "Graphs Made Simple" (24 min)', reason: 'Students with your learning profile improved graph scores by 31% after this lecture.', action: 'Watch now', icon: '🎬', priority: 'High' },
  { type: 'practice', title: '15 adaptive questions on TCP/IP', reason: 'Spaced-repetition window opens today — recall probability at 46%.', action: 'Practice', icon: '✍️', priority: 'Medium' },
  { type: 'book', title: 'Read Ch. 6 — "Operating System Concepts"', reason: 'Covers Process Scheduling gaps identified in Quiz #23.', action: 'Open reader', icon: '📖', priority: 'Medium' },
  { type: 'goal', title: 'Daily goal: 45 min focused study', reason: 'You hit your goal 5 of 7 days last week. One more streak day unlocks the "Fortnight Focus" badge.', action: 'Set reminder', icon: '⚡', priority: 'Low' },
  { type: 'peer', title: 'Join DSA study circle · Thu 6 PM', reason: '4 classmates with complementary strengths are revising DP together.', action: 'Join circle', icon: '👥', priority: 'Low' },
]

export const upcomingQuizzes = [
  { title: 'Dynamic Programming — Adaptive Set', subject: 'DSA', due: 'Today · 6:00 PM', questions: 15, difficulty: 'Adaptive', color: '#ab96e0' },
  { title: 'Neural Networks Basics', subject: 'ML', due: 'Tomorrow · 10:00 AM', questions: 12, difficulty: 'Medium', color: '#9cc5ee' },
  { title: 'SQL Joins & Indexing', subject: 'DBMS', due: 'Fri · 2:00 PM', questions: 10, difficulty: 'Easy', color: '#8fd4b8' },
]

export const recentActivity = [
  { icon: '✅', text: 'Completed quiz "Recursion & Backtracking" — scored 86%', time: '2 h ago', color: '#8fd4b8' },
  { icon: '💬', text: 'Asked AI Tutor 7 questions on Bellman-Ford algorithm', time: '4 h ago', color: '#7d88e6' },
  { icon: '📄', text: 'Uploaded "ML_Unit3_Notes.pdf" to Knowledge Center', time: 'Yesterday', color: '#ab96e0' },
  { icon: '🏅', text: 'Earned badge — "Two-Week Streak"', time: 'Yesterday', color: '#f2d491' },
  { icon: '📈', text: 'DBMS mastery moved from 84% → 90%', time: '2 days ago', color: '#9cc5ee' },
]

export const assignments = [
  { title: 'Implement LRU Cache with O(1) operations', subject: 'DSA', detail: 'Hashmap + doubly linked list · 20 pts', due: 'Jan 24', status: 'overdue', progress: 60, points: 20, color: '#ab96e0', icon: '🧩', grade: '' },
  { title: 'Train a CNN on CIFAR-10 (report + notebook)', subject: 'ML', detail: 'PyTorch · report + notebook · 30 pts', due: 'Jan 27', status: 'pending', progress: 0, points: 30, color: '#9cc5ee', icon: '🧠', grade: '' },
  { title: 'Normalize the library schema to 3NF', subject: 'DBMS', detail: 'ER diagram + SQL DDL · 15 pts', due: 'Jan 22', status: 'submitted', progress: 100, points: 15, color: '#8fd4b8', icon: '🗄️', grade: 'A (14/15)' },
  { title: 'Multi-threaded producer–consumer in C', subject: 'OS', detail: 'Semaphores + bounded buffer · 25 pts', due: 'Jan 30', status: 'pending', progress: 35, points: 25, color: '#f2d491', icon: '⚙️', grade: '' },
  { title: 'Socket programming: mini chat server', subject: 'Networks', detail: 'TCP sockets · select() multiplexing · 20 pts', due: 'Feb 2', status: 'pending', progress: 0, points: 20, color: '#f0b9cf', icon: '🌐', grade: '' },
]

export const materials = [
  { name: 'ML_Unit3_Backpropagation.pdf', type: 'PDF', size: '4.2 MB', category: 'Lecture Notes', subject: 'ML', uploaded: 'Jan 18', pages: 42, indexed: true },
  { name: 'DSA_DynamicProgramming_Slides.pptx', type: 'PPT', size: '8.7 MB', category: 'Slides', subject: 'DSA', uploaded: 'Jan 16', pages: 64, indexed: true },
  { name: 'DBMS_Previous_Year_2024.pdf', type: 'PDF', size: '1.1 MB', category: 'Previous Papers', subject: 'DBMS', uploaded: 'Jan 15', pages: 12, indexed: true },
  { name: 'OS_Galvin_Ch6_Scheduling.pdf', type: 'Book', size: '12.4 MB', category: 'Books', subject: 'OS', uploaded: 'Jan 12', pages: 88, indexed: true },
  { name: 'Networks_Lecture12_Transcript.docx', type: 'DOC', size: '340 KB', category: 'Transcripts', subject: 'Networks', uploaded: 'Jan 10', pages: 9, indexed: false },
  { name: 'Python_OOP_HandwrittenNotes.pdf', type: 'Notes', size: '2.8 MB', category: 'Notes', subject: 'Python', uploaded: 'Jan 8', pages: 18, indexed: true },
  { name: 'ML_Question_Bank_300Q.pdf', type: 'PDF', size: '3.5 MB', category: 'Previous Papers', subject: 'ML', uploaded: 'Jan 6', pages: 54, indexed: true },
  { name: 'CN_TopDown_Kurose_Ch3.pdf', type: 'Book', size: '15.2 MB', category: 'Books', subject: 'Networks', uploaded: 'Jan 4', pages: 102, indexed: true },
]

export const notifications = [
  { id: 1, kind: 'quiz', icon: '⚡', color: '#f2d491', title: 'Quiz reminder', body: '"Dynamic Programming — Adaptive Set" is due today at 6:00 PM.', time: '35 min ago', unread: true, read: false },
  { id: 2, kind: 'ai', icon: '✨', color: '#7d88e6', title: 'AI recommendation', body: 'Your recall window for TCP/IP opens now — 15 adaptive questions are ready.', time: '1 h ago', unread: true, read: false },
  { id: 3, kind: 'badge', icon: '🏅', color: '#8fd4b8', title: 'Achievement unlocked', body: 'You earned "Two-Week Streak" for 14 consecutive study days.', time: '3 h ago', unread: true, read: false },
  { id: 4, kind: 'assignment', icon: '📎', color: '#ab96e0', title: 'Assignment deadline', body: '"Implement LRU Cache" is due in 2 days. Current progress: 60%.', time: '5 h ago', unread: false, read: true },
  { id: 5, kind: 'course', icon: '📘', color: '#9cc5ee', title: 'Course update', body: 'Prof. Mehta added "Week 9 — Graph Algorithms" to CS302.', time: 'Yesterday', unread: false, read: true },
  { id: 6, kind: 'ai', icon: '📈', color: '#7d88e6', title: 'Weekly insight ready', body: 'Your performance report for Jan 13–19 has been generated by the Performance Agent.', time: 'Yesterday', unread: false, read: true },
]

export const heatmap: number[][] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 18 }, (_, w) => {
    const seed = Math.sin(d * 13.37 + w * 7.77) * 0.5 + 0.5
    return Math.round(seed * 4)
  }),
)

// ---------- Quiz engine ----------
export type QuizQuestion = {
  id: number
  kind: 'mcq' | 'fill' | 'tf' | 'code' | 'subjective'
  question: string
  options?: string[]
  answer: string
  explanation: string
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  code?: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1, kind: 'mcq', topic: 'Memoization', difficulty: 'Easy',
    question: 'What is the primary purpose of memoization in dynamic programming?',
    options: ['Reduce space complexity', 'Cache results of subproblems to avoid recomputation', 'Sort subproblems by size', 'Convert recursion into iteration automatically'],
    answer: 'Cache results of subproblems to avoid recomputation',
    explanation: 'Memoization stores results of expensive function calls so overlapping subproblems are computed only once, typically reducing exponential time to polynomial.',
  },
  {
    id: 2, kind: 'tf', topic: 'Optimal Substructure', difficulty: 'Easy',
    question: 'Every problem with overlapping subproblems automatically has optimal substructure.',
    options: ['True', 'False'], answer: 'False',
    explanation: 'Overlapping subproblems and optimal substructure are independent properties. DP requires both; a problem can overlap without its optimum being composable from sub-optima.',
  },
  {
    id: 3, kind: 'fill', topic: 'Knapsack', difficulty: 'Medium',
    question: 'The time complexity of the classic 0/1 Knapsack DP with n items and capacity W is O(____).',
    answer: 'nW',
    explanation: 'The DP table has n·W states and each is filled in O(1), giving O(nW) — pseudo-polynomial because W is a numeric value, not input length.',
  },
  {
    id: 4, kind: 'code', topic: 'Fibonacci DP', difficulty: 'Medium',
    question: 'Complete the bottom-up Fibonacci: what expression fills the blank?',
    code: 'def fib(n):\n    dp = [0, 1] + [0] * (n - 1)\n    for i in range(2, n + 1):\n        dp[i] = ______\n    return dp[n]',
    options: ['dp[i-1] + dp[i-2]', 'dp[i] + dp[i-1]', 'dp[i-1] * dp[i-2]', 'dp[n-1] + dp[n-2]'],
    answer: 'dp[i-1] + dp[i-2]',
    explanation: 'Each Fibonacci number is the sum of the two preceding values already stored in the table: dp[i] = dp[i-1] + dp[i-2].',
  },
  {
    id: 5, kind: 'subjective', topic: 'LCS', difficulty: 'Hard',
    question: 'In 2–3 sentences, explain why the Longest Common Subsequence problem cannot be solved greedily.',
    answer: 'greedy fails because local character matches can block longer global subsequences; LCS requires comparing include/exclude decisions across all prefixes, which is exactly what the DP recurrence does',
    explanation: 'A greedy match of the first common character can eliminate a longer subsequence that skips it. LCS exhibits optimal substructure over prefix pairs, so the DP recurrence LCS(i,j) must consider both matching and skipping — a global decision greedy cannot make.',
  },
]

// ---------- Teacher ----------
export const teacherStudents = [
  { name: 'Aarav Sharma', roll: 'CS21B042', initials: 'AS', color: '#7d88e6', performance: 87, attendance: 94, predicted: 91, risk: 'Low', trend: '+5%' },
  { name: 'Diya Patel', roll: 'CS21B018', initials: 'DP', color: '#ab96e0', performance: 92, attendance: 97, predicted: 94, risk: 'Low', trend: '+2%' },
  { name: 'Rohan Gupta', roll: 'CS21B055', initials: 'RG', color: '#f0b9cf', performance: 61, attendance: 78, predicted: 54, risk: 'High', trend: '-8%' },
  { name: 'Sneha Iyer', roll: 'CS21B029', initials: 'SI', color: '#9cc5ee', performance: 78, attendance: 88, predicted: 81, risk: 'Medium', trend: '+3%' },
  { name: 'Kabir Malhotra', roll: 'CS21B011', initials: 'KM', color: '#f2d491', performance: 55, attendance: 71, predicted: 49, risk: 'High', trend: '-4%' },
  { name: 'Ananya Rao', roll: 'CS21B037', initials: 'AR', color: '#8fd4b8', performance: 84, attendance: 91, predicted: 89, risk: 'Low', trend: '+6%' },
  { name: 'Vivaan Joshi', roll: 'CS21B049', initials: 'VJ', color: '#7d88e6', performance: 70, attendance: 82, predicted: 73, risk: 'Medium', trend: '+1%' },
  { name: 'Ishita Nair', roll: 'CS21B024', initials: 'IN', color: '#ab96e0', performance: 89, attendance: 95, predicted: 92, risk: 'Low', trend: '+4%' },
]

export const classPerformance = [
  { week: 'W1', avg: 64, top: 88, bottom: 41 },
  { week: 'W2', avg: 66, top: 90, bottom: 44 },
  { week: 'W3', avg: 65, top: 89, bottom: 42 },
  { week: 'W4', avg: 69, top: 92, bottom: 47 },
  { week: 'W5', avg: 72, top: 93, bottom: 50 },
  { week: 'W6', avg: 74, top: 95, bottom: 53 },
  { week: 'W7', avg: 76, top: 96, bottom: 55 },
  { week: 'W8', avg: 79, top: 97, bottom: 58 },
]

// ---------- Admin ----------
export const adminUsers = [
  { name: 'Aarav Sharma', email: 'aarav.s@university.edu', initials: 'AS', color: '#7d88e6', role: 'Student', dept: 'CSE', status: 'Active', lastActive: '2 min ago' },
  { name: 'Prof. Ritu Mehta', email: 'ritu.mehta@university.edu', initials: 'RM', color: '#ab96e0', role: 'Teacher', dept: 'CSE', status: 'Active', lastActive: '15 min ago' },
  { name: 'Diya Patel', email: 'diya.p@university.edu', initials: 'DP', color: '#9cc5ee', role: 'Student', dept: 'CSE', status: 'Active', lastActive: '1 h ago' },
  { name: 'Dr. Sanjay Kulkarni', email: 's.kulkarni@university.edu', initials: 'SK', color: '#8fd4b8', role: 'Teacher', dept: 'ECE', status: 'Active', lastActive: '3 h ago' },
  { name: 'Meera Krishnan', email: 'meera.k@university.edu', initials: 'MK', color: '#f0b9cf', role: 'Admin', dept: 'IT Services', status: 'Active', lastActive: 'Now' },
  { name: 'Rohan Gupta', email: 'rohan.g@university.edu', initials: 'RG', color: '#f2d491', role: 'Student', dept: 'CSE', status: 'Suspended', lastActive: '3 days ago' },
  { name: 'Prof. Alan D\'Souza', email: 'alan.d@university.edu', initials: 'AD', color: '#7d88e6', role: 'Teacher', dept: 'Mathematics', status: 'Invited', lastActive: '—' },
]

export const aiUsage = [
  { day: 'Mon', tutor: 1240, quiz: 620, rag: 890 },
  { day: 'Tue', tutor: 1380, quiz: 710, rag: 940 },
  { day: 'Wed', tutor: 1520, quiz: 680, rag: 1020 },
  { day: 'Thu', tutor: 1690, quiz: 820, rag: 1150 },
  { day: 'Fri', tutor: 1450, quiz: 760, rag: 980 },
  { day: 'Sat', tutor: 890, quiz: 410, rag: 560 },
  { day: 'Sun', tutor: 720, quiz: 350, rag: 480 },
]

export const serverMetrics = [
  { name: 'API Gateway CPU', icon: 'cpu', value: 34, detail: 'FastAPI · 4 replicas · p50 42 ms' },
  { name: 'LLM Inference GPU', icon: 'cpu', value: 71, detail: 'Llama 3 70B · 2× A100 · p50 820 ms' },
  { name: 'FAISS Vector Store', icon: 'db', value: 48, detail: '2.4M embeddings · p50 110 ms' },
  { name: 'Neo4j Knowledge Graph', icon: 'db', value: 82, detail: 'Degraded — traversal 260 ms > SLO' },
  { name: 'PostgreSQL Storage', icon: 'disk', value: 39, detail: 'Primary + replica · p50 8 ms' },
  { name: 'Redis Cache Memory', icon: 'db', value: 22, detail: '34% hit-rate · 1.2 ms' },
]

export const systemLogs = [
  { level: 'INFO', time: '14:32:08', msg: '[orchestrator] Routed request #48213 → TutorAgent (confidence 0.94)' },
  { level: 'INFO', time: '14:31:52', msg: '[rag-engine] Indexed 42 chunks from ML_Unit3_Backpropagation.pdf' },
  { level: 'WARN', time: '14:30:11', msg: '[neo4j] Query latency 260ms exceeds 200ms SLO on traversal' },
  { level: 'INFO', time: '14:29:47', msg: '[quiz-agent] Generated 15 adaptive items for CS21B042 (θ=0.62)' },
  { level: 'ERROR', time: '14:28:33', msg: '[llm-inference] Retry 1/3 — GPU pool saturated, queued 2.1s' },
  { level: 'INFO', time: '14:25:00', msg: '[xgboost-perf] Risk predictions refreshed for 1,284 students' },
  { level: 'INFO', time: '14:22:18', msg: '[auth] OTP verified · session issued' },
]

// ---------- Knowledge Graph ----------
export type GraphNode = {
  id: string
  label: string
  mastery: number
  children?: GraphNode[]
}

export const knowledgeGraph: GraphNode = {
  id: 'python', label: 'Python', mastery: 82,
  children: [
    {
      id: 'variables', label: 'Variables', mastery: 95,
      children: [
        { id: 'types', label: 'Data Types', mastery: 92 },
        { id: 'scope', label: 'Scope & Namespaces', mastery: 78 },
        { id: 'mutability', label: 'Mutability', mastery: 84 },
      ],
    },
    {
      id: 'loops', label: 'Loops', mastery: 88,
      children: [
        { id: 'for', label: 'for / range', mastery: 94 },
        { id: 'while', label: 'while', mastery: 90 },
        { id: 'comprehension', label: 'Comprehensions', mastery: 72 },
      ],
    },
    {
      id: 'functions', label: 'Functions', mastery: 76,
      children: [
        { id: 'args', label: 'args / kwargs', mastery: 81 },
        { id: 'lambda', label: 'Lambdas', mastery: 74 },
        { id: 'decorators', label: 'Decorators', mastery: 63 },
        { id: 'closures', label: 'Closures', mastery: 58 },
      ],
    },
    {
      id: 'oop', label: 'OOP', mastery: 69,
      children: [
        { id: 'classes', label: 'Classes & Objects', mastery: 80 },
        { id: 'inheritance', label: 'Inheritance', mastery: 71 },
        { id: 'polymorphism', label: 'Polymorphism', mastery: 62 },
        { id: 'dunder', label: 'Magic Methods', mastery: 54 },
      ],
    },
    {
      id: 'files', label: 'File Handling', mastery: 85,
      children: [
        { id: 'io', label: 'Read / Write', mastery: 91 },
        { id: 'context', label: 'Context Managers', mastery: 77 },
        { id: 'serialization', label: 'JSON & Pickle', mastery: 83 },
      ],
    },
  ],
}

// ---------- Roadmap ----------
export const roadmap = [
  {
    phase: 'Semester Kickoff', period: 'Week 1–2', status: 'done', icon: '🎓',
    detail: 'Diagnostic assessment across 6 subjects. Baseline mastery mapped to the knowledge graph.',
    items: ['Diagnostic quiz (48 items)', 'Learning-style profiling', 'Goal setting with AI mentor'],
  },
  {
    phase: 'Core Subjects', period: 'Week 3–7', status: 'done', icon: '📚',
    detail: 'Foundation concepts across Python, DSA, and DBMS with adaptive pacing.',
    items: ['Python OOP & file handling', 'Arrays, linked lists, trees', 'SQL & normalization'],
  },
  {
    phase: 'Advanced Concepts', period: 'Week 8–11', status: 'active', icon: '🧠',
    detail: 'You are here — Dynamic Programming, neural networks, and OS scheduling with weak-topic reinforcement.',
    items: ['Dynamic Programming (in progress · 42%)', 'Backpropagation math', 'Process scheduling'],
  },
  {
    phase: 'Guided Practice', period: 'Week 12–13', status: 'upcoming', icon: '✍️',
    detail: 'High-volume adaptive drills targeting your lowest-mastery graph nodes.',
    items: ['300 adaptive questions', 'Timed coding sprints', 'Peer-review sessions'],
  },
  {
    phase: 'Spaced Revision', period: 'Week 14–15', status: 'upcoming', icon: '🔁',
    detail: 'AI schedules recall sessions using your personal forgetting-curve model.',
    items: ['Spaced flashcards', 'Concept-map rebuilding', 'Previous-year papers'],
  },
  {
    phase: 'Final Assessment', period: 'Week 16', status: 'upcoming', icon: '🏁',
    detail: 'Mock exams with SHAP-explained score predictions and last-mile focus areas.',
    items: ['2 full mock exams', 'Prediction: 88 ± 3%', 'Exam-day strategy brief'],
  },
]

export const calendarEvents: Record<number, { label: string; color: string }[]> = {
  3: [{ label: 'DSA Quiz', color: '#ab96e0' }],
  6: [{ label: 'ML Lecture', color: '#9cc5ee' }],
  9: [{ label: 'DBMS Assignment due', color: '#8fd4b8' }],
  12: [{ label: 'Study circle', color: '#f0b9cf' }],
  15: [{ label: 'OS Lab', color: '#f2d491' }, { label: 'AI mentor check-in', color: '#7d88e6' }],
  18: [{ label: 'Networks Quiz', color: '#f2d491' }],
  21: [{ label: 'Mock test', color: '#7d88e6' }],
  24: [{ label: 'LRU Cache due', color: '#ab96e0' }],
  27: [{ label: 'CNN report due', color: '#9cc5ee' }],
}

// ---------- Gamification: locked premium courses ----------
export const lockedCourses = [
  { id: 'dl', name: 'Deep Learning Specialization', code: 'CS401', level: 'Advanced', icon: '🤖', color: '#7d88e6', cost: 500, desc: 'Transformers, attention, GANs and diffusion models with PyTorch labs.' },
  { id: 'sys', name: 'System Design Masterclass', code: 'CS410', level: 'Advanced', icon: '🏗️', color: '#ab96e0', cost: 750, desc: 'Design scalable systems — caching, sharding, queues, consensus.' },
  { id: 'cloud', name: 'Cloud & DevOps with AWS', code: 'CS415', level: 'Intermediate', icon: '☁️', color: '#9cc5ee', cost: 400, desc: 'Docker, Kubernetes, CI/CD pipelines and infrastructure as code.' },
  { id: 'cp', name: 'Competitive Programming Pro', code: 'CS420', level: 'Expert', icon: '⚔️', color: '#f0b9cf', cost: 900, desc: 'Advanced graph theory, segment trees, and contest strategies.' },
  { id: 'genai', name: 'Generative AI & LLM Engineering', code: 'CS430', level: 'Expert', icon: '✨', color: '#8fd4b8', cost: 1200, desc: 'RAG pipelines, fine-tuning, agents and production LLM systems.' },
  { id: 'sec', name: 'Cybersecurity Essentials', code: 'CS425', level: 'Intermediate', icon: '🛡️', color: '#f2d491', cost: 350, desc: 'Web security, cryptography basics and ethical hacking labs.' },
]
