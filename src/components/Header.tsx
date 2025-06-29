import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
const Header = () => {
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/admin-login');
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">RateAm</h1>
              <span className="ml-1 text-sm text-gray-500">.com</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/vendors" className="text-gray-600 hover:text-gray-900">
              Browse Vendors
            </Link>
            <Link to="/polls" className="text-gray-600 hover:text-gray-900">
              Polls
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? <>
                <Link to="/user-dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {isAdmin && <Button variant="ghost" onClick={handleAdminClick}>Admin Dashboard</Button>}
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </> : <>
                <Link to="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
                <Button variant="outline" onClick={handleAdminClick}>
                  Admin
                </Button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;