import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import JournalsPage from './pages/JournalsPage';
import JournalDetailPage from './pages/JournalDetailPage';
import JournalWritePage from './pages/JournalWritePage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function ShopLayout({ children, transparentNav }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={transparentNav} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px' } }} />
        <Routes>
          <Route path="/" element={<ShopLayout transparentNav={true}><HomePage /></ShopLayout>} />
          <Route path="/destinations" element={<ShopLayout><DestinationsPage /></ShopLayout>} />
          <Route path="/destinations/:id" element={<ShopLayout><DestinationDetailPage /></ShopLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/bookings" element={<ShopLayout><BookingsPage /></ShopLayout>} />
          <Route path="/bookings/:id" element={<ShopLayout><BookingDetailPage /></ShopLayout>} />
          <Route path="/wishlist" element={<ShopLayout><WishlistPage /></ShopLayout>} />
          <Route path="/profile" element={<ShopLayout><ProfilePage /></ShopLayout>} />
          <Route path="/journals" element={<ShopLayout><JournalsPage /></ShopLayout>} />
          <Route path="/journals/write" element={<ShopLayout><JournalWritePage /></ShopLayout>} />
          <Route path="/journals/:id" element={<ShopLayout><JournalDetailPage /></ShopLayout>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="destinations" element={<AdminDestinationsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
