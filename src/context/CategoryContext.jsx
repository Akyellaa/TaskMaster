import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleTokenInvalidation, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      setCategories([...categories, response.data]);
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      return response;
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      setCategories(categories.map(cat => cat.id === id ? response.data : cat));
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      return response;
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const toggleArchive = async (id, isArchived) => {
    try {
      const response = isArchived
        ? await categoryService.unarchiveCategory(id)
        : await categoryService.archiveCategory(id);
      setCategories(categories.map(cat => cat.id === id ? response.data : cat));
      toast({
        title: 'Success',
        description: `Category ${isArchived ? 'unarchived' : 'archived'} successfully`,
      });
      return response;
    } catch (err) {
      if (err.message?.toLowerCase().includes('token') || err.response?.status === 401) {
        handleTokenInvalidation();
      }
      toast({
        title: 'Error',
        description: err.response?.data?.message || `Failed to ${isArchived ? 'unarchive' : 'archive'} category`,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    } else {
      // Clear data when not authenticated
      setCategories([]);
      setLoading(false);
      setError(null);
    }
  }, [isAuthenticated]);

  const value = {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleArchive,
    refreshCategories: fetchCategories,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}; 