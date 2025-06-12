import React, { createContext, useContext, useState } from "react";

// Create context
const TaskContext = createContext(undefined);

// Generate sample tasks
const generateSampleTasks = () => {
  return [
    {
      id: "1",
      title: "Submission Tugas Algoritma",
      description: "Kumpulkan tugas algoritma pemrograman",
      priority: "high",
      category: "campus",
      dueDate: new Date(2025, 3, 20),
      reminderTime: "1day",
      isRecurring: false,
      recurringFrequency: "none",
      recurringEndDate: null,
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Persiapan Presentasi",
      description: "Siapkan slide dan materi presentasi proyek",
      priority: "medium",
      category: "work",
      dueDate: new Date(2025, 3, 18),
      reminderTime: "3hours",
      isRecurring: false,
      recurringFrequency: "none",
      recurringEndDate: null,
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Latihan Lomba Coding",
      description: "Latihan soal-soal untuk persiapan lomba",
      priority: "high",
      category: "competition",
      dueDate: new Date(2025, 3, 25),
      reminderTime: "1hour",
      isRecurring: true,
      recurringFrequency: "weekly",
      recurringEndDate: new Date(2025, 5, 25),
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Olahraga Sore",
      description: "Jogging di taman kota",
      priority: "low",
      category: "personal",
      dueDate: new Date(2025, 3, 16),
      reminderTime: "30min",
      isRecurring: true,
      recurringFrequency: "daily",
      recurringEndDate: null,
      isCompleted: true,
      createdAt: new Date(),
    },
    {
      id: "5",
      title: "Belajar React Hooks",
      description: "Pelajari penggunaan useContext dan useReducer",
      priority: "medium",
      category: "campus",
      dueDate: new Date(2025, 3, 22),
      reminderTime: "none",
      isRecurring: false,
      recurringFrequency: "none",
      recurringEndDate: null,
      isCompleted: false,
      createdAt: new Date(),
    },
  ];
};

// Provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(generateSampleTasks());

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const getTasksByCategory = (category) => {
    return tasks.filter((task) => task.category === category);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter((task) => task.priority === priority);
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.isCompleted);
  };

  const getPendingTasks = () => {
    return tasks.filter((task) => !task.isCompleted);
  };

  const getDueReminders = () => {
    const now = new Date();
    return tasks.filter((task) => {
      if (task.isCompleted || task.reminderTime === "none") return false;

      const dueDate = new Date(task.dueDate);
      let reminderDate = new Date(dueDate);

      switch (task.reminderTime) {
        case "30min":
          reminderDate.setMinutes(reminderDate.getMinutes() - 30);
          break;
        case "1hour":
          reminderDate.setHours(reminderDate.getHours() - 1);
          break;
        case "3hours":
          reminderDate.setHours(reminderDate.getHours() - 3);
          break;
        case "1day":
          reminderDate.setDate(reminderDate.getDate() - 1);
          break;
        default:
          return false;
      }

      return now >= reminderDate && now <= dueDate;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        getTasksByCategory,
        getTasksByPriority,
        getCompletedTasks,
        getPendingTasks,
        getDueReminders,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
