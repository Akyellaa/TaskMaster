import React from 'react';
import CategoryList from '@/components/Categories/CategoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CategoryModal from '@/components/Categories/CategoryModal';

const CategoriesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
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
    </div>
  );
};

export default CategoriesPage; 