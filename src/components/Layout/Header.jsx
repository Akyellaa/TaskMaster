import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, Calendar, List } from 'lucide-react';

const Header = ({ activeView, setActiveView, onAddTask }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <CheckSquare className="h-6 w-6 text-taskmaster-primary" />
        <h1 className="text-xl font-bold text-gray-900">TaskMaster</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('list')}
            className={activeView === 'list' ? 'bg-taskmaster-primary text-white' : 'text-gray-500'}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={activeView === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('calendar')}
            className={activeView === 'calendar' ? 'bg-taskmaster-primary text-white' : 'text-gray-500'}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
        
        <Button onClick={onAddTask} className="bg-taskmaster-primary hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
