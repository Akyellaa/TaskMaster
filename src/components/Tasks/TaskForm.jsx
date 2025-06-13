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
import { format } from 'date-fns';
import { CalendarIcon, Clock, Repeat } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategories } from '@/context/CategoryContext';

const TaskForm = ({ open, onClose, onSubmit, editingTask }) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [categoryId, setCategoryId] = useState('none');
  const [deadline, setDeadline] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setCategoryId(editingTask.category ? editingTask.category.id.toString() : 'none');
      
      if ('recurrenceDays' in editingTask) {
        setIsRecurring(true);
        setSelectedDays(editingTask.recurrenceDays || []);
      } else {
        setIsRecurring(false);
        setDeadline(editingTask.deadline ? new Date(editingTask.deadline) : new Date());
      }
    } else {
      resetForm();
    }
  }, [editingTask, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(1);
    setCategoryId('none');
    setDeadline(new Date());
    setIsRecurring(false);
    setSelectedDays([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Base task data that's common for both types
    const baseTaskData = {
      title,
      description,
      priority,
      categoryId: categoryId === "none" ? null : Number(categoryId),
      taskType: isRecurring ? 'RECURRING' : 'REGULAR'
    };

    // Add type-specific fields
    const taskData = isRecurring 
      ? {
          ...baseTaskData,
          recurrenceDays: selectedDays.length > 0 ? selectedDays : null
        }
      : {
          ...baseTaskData,
          deadline: format(deadline, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        };

    onSubmit(taskData);
    resetForm();
  };

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Task title" 
                required 
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Task description" 
                className="min-h-[80px]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <RadioGroup 
                  value={priority.toString()} 
                  onValueChange={(v) => setPriority(Number(v))} 
                  className="flex flex-col space-y-1 mt-2"
                >
                  {[
                    { value: '1', label: 'Low' },
                    { value: '2', label: 'Medium' },
                    { value: '3', label: 'High' }
                  ].map(({ value, label }) => (
                    <div className="flex items-center space-x-2" key={value}>
                      <RadioGroupItem value={value} id={`priority-${value}`} />
                      <Label htmlFor={`priority-${value}`} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-taskmaster-primary" />
                <Label className="text-base font-medium">Recurring Task</Label>
              </div>
              <Switch 
                checked={isRecurring} 
                onCheckedChange={setIsRecurring} 
              />
            </div>

            {isRecurring ? (
              <div className="space-y-4">
                <Label>Repeat on</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div className="flex items-center space-x-2" key={day}>
                      <Checkbox
                        id={day}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={(checked) => {
                          setSelectedDays(prev => 
                            checked 
                              ? [...prev, day]
                              : prev.filter(d => d !== day)
                          );
                        }}
                      />
                      <Label htmlFor={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Label>Deadline</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(deadline, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={deadline} 
                        onSelect={(date) => date && setDeadline(date)} 
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(deadline, "HH:mm")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="grid gap-2 grid-cols-2">
                        <Input
                          type="number"
                          min={0}
                          max={23}
                          placeholder="HH"
                          value={format(deadline, "HH")}
                          onChange={(e) => {
                            const h = parseInt(e.target.value);
                            if (!isNaN(h) && h >= 0 && h <= 23) {
                              const d = new Date(deadline);
                              d.setHours(h);
                              setDeadline(d);
                            }
                          }}
                        />
                        <Input
                          type="number"
                          min={0}
                          max={59}
                          placeholder="MM"
                          value={format(deadline, "mm")}
                          onChange={(e) => {
                            const m = parseInt(e.target.value);
                            if (!isNaN(m) && m >= 0 && m <= 59) {
                              const d = new Date(deadline);
                              d.setMinutes(m);
                              setDeadline(d);
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;