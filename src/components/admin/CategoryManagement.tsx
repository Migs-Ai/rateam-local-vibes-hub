
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  UtensilsCrossed, 
  Laptop, 
  Shirt, 
  Book, 
  Car, 
  Home, 
  Heart, 
  Briefcase,
  ShoppingBag,
  Coffee,
  Gamepad2
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

const iconOptions = [
  { value: "UtensilsCrossed", label: "Food & Restaurants", icon: UtensilsCrossed },
  { value: "Laptop", label: "Tech & Gadgets", icon: Laptop },
  { value: "Shirt", label: "Fashion & Clothing", icon: Shirt },
  { value: "Book", label: "Books & Stationery", icon: Book },
  { value: "Car", label: "Transportation", icon: Car },
  { value: "Home", label: "Accommodation", icon: Home },
  { value: "Heart", label: "Health & Beauty", icon: Heart },
  { value: "Briefcase", label: "Services", icon: Briefcase },
  { value: "ShoppingBag", label: "Shopping", icon: ShoppingBag },
  { value: "Coffee", label: "Beverages", icon: Coffee },
  { value: "Gamepad2", label: "Entertainment", icon: Gamepad2 },
];

const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.icon) {
      toast({
        title: "Invalid category",
        description: "Please provide a name and select an icon.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
          icon: newCategory.icon
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setNewCategory({ name: "", description: "", icon: "" });
      setCreateDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim() || !editingCategory.icon) {
      toast({
        title: "Invalid category",
        description: "Please provide a name and select an icon.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name.trim(),
          description: editingCategory.description.trim(),
          icon: editingCategory.icon
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setEditingCategory(null);
      setEditDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return <div className="h-5 w-5 bg-gray-300 rounded" />;
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Category Management
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Food & Restaurants"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Restaurants, cafes, and food vendors"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={newCategory.icon} onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={createCategory} className="bg-green-600 hover:bg-green-700">
                    Create Category
                  </Button>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {getIconComponent(category.icon)}
                </TableCell>
                <TableCell className="font-medium">
                  {category.name}
                </TableCell>
                <TableCell>
                  {category.description || 'No description'}
                </TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Category Name</Label>
                              <Input
                                id="edit-name"
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={editingCategory.description}
                                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-icon">Icon</Label>
                              <Select value={editingCategory.icon} onValueChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  {iconOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                          <IconComponent className="h-4 w-4" />
                                          {option.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-3">
                              <Button onClick={updateCategory} className="bg-green-600 hover:bg-green-700">
                                Update Category
                              </Button>
                              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories created yet. Add your first category to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
