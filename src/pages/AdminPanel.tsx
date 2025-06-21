
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin dashboard
    navigate('/admin', { replace: true });
  }, [navigate]);

  return null;
};

export default AdminPanel;
