
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Store, MessageSquare, BarChart3, Folder, Activity } from "lucide-react";

const AdminTabsNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-6">
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Users
      </TabsTrigger>
      <TabsTrigger value="vendors" className="flex items-center gap-2">
        <Store className="h-4 w-4" />
        Vendors
      </TabsTrigger>
      <TabsTrigger value="reviews" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Reviews
      </TabsTrigger>
      <TabsTrigger value="polls" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Polls
      </TabsTrigger>
      <TabsTrigger value="categories" className="flex items-center gap-2">
        <Folder className="h-4 w-4" />
        Categories
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsNavigation;
