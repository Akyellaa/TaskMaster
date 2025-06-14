import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus, Calendar, List, LogOut, Tag, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CategoryModal from '../Categories/CategoryModal';
import NotificationPopup from '../ui/NotificationPopup';

const Header = ({ activeView, setActiveView, onAddTask }) => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-taskmaster-primary" />
          <h1 className="text-xl font-bold text-gray-900">TaskMaster</h1>
        </Link>
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
        
        <Button asChild variant="outline" className="text-gray-500">
          <Link to="/categories">
            <Tag className="h-4 w-4 mr-2" />
            Categories
          </Link>
        </Button>

        <Button onClick={onAddTask} className="bg-taskmaster-primary hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          {isNotificationOpen && (
            <NotificationPopup onClose={() => setIsNotificationOpen(false)} />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 border rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </header>
  );
};

export default Header;
