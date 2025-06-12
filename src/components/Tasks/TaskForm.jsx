import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths } from 'date-fns';
import { CalendarIcon, Clock, Repeat, BellRing } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const TaskForm = ({ open, onClose, onSubmit, editingTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('none');
  const [category, setCategory] = useState('campus');
  const [dueDate, setDueDate] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [reminderTime, setReminderTime] = useState('none');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('none');
  const [recurringEndDate, setRecurringEndDate] = useState(null);
  const [showRecurringEndDate, setShowRecurringEndDate] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(new Date(editingTask.dueDate));
      setIsCompleted(editingTask.isCompleted);
      setReminderTime(editingTask.reminderTime || 'none');
      setIsRecurring(editingTask.isRecurring || false);
      setRecurringFrequency(editingTask.recurringFrequency || 'none');
      setRecurringEndDate(editingTask.recurringEndDate ? new Date(editingTask.recurringEndDate) : null);
      setShowRecurringEndDate(!!editingTask.recurringEndDate);
    } else {
      setTitle('');
      setDescription('');
      setPriority('none');
      setCategory('campus');
      setDueDate(new Date());
      setIsCompleted(false);
      setReminderTime('none');
      setIsRecurring(false);
      setRecurringFrequency('none');
      setRecurringEndDate(null);
      setShowRecurringEndDate(false);
    }
  }, [editingTask, open]);

  useEffect(() => {
    if (isRecurring && !recurringEndDate) {
      setRecurringEndDate(addMonths(dueDate, 3));
    }
  }, [isRecurring, dueDate, recurringEndDate]);

  const handleRecurringToggle = (checked) => {
    setIsRecurring(checked);
    if (checked) {
      setRecurringFrequency('weekly');
    } else {
      setRecurringFrequency('none');
      setRecurringEndDate(null);
      setShowRecurringEndDate(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      priority,
      category,
      dueDate,
      isCompleted,
      reminderTime,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : 'none',
      recurringEndDate: isRecurring && showRecurringEndDate ? recurringEndDate : null,
    };
    onSubmit(taskData);
    onClose();
  };

  const getPriorityLabel = (p) => {
    switch (p) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'None';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" className="min-h-[80px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <RadioGroup value={priority} onValueChange={(v) => setPriority(v)} className="flex flex-col space-y-1 mt-2">
                  {['none', 'low', 'medium', 'high'].map((val) => (
                    <div className="flex items-center space-x-2" key={val}>
                      <RadioGroupItem value={val} id={`priority-${val}`} />
                      <Label htmlFor={`priority-${val}`} className="cursor-pointer">
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected priority: <span className="font-medium">{getPriorityLabel(priority)}</span>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {['campus', 'work', 'competition', 'personal', 'custom'].map((c) => (
                      <SelectItem value={c} key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Due Date</Label>
              <div className="flex items-center gap-4 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dueDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={(date) => date && setDueDate(date)} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {format(dueDate, "HH:mm")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="grid gap-2 grid-cols-2">
                      <Input
                        type="number"
                        min={0}
                        max={23}
                        placeholder="HH"
                        value={format(dueDate, "HH")}
                        onChange={(e) => {
                          const h = parseInt(e.target.value);
                          if (!isNaN(h) && h >= 0 && h <= 23) {
                            const d = new Date(dueDate);
                            d.setHours(h);
                            setDueDate(d);
                          }
                        }}
                      />
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        placeholder="MM"
                        value={format(dueDate, "mm")}
                        onChange={(e) => {
                          const m = parseInt(e.target.value);
                          if (!isNaN(m) && m >= 0 && m <= 59) {
                            const d = new Date(dueDate);
                            d.setMinutes(m);
                            setDueDate(d);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex items-center">
                <BellRing className="h-5 w-5 mr-2 text-taskmaster-primary" />
                <Label className="text-base font-medium">Reminder</Label>
              </div>
              <div className="mt-2">
                <Select value={reminderTime} onValueChange={(v) => setReminderTime(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Set a reminder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No reminder</SelectItem>
                    <SelectItem value="30min">30 minutes before</SelectItem>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="3hours">3 hours before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Repeat className="h-5 w-5 mr-2 text-taskmaster-primary" />
                  <Label className="text-base font-medium">Recurring Task</Label>
                </div>
                <Switch checked={isRecurring} onCheckedChange={handleRecurringToggle} />
              </div>

              {isRecurring && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Frequency</Label>
                    <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Has End Date</Label>
                    <Switch checked={showRecurringEndDate} onCheckedChange={setShowRecurringEndDate} />
                  </div>

                  {showRecurringEndDate && (
                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {recurringEndDate ? format(recurringEndDate, "PPP") : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={recurringEndDate || undefined}
                            onSelect={(date) => date && setRecurringEndDate(date)}
                            initialFocus
                            disabled={(date) => date < dueDate}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-taskmaster-primary hover:bg-purple-600">
              {editingTask ? 'Update' : 'Create'} Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;