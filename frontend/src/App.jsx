import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminRoute from './routes/AdminRoute'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import EventDetail from './pages/EventDetail'
import Events from './pages/Events'
import GoogleCallback from './pages/GoogleCallback'
import Home from './pages/Home'
import Impact from './pages/Impact'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="impact" element={<Impact />} />
        <Route path="donate" element={<Donate />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/google/callback" element={<GoogleCallback />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
