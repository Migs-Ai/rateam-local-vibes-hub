
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, isAdmin, isVendor, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/admin-login');
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (isVendor || userType === 'vendor') {
      navigate('/vendor-dashboard');
    } else {
      navigate('/user-dashboard');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">RateAm</h1>
              <span className="ml-1 text-sm text-gray-500">.com</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/vendors" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Browse Vendors
            </Link>
            <Link to="/polls" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Community Polls
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={handleDashboardClick} className="text-gray-700 hover:text-green-600">
                  {isVendor || userType === 'vendor' ? 'Vendor Dashboard' : 'My Dashboard'}
                </Button>
                {isAdmin && (
                  <Button variant="ghost" onClick={handleAdminClick} className="text-gray-700 hover:text-green-600">
                    Admin Dashboard
                  </Button>
                )}
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-700 hover:text-red-600">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-green-600">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
                </Link>
                <Button variant="outline" onClick={handleAdminClick} className="border-green-600 text-green-600 hover:bg-green-50">
                  Admin
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/vendors" 
                className="text-gray-600 hover:text-green-600 py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Vendors
              </Link>
              <Link 
                to="/polls" 
                className="text-gray-600 hover:text-green-600 py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community Polls
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-green-600 py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-green-600 py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={handleDashboardClick} 
                      className="w-full justify-start text-gray-700 hover:text-green-600"
                    >
                      {isVendor || userType === 'vendor' ? 'Vendor Dashboard' : 'My Dashboard'}
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        onClick={handleAdminClick} 
                        className="w-full justify-start text-gray-700 hover:text-green-600"
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut} 
                      className="w-full justify-start text-gray-700 hover:text-red-600"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white mb-2">
                        Sign Up
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={handleAdminClick} 
                      className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Admin
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
