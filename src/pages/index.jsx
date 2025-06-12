import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import Header from '@/components/Layout/Header';
import TaskList from '@/components/Tasks/TaskList';
import TaskForm from '@/components/Tasks/TaskForm';
import CalendarView from '@/components/Calendar/CalendarView';
import StatisticCard from '@/components/Dashboard/StatisticCard';
import { CheckCircle, Clock, ListChecks, AlertTriangle } from 'lucide-react';
import { useToast } from '/hooks/use-toast';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

const Index = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask, 
    getTasksByPriority,
    getDueReminders,
  } = useTaskContext();
  
  const [activeView, setActiveView] = useState('list');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(undefined);
  const { toast } = useToast();

  const filteredTasks = activeView === 'calendar' 
    ? tasks.filter(task => isToday(new Date(task.dueDate))) 
    : tasks;

  const completedToday = tasks.filter(task => task.isCompleted && isToday(new Date(task.dueDate))).length;
  const completedThisWeek = tasks.filter(task => task.isCompleted && isThisWeek(new Date(task.dueDate))).length;
  const completedThisMonth = tasks.filter(task => task.isCompleted && isThisMonth(new Date(task.dueDate))).length;
  const highPriorityTasks = getTasksByPriority('high').length;

  useEffect(() => {
    const checkReminders = () => {
      const dueReminders = getDueReminders();
      
      dueReminders.forEach(task => {
        toast({
          title: 'Task Reminder',
          description: `"${task.title}" is due on ${format(new Date(task.dueDate), 'PPP')} at ${format(new Date(task.dueDate), 'HH:mm')}`,
          variant: 'default',
        });
      });
    };
    
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [getDueReminders, toast]);

  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: 'Task updated',
        description: `"${taskData.title}" has been updated successfully.`,
      });
    } else {
      addTask(taskData);
      toast({
        title: 'Task created',
        description: `"${taskData.title}" has been added to your tasks.`,
      });
    }
  };

  const handleTaskDelete = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    deleteTask(id);
    toast({
      title: 'Task deleted',
      description: `"${taskToDelete?.title}" has been deleted.`,
      variant: 'destructive',
    });
  };

  const handleTaskComplete = (id) => {
    completeTask(id);
    const task = tasks.find(task => task.id === id);
    if (task) {
      toast({
        title: task.isCompleted ? 'Task reopened' : 'Task completed',
        description: `"${task.title}" has been ${task.isCompleted ? 'marked as incomplete' : 'marked as complete'}.`,
      });
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const filteredTasks = tasks.filter(task => 
      format(new Date(task.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    toast({
      title: `Tasks for ${format(date, 'MMMM d, yyyy')}`,
      description: `${filteredTasks.length} tasks scheduled for this day.`,
    });
  };

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
              onCompleteTask={handleTaskComplete}
              onEditTask={handleTaskEdit}
              onDeleteTask={handleTaskDelete}
            />
          ) : (
            <CalendarView 
              tasks={tasks} 
              onSelectDate={handleDateSelect} 
            />
          )}
        </div>
      </main>

      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Index;