import React, { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "@/config";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(undefined);

export const TaskProvider = ({ children }) => {
  const [regularTasks, setRegularTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleTokenInvalidation } = useAuth();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setRegularTasks([]);
        setRecurringTasks([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleTokenInvalidation();
        }
        setError('Failed to fetch tasks');
        return;
      }

      const data = await response.json();

      if (data.status) {
        setRegularTasks(data.data.regularTasks);
        setRecurringTasks(data.data.recurringTasks);
        setError(null);
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks`;

      // Clean up the task data before sending
      const taskData = {
        ...task,
        recurrenceDays: task.recurrenceDays || undefined,
        deadline: task.deadline || undefined
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      
      if (data.status) {
        // Update the appropriate task list based on the type
        if (task.taskType === 'RECURRING') {
          setRecurringTasks(prev => [...prev, data.data].sort((a, b) => a.sequenceNumber - b.sequenceNumber));
        } else {
          setRegularTasks(prev => [...prev, data.data].sort((a, b) => a.sequenceNumber - b.sequenceNumber));
        }
        return { 
          success: true, 
          message: data.message,
          task: data.data
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { 
          success: false, 
          error: data.errors?.[0] || data.message || 'Failed to create task'
        };
      }
    } catch (err) {
      console.error('Error adding task:', err);
      return { 
        success: false, 
        error: 'Failed to create task'
      };
    }
  };

  const updateTask = async (uuid, updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}`;

      // Prepare the update payload based on task type
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        isCompleted: updatedTask.completed || false,
        isArchived: updatedTask.archived || false,
        taskType: updatedTask.taskType,
        categoryId: typeof updatedTask.categoryId !== 'undefined' ? updatedTask.categoryId : null,
      };

      // Add type-specific fields
      if (updatedTask.taskType === 'REGULAR' && updatedTask.deadline) {
        payload.deadline = updatedTask.deadline;
      } else if (updatedTask.taskType === 'RECURRING') {
        payload.recurrenceDays = updatedTask.recurrenceDays || [];
        payload.doneDates = updatedTask.doneDates || [];
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      
      if (data.status) {
        // Update the local state based on the response
        const updatedTaskData = data.data;
        const isRecurring = updatedTaskData.recurrenceDays !== undefined;
        
        if (isRecurring) {
          setRecurringTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message,
          task: updatedTaskData
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { 
          success: false, 
          error: data.errors?.[0] || data.message || 'Failed to update task'
        };
      }
    } catch (err) {
      console.error('Error updating task:', err);
      return { success: false, error: 'Failed to update task' };
    }
  };

  const deleteTask = async (uuid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      if (data.status) {
        // Update the local state by removing the task
        const isRecurring = [...recurringTasks, ...regularTasks]
          .find(task => task.uuid === uuid)?.recurrenceDays !== undefined;
        
        if (isRecurring) {
          setRecurringTasks(prev => 
            prev.filter(task => task.uuid !== uuid)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.filter(task => task.uuid !== uuid)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { success: false, error: data.errors?.[0] || data.message };
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      return { success: false, error: 'Failed to delete task' };
    }
  };

  const completeTask = async (uuid, isRecurring = false, date = null) => {
    console.log('Completing task:', uuid, 'isRecurring:', isRecurring);
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}/complete`;
      console.log('Complete endpoint:', endpoint);
      const body = isRecurring && date ? { date } : {};

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      if (data.status) {
        // Update the local state based on the response
        const updatedTaskData = data.data;
        const isRecurringTask = updatedTaskData.recurrenceDays !== undefined;
        
        if (isRecurringTask) {
          setRecurringTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message,
          task: updatedTaskData
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { success: false, error: data.errors?.[0] || data.message };
      }
    } catch (err) {
      console.error('Error completing task:', err);
      return { success: false, error: 'Failed to complete task' };
    }
  };

  const undoCompleteTask = async (uuid) => {
    console.log('Undoing task completion:', uuid);
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}/undo-complete`;
      console.log('Undo complete endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      if (data.status) {
        // Update the local state based on the response
        const updatedTaskData = data.data;
        const isRecurring = updatedTaskData.recurrenceDays !== undefined;
        
        if (isRecurring) {
          setRecurringTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message,
          task: updatedTaskData
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { success: false, error: data.errors?.[0] || data.message };
      }
    } catch (err) {
      console.error('Error undoing task completion:', err);
      return { success: false, error: 'Failed to undo task completion' };
    }
  };

  const archiveTask = async (uuid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}/archive`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      if (data.status) {
        // Update the local state based on the response
        const updatedTaskData = data.data;
        const isRecurring = updatedTaskData.recurrenceDays !== undefined;
        
        if (isRecurring) {
          setRecurringTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message,
          task: updatedTaskData
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { success: false, error: data.errors?.[0] || data.message };
      }
    } catch (err) {
      console.error('Error archiving task:', err);
      return { success: false, error: 'Failed to archive task' };
    }
  };

  const unarchiveTask = async (uuid) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false, error: 'No authentication token found' };

      const endpoint = `${BACKEND_URL}/api/tasks/${uuid}/unarchive`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok && response.status === 401) {
        handleTokenInvalidation();
        return { success: false, error: 'Authentication failed' };
      }

      const data = await response.json();
      if (data.status) {
        // Update the local state based on the response
        const updatedTaskData = data.data;
        const isRecurring = updatedTaskData.recurrenceDays !== undefined;
        
        if (isRecurring) {
          setRecurringTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        } else {
          setRegularTasks(prev => 
            prev.map(task => task.uuid === uuid ? updatedTaskData : task)
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          );
        }
        
        return { 
          success: true,
          message: data.message,
          task: updatedTaskData
        };
      } else {
        if (data.message?.toLowerCase().includes('token')) {
          handleTokenInvalidation();
        }
        return { success: false, error: data.errors?.[0] || data.message };
      }
    } catch (err) {
      console.error('Error unarchiving task:', err);
      return { success: false, error: 'Failed to unarchive task' };
    }
  };

  // Helper functions to filter tasks
  const getTasksByCategory = (category) => {
    return [
      ...regularTasks.filter(task => task.category === category),
      ...recurringTasks.filter(task => task.category === category)
    ];
  };

  const getTasksByPriority = (priority) => {
    return [
      ...regularTasks.filter(task => task.priority === priority),
      ...recurringTasks.filter(task => task.priority === priority)
    ];
  };

  const getCompletedTasks = () => {
    return [
      ...regularTasks.filter(task => task.completed),
      ...recurringTasks.filter(task => task.completed)
    ];
  };

  const getPendingTasks = () => {
    return [
      ...regularTasks.filter(task => !task.completed && !task.archived),
      ...recurringTasks.filter(task => !task.completed && !task.archived)
    ];
  };

  const getArchivedTasks = () => {
    return [
      ...regularTasks.filter(task => task.archived),
      ...recurringTasks.filter(task => task.archived)
    ];
  };

  if (isLoading) {
    return <div>Loading tasks...</div>; // Or your loading component
  }

  return (
    <TaskContext.Provider
      value={{
        regularTasks,
        recurringTasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        undoCompleteTask,
        archiveTask,
        unarchiveTask,
        getTasksByCategory,
        getTasksByPriority,
        getCompletedTasks,
        getPendingTasks,
        getArchivedTasks,
        refreshTasks: fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
