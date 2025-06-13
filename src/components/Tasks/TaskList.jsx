import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/context/CategoryContext';

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      filterPriority === 'all' || task.priority === Number(filterPriority);

    const matchesCategory =
      filterCategory === 'all' ||
      (filterCategory === 'none' && !task.category) ||
      (task.category && task.category.id.toString() === filterCategory);

    const matchesTab =
      (activeTab === 'pending' && !task.completed && !task.archived) ||
      (activeTab === 'completed' && task.completed) ||
      (activeTab === 'archived' && task.archived) ||
      activeTab === 'all';

    return matchesSearch && matchesPriority && matchesCategory && matchesTab;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by sequence number first
    if (a.sequenceNumber !== b.sequenceNumber) {
      return a.sequenceNumber - b.sequenceNumber;
    }
    // Then by deadline/creation date
    const dateA = a.deadline || a.createdAt;
    const dateB = b.deadline || b.createdAt;
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select onValueChange={(value) => setFilterPriority(value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>{filterPriority === 'all' ? 'All Priorities' : `Priority: ${filterPriority}`}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="3">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="1">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setFilterCategory(value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{
                filterCategory === 'all'
                  ? 'All Categories'
                  : filterCategory === 'none'
                  ? 'No Category'
                  : `Category: ${categories.find(c => c.id.toString() === filterCategory)?.name}`
              }</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="none">No Category</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found
            </div>
          ) : (
            sortedTasks.map((task) => (
              <TaskCard
                key={task.uuid}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
