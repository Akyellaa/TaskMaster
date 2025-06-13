import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import Header from '@/components/Layout/Header';
import TaskList from '@/components/Tasks/TaskList';
import TaskForm from '@/components/Tasks/TaskForm';
import CalendarView from '@/components/Calendar/CalendarView';
import StatisticCard from '@/components/Dashboard/StatisticCard';
import { CheckCircle, Clock, ListChecks, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isThisWeek, isThisMonth, isSameDay, parseISO, startOfDay } from 'date-fns';
import { useLocation } from 'react-router-dom';

// Map day names to numbers
const DAY_MAP = {
  'SUNDAY': 0,
  'MONDAY': 1,
  'TUESDAY': 2,
  'WEDNESDAY': 3,
  'THURSDAY': 4,
  'FRIDAY': 5,
  'SATURDAY': 6
};

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
  
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.state?.activeView || 'list');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(undefined);
  const { toast } = useToast();

  // Update activeView when navigating back from categories
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  // Filter tasks for today
  const getTodaysTasks = () => {
    const today = startOfDay(new Date());
    const todayDayName = Object.keys(DAY_MAP).find(
      key => DAY_MAP[key] === today.getDay()
    );
    
    // Filter regular tasks
    const todaysRegularTasks = regularTasks.filter(task => {
      if (!task?.deadline) return false;
      // Don't show archived tasks
      if (task?.archived) return false;
      // Compare dates using startOfDay to ignore time
      // return isSameDay(parseISO(task.deadline), today);
      return true
    });

    // Filter recurring tasks
    const todaysRecurringTasks = recurringTasks.filter(task => {
      if (!task?.recurrenceDays || task?.archived) return false;
      // Check if today's day name is in the recurrence days
      return task.recurrenceDays.includes(todayDayName);
    }).map(task => {
      // Check if task is done today using doneDates
      const isDoneToday = task?.doneDates?.some(date => 
        isSameDay(parseISO(date), today)
      ) || false;
      
      return {
        ...task,
        completed: isDoneToday // Override completed status based on today's completion
      };
    });

    return [...todaysRegularTasks, ...todaysRecurringTasks];
  };

  const todaysTasks = getTodaysTasks();

  // Statistics calculations
  const completedToday = todaysTasks.filter(task => task.completed).length;

  const completedThisWeek = [...regularTasks, ...recurringTasks].filter(task => {
    if (!task || task?.archived) return false;
    
    if (task?.taskType === 'REGULAR') {
      return task.completed && task.deadline && isThisWeek(parseISO(task.deadline));
    } else {
      // For recurring tasks, check doneDates within this week
      return Array.isArray(task?.doneDates) && task.doneDates.some(date => isThisWeek(parseISO(date))) || false;
    }
  }).length;

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.uuid, taskData);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        await addTask(taskData);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      setIsTaskFormOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.error || "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = async (uuid) => {
    try {
      await deleteTask(uuid);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.error || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeView={activeView}
        setActiveView={setActiveView}
        onAddTask={handleAddTask}
      />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatisticCard
            title="Tasks Completed Today"
            value={completedToday}
            icon={<CheckCircle className="h-4 w-4" />}
            description="Tasks finished today"
          />
          <StatisticCard
            title="Tasks Completed This Week"
            value={completedThisWeek}
            icon={<Clock className="h-4 w-4" />}
            description="Tasks finished this week"
          />
          <StatisticCard
            title="Total Active Tasks"
            value={todaysTasks.filter(task => !task.completed && !task?.archived).length}
            icon={<ListChecks className="h-4 w-4" />}
            description="Tasks in progress"
          />
          <StatisticCard
            title="High Priority Tasks"
            value={todaysTasks.filter(task => task.priority === 3).length}
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Tasks needing attention"
          />
        </div>

        {/* Task List or Calendar View */}
        {activeView === 'list' ? (
          <TaskList
            tasks={todaysTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <CalendarView
            tasks={[...regularTasks, ...recurringTasks].filter(task => !task?.archived)}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {/* Task Form Modal */}
        <TaskForm
          open={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleTaskSubmit}
          editingTask={editingTask}
        />
      </main>
    </div>
  );
};

export default Index;