import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addDays,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalendarView = ({ tasks, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getExpandedTasks = () => {
    let expandedTasks = [];

    tasks.forEach(task => {
      expandedTasks.push(task);

      if (task.isRecurring && task.recurringFrequency !== 'none') {
        let currentDate = new Date(task.dueDate);
        const endDate = task.recurringEndDate || addMonths(monthEnd, 3);

        while (currentDate <= endDate) {
          let nextDate;

          switch (task.recurringFrequency) {
            case 'daily':
              nextDate = addDays(currentDate, 1);
              break;
            case 'weekly':
              nextDate = addDays(currentDate, 7);
              break;
            case 'monthly':
              nextDate = addMonths(currentDate, 1);
              break;
            default:
              nextDate = currentDate;
              break;
          }

          currentDate = nextDate;

          if (currentDate <= endDate) {
            expandedTasks.push({
              ...task,
              dueDate: currentDate,
              id: `${task.id}-${format(currentDate, 'yyyy-MM-dd')}`,
            });
          }
        }
      }
    });

    return expandedTasks;
  };

  const getTasksForDate = (date) => {
    const expandedTasks = getExpandedTasks();
    return expandedTasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getPrioritizedTasksForDate = (date) => {
    const tasksForDate = getTasksForDate(date);
    return tasksForDate
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1, none: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((weekday) => (
          <div key={weekday} className="text-center text-sm font-medium text-gray-500 py-2">
            {weekday}
          </div>
        ))}

        {daysInMonth.map((date, i) => {
          const tasksForDate = getTasksForDate(date);
          const prioritizedTasks = getPrioritizedTasksForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const hasTasks = tasksForDate.length > 0;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-2 border rounded-md",
                isToday(date) && "bg-blue-50 border-blue-200",
                isSelected && "ring-2 ring-taskmaster-primary",
                "hover:bg-gray-50 cursor-pointer transition-colors"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start">
                <span className={cn("text-sm font-medium", isToday(date) && "text-blue-600 font-bold")}>
                  {format(date, 'd')}
                </span>
                {hasTasks && (
                  <Badge variant="outline" className="bg-taskmaster-primary text-white text-xs">
                    {tasksForDate.length}
                  </Badge>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {prioritizedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs truncate p-1 rounded ${
                      task.priority === 'high'
                        ? 'bg-purple-100 text-purple-800'
                        : task.priority === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : task.priority === 'low'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {tasksForDate.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{tasksForDate.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
