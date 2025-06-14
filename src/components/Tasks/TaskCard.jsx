import React from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Edit, Trash2, Repeat, Archive, ArchiveRestore, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTaskContext } from '@/context/TaskContext';
import { useToast } from '@/hooks/use-toast';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { completeTask, undoCompleteTask, archiveTask, unarchiveTask } = useTaskContext();
  const { toast } = useToast();
  const isRecurring = 'recurrenceDays' in task;

  // Helper function to convert UTC to local timezone
  const convertToLocalTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // console.log("date", date)
    // Create a new date object with the local timezone offset
    return new Date(date.getTime());
  };

  const isOverdue = !isRecurring && task.deadline && !task.completed && isPast(convertToLocalTime(task.deadline));

  const taskCategory = task.category; // already an object or null

  const handleTaskCompletion = async () => {
    const response = task.completed 
      ? await undoCompleteTask(task.uuid)
      : await completeTask(task.uuid, isRecurring);

    if (response.success) {
      toast({
        title: task.completed ? 'Task reopened' : 'Task completed',
        description: `"${task.title}" has been ${task.completed ? 'marked as incomplete' : 'marked as complete'}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  const handleArchiveToggle = async () => {
    const response = task.archived
      ? await unarchiveTask(task.uuid)
      : await archiveTask(task.uuid);

    if (response.success) {
      toast({
        title: task.archived ? 'Task unarchived' : 'Task archived',
        description: `"${task.title}" has been ${task.archived ? 'removed from' : 'moved to'} archive.`,
      });
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Failed to update archive status',
        variant: 'destructive',
      });
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 3: return 'task-priority-high';
      case 2: return 'task-priority-medium';
      case 1: return 'task-priority-low';
      default: return 'task-priority-none';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'None';
    }
  };

  const getRecurringDaysLabel = (days) => {
    if (!days || !Array.isArray(days)) return '';
    return days.map(day => day.charAt(0) + day.slice(1).toLowerCase()).join(', ');
  };

  return (
    <div 
      className={`p-4 mb-4 bg-white rounded-lg shadow-sm ${getPriorityClass(task.priority)} ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.uuid}`} 
          checked={task.completed} 
          onCheckedChange={handleTaskCompletion}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {isOverdue && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task was due on {format(convertToLocalTime(task.deadline), "MMM dd, yyyy HH:mm")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {taskCategory && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1.5"
                style={{
                  backgroundColor: `${taskCategory.color}15`,
                  borderColor: taskCategory.color,
                  color: taskCategory.color
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: taskCategory.color }}
                />
                {taskCategory.name}
              </Badge>
            )}
            
            {isRecurring ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      Recurring
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Repeats on: {getRecurringDaysLabel(task.recurrenceDays)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : task.deadline && (
              <div className={`flex items-center text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {format(convertToLocalTime(task.deadline), "MMM dd, yyyy HH:mm")}
              </div>
            )}

            <Badge variant="outline" className={`${getPriorityClass(task.priority)} bg-opacity-10`}>
              {getPriorityLabel(task.priority)}
            </Badge>

            {task.archived && (
              <Badge variant="outline" className="bg-gray-50 text-gray-800">
                Archived
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleArchiveToggle}
                  className="h-8 w-8 p-0"
                >
                  {task.archived ? (
                    <ArchiveRestore className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Archive className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {task.archived ? 'Restore from archive' : 'Move to archive'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
            onClick={() => onDelete(task.uuid)} 
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
