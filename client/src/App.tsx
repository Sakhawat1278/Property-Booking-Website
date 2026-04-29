import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRoute from './components/AdminRoute';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
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
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
