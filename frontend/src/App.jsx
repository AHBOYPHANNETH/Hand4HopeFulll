import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoute from './routes/AdminRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import About from './pages/About'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import EventDetail from './pages/EventDetail'
import EventVolunteer from './pages/EventVolunteer'
import Events from './pages/Events'
import GoogleCallback from './pages/GoogleCallback'
import Home from './pages/Home'
import Impact from './pages/Impact'
import Login from './pages/Login'
import MyVolunteerRequests from './pages/MyVolunteerRequests'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Overview from './pages/admin/Overview'
import EventsAdmin from './pages/admin/EventsAdmin'
import DonationsAdmin from './pages/admin/DonationsAdmin'
import ContactsAdmin from './pages/admin/ContactsAdmin'
import VolunteersAdmin from './pages/admin/VolunteersAdmin'
import UsersAdmin from './pages/admin/UsersAdmin'
import ContentAdmin from './pages/admin/ContentAdmin'

export default function App() {
  return (
    <Routes>
      {/* Admin section — dedicated layout (sidebar + topbar), separate from public site */}
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="dashboard" element={<Navigate to="../overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="events" element={<EventsAdmin />} />
        <Route path="donations" element={<DonationsAdmin />} />
        <Route path="contacts" element={<ContactsAdmin />} />
        <Route path="volunteers" element={<VolunteersAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="content" element={<ContentAdmin />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Public site — wrapped in shared Layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route
          path="events/:id/volunteer"
          element={
            <ProtectedRoute>
              <EventVolunteer />
            </ProtectedRoute>
          }
        />
        <Route path="impact" element={<Impact />} />
        <Route path="donate" element={<Donate />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/google/callback" element={<GoogleCallback />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-volunteer-requests"
          element={
            <ProtectedRoute>
              <MyVolunteerRequests />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
