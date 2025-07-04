
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VendorDirectory from "./pages/VendorDirectory";
import VendorProfile from "./pages/VendorProfile";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import VendorSignup from "./pages/VendorSignup";
import VendorLogin from "./pages/VendorLogin";
import VendorDashboard from "./pages/VendorDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import ReviewForm from "./pages/ReviewForm";
import Polls from "./pages/Polls";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vendors" element={<VendorDirectory />} />
            <Route path="/vendor/:vendorId" element={<VendorProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/vendor-signup" element={<VendorSignup />} />
            <Route path="/vendor-login" element={<VendorLogin />} />
            
            {/* Protected Vendor Routes */}
            <Route 
              path="/vendor-dashboard" 
              element={
                <ProtectedRoute requireVendor>
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected User Routes */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute requireUser>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/review/:vendorId" 
              element={
                <ProtectedRoute>
                  <ReviewForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/polls" element={<Polls />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
