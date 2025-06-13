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
  startOfWeek,
  endOfWeek,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CalendarView = ({ tasks, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (task.deadline) {
        return isSameDay(parseISO(task.deadline), date);
      }
      if (task.recurrenceDays) {
        const dayName = format(date, 'EEEE').toUpperCase();
        return task.recurrenceDays.includes(dayName);
      }
      return false;
    });
  };

  const getPrioritizedTasksForDate = (date) => {
    const tasksForDate = getTasksForDate(date);
    return tasksForDate
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const today = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
    onSelectDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-100 px-2 py-3 text-sm font-medium text-center"
          >
            {day}
          </div>
        ))}

        {daysInCalendar.map((date, i) => {
          const tasksForDate = getTasksForDate(date);
          const prioritizedTasks = getPrioritizedTasksForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const hasTasks = tasksForDate.length > 0;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[120px] bg-white p-2 relative",
                !isCurrentMonth && "bg-gray-50",
                isSelected && "ring-2 ring-taskmaster-primary",
                "hover:bg-gray-50 cursor-pointer transition-colors"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-gray-400",
                    isToday(date) && "text-taskmaster-primary font-bold",
                    isSelected && "text-taskmaster-primary"
                  )}
                >
                  {format(date, 'd')}
                </span>
                {hasTasks && (
                  <Badge variant="outline" className="bg-taskmaster-primary text-white text-xs">
                    {tasksForDate.length}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[80px] mt-1">
                <div className="space-y-1">
                  {prioritizedTasks.map((task) => (
                    <TooltipProvider key={task.uuid}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              task.completed && "line-through opacity-50",
                              task.priority === 3 && "bg-red-100 text-red-800",
                              task.priority === 2 && "bg-orange-100 text-orange-800",
                              task.priority === 1 && "bg-green-100 text-green-800",
                            )}
                          >
                            {task.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-gray-500">{task.description}</p>
                            )}
                            {task.deadline && (
                              <p className="text-xs flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {format(parseISO(task.deadline), "HH:mm")}
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {tasksForDate.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{tasksForDate.length - 3} more
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
