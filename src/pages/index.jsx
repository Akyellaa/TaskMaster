import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import Header from '@/components/Layout/Header';
import TaskList from '@/components/Tasks/TaskList';
import TaskForm from '@/components/Tasks/TaskForm';
import CalendarView from '@/components/Calendar/CalendarView';
import StatisticCard from '@/components/Dashboard/StatisticCard';
import { CheckCircle, Clock, ListChecks, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

const Index = () => {
  const { 
    regularTasks,
    recurringTasks,
    addTask, 
    updateTask, 
    deleteTask,
    getTasksByPriority,
    isLoading,
    error
  } = useTaskContext();
  
  const [activeView, setActiveView] = useState('list');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(undefined);
  const { toast } = useToast();

  // Combine regular and recurring tasks
  const allTasks = [...regularTasks, ...recurringTasks];

  const filteredTasks = activeView === 'calendar' 
    ? allTasks.filter(task => {
        const taskDate = task.deadline || task.recurrenceDays;
        if (!taskDate) return false;
        return isToday(new Date(taskDate));
      })
    : allTasks;

  const completedToday = allTasks.filter(task => {
    const isCompleted = task.completed;
    const taskDate = task.deadline || task.recurrenceDays;
    return isCompleted && taskDate && isToday(new Date(taskDate));
  }).length;

  const completedThisWeek = allTasks.filter(task => {
    const isCompleted = task.completed;
    const taskDate = task.deadline || task.recurrenceDays;
    return isCompleted && taskDate && isThisWeek(new Date(taskDate));
  }).length;

  const completedThisMonth = allTasks.filter(task => {
    const isCompleted = task.completed;
    const taskDate = task.deadline || task.recurrenceDays;
    return isCompleted && taskDate && isThisMonth(new Date(taskDate));
  }).length;

  const highPriorityTasks = allTasks.filter(task => task.priority === 3).length;

  const handleTaskSubmit = async (taskData) => {
    const response = await addTask(taskData);
    
    if (response.success) {
      toast({
        title: 'Task created',
        description: response.message || `"${taskData.title}" has been added to your tasks.`,
      });
      setIsTaskFormOpen(false);
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const handleTaskDelete = async (uuid) => {
    const taskToDelete = allTasks.find(task => task.uuid === uuid);
    const response = await deleteTask(uuid);

    if (response.success) {
      toast({
        title: 'Task deleted',
        description: `"${taskToDelete?.title}" has been deleted.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleTaskEdit = async (task) => {
    if (task) {
      setEditingTask(task);
      setIsTaskFormOpen(true);
      return;
    }
  };

  const handleTaskUpdate = async (taskData) => {
    if (!editingTask) return;

    const response = await updateTask(editingTask.uuid, taskData);

    if (response.success) {
      toast({
        title: 'Task updated',
        description: `"${editingTask.title}" has been updated successfully.`,
      });
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const tasksForDate = allTasks.filter(task => {
      const taskDate = task.deadline || task.recurrenceDays;
      if (!taskDate) return false;
      return format(new Date(taskDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
    
    toast({
      title: `Tasks for ${format(date, 'MMMM d, yyyy')}`,
      description: `${tasksForDate.length} tasks scheduled for this day.`,
    });
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onAddTask={() => {
          setEditingTask(undefined);
          setIsTaskFormOpen(true);
        }} 
      />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatisticCard
            title="Completed Today"
            value={completedToday}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatisticCard
            title="Completed This Week"
            value={completedThisWeek}
            icon={<Clock className="h-6 w-6" />}
          />
          <StatisticCard
            title="Completed This Month"
            value={completedThisMonth}
            icon={<ListChecks className="h-6 w-6" />}
          />
          <StatisticCard
            title="High Priority Tasks"
            value={highPriorityTasks}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeView === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              onEditTask={handleTaskEdit}
              onDeleteTask={handleTaskDelete}
            />
          ) : (
            <CalendarView 
              tasks={allTasks} 
              onSelectDate={handleDateSelect} 
            />
          )}
        </div>
      </main>

      <TaskForm
        open={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={editingTask ? handleTaskUpdate : handleTaskSubmit}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Index;