import React, { useState } from 'react';
import CategoryList from '@/components/Categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CategoryModal from '@/components/Categories/CategoryModal';
import Header from '@/components/Layout/Header';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const navigate = useNavigate();

  const handleViewChange = (view) => {
    setActiveView(view);
    navigate('/', { state: { activeView: view } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeView={activeView}
        setActiveView={handleViewChange}
        onAddTask={() => {}}
      />
      
      <main className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-taskmaster-primary hover:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>

        <CategoryList />

        <CategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default CategoriesPage; 