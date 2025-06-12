import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Edit, Trash2, Repeat, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TaskCard = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    return `task-priority-${priority}`;
  };

  const getCategoryClass = (category) => {
    return `category-badge-${category}`;
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'None';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'campus':
        return 'Campus';
      case 'work':
        return 'Work';
      case 'competition':
        return 'Competition';
      case 'personal':
        return 'Personal';
      case 'custom':
        return 'Custom';
    }
  };

  const getReminderLabel = (reminderTime) => {
    switch (reminderTime) {
      case '30min':
        return '30 minutes before';
      case '1hour':
        return '1 hour before';
      case '3hours':
        return '3 hours before';
      case '1day':
        return '1 day before';
      default:
        return 'No reminder';
    }
  };

  const getRecurringLabel = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        return 'Custom';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`p-4 mb-4 bg-white rounded-lg shadow-sm ${getPriorityClass(task.priority)} ${
        task.isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`} 
          checked={task.isCompleted} 
          onCheckedChange={() => onComplete(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          
          <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={getCategoryClass(task.category)}>
              {getCategoryLabel(task.category)}
            </Badge>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {format(new Date(task.dueDate), 'HH:mm')}
            </div>

            {task.isRecurring && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {getRecurringLabel(task.recurringFrequency)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Repeats {getRecurringLabel(task.recurringFrequency).toLowerCase()}
                      {task.recurringEndDate && (
                        <> until {format(new Date(task.recurringEndDate), 'MMM dd, yyyy')}</>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {task.reminderTime !== 'none' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 flex items-center gap-1">
                      <BellRing className="h-3 w-3" />
                      Reminder
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reminder set for {getReminderLabel(task.reminderTime)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(task)} 
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(task.id)} 
            className="h-8 w-8 p-0 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
