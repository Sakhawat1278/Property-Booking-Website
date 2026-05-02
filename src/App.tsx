import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyEditor from './pages/admin/AdminPropertyEditor';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLeads from './pages/admin/AdminLeads';
import AdminBuyers from './pages/admin/AdminBuyers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRoute from './components/AdminRoute';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import GlobalModal from './components/ui/GlobalModal';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          classNames: {
            toast: '!bg-white/80 !backdrop-blur-xl !border !border-white/50 !shadow-[0_8px_30px_rgb(0,0,0,0.08)] !text-[13px] !font-medium !text-[#1A1A1A] !rounded-full !px-5 !py-3',
            icon: '!text-[#FF4D00]',
          }
        }} 
      />
      <GlobalModal />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetails />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<AdminPropertyEditor />} />
            <Route path="properties/edit/:id" element={<AdminPropertyEditor />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="buyers" element={<AdminBuyers />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
