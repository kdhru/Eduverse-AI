import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import PageTransition from './components/PageTransition'
import AppShell from './components/AppShell'
import './App.css'

// Student Pages
import Dashboard from './pages/student/Dashboard'
import Courses from './pages/student/Courses'
import Roadmap from './pages/student/Roadmap'
import Quizzes from './pages/student/Quizzes'
import Assignments from './pages/student/Assignments'
import Analytics from './pages/student/Analytics'
import WeakTopics from './pages/student/WeakTopics'
import Recommendations from './pages/student/Recommendations'
import Materials from './pages/student/Materials'
import Notes from './pages/student/Notes'
import CalendarPage from './pages/student/CalendarPage'
import Notifications from './pages/student/Notifications'
import SettingsPage from './pages/student/SettingsPage'
import KnowledgeGraph from './pages/student/KnowledgeGraph'
import Rewards from './pages/student/Rewards'
import Ebooks from './pages/student/Ebooks'
import Workflow from './pages/student/Workflow'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherWorkflow from './pages/teacher/TeacherDashboard'
import TeacherNotifications from './pages/teacher/TeacherDashboard'
import TeacherSettings from './pages/teacher/TeacherDashboard'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWorkflow from './pages/admin/AdminDashboard'
import AdminSettings from './pages/admin/AdminDashboard'

export default function App() {
  const location = useLocation()

  const isPublic = location.pathname === '/' || location.pathname === '/login'
  const isTeacher = location.pathname.startsWith('/teacher')
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<Auth />} />
          <Route path="/otp" element={<Auth />} />

          {/* Student Routes */}
          <Route
            element={
              <AppShell role="student">
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </AppShell>
            }
          >
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/courses" element={<Courses />} />
            <Route path="/app/tutor" element={<Courses />} />
            <Route path="/app/roadmap" element={<Roadmap />} />
            <Route path="/app/quizzes" element={<Quizzes />} />
            <Route path="/app/assignments" element={<Assignments />} />
            <Route path="/app/rewards" element={<Rewards />} />
            <Route path="/app/ebooks" element={<Ebooks />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/weak-topics" element={<WeakTopics />} />
            <Route path="/app/recommendations" element={<Recommendations />} />
            <Route path="/app/materials" element={<Materials />} />
            <Route path="/app/notes" element={<Notes />} />
            <Route path="/app/calendar" element={<CalendarPage />} />
            <Route path="/app/notifications" element={<Notifications />} />
            <Route path="/app/settings" element={<SettingsPage />} />
            <Route path="/app/knowledge-graph" element={<KnowledgeGraph />} />
            <Route path="/app/workflow" element={<Workflow />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            element={
              <AppShell role="teacher">
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </AppShell>
            }
          >
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/workflow" element={<TeacherWorkflow />} />
            <Route path="/teacher/notifications" element={<TeacherNotifications />} />
            <Route path="/teacher/settings" element={<TeacherSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <AppShell role="admin">
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </AppShell>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/workflow" element={<AdminWorkflow />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}
