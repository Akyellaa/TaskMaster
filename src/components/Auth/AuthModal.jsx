import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthModal({ open }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = isLogin 
        ? await login(formData)
        : await signup(formData);

      if (response.status) {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created',
          description: response.message,
        });
        
        if (!isLogin) {
          // If signup successful, switch to login view
          setIsLogin(true);
          setFormData(prev => ({
            ...prev,
            name: ''
          }));
        }
      } else {
        toast({
          title: 'Error',
          description: response.errors?.[0] || response.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent 
        className="sm:max-w-[425px] border-none bg-white/80 backdrop-blur-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Login to TaskMaster' : 'Create an Account'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="bg-white/50 backdrop-blur-sm"
                disabled={isLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="bg-white/50 backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2 pt-4">
            <Button 
              type="submit" 
              className="bg-taskmaster-primary hover:bg-purple-600"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLogin ? 'Logging in...' : 'Signing up...') 
                : (isLogin ? 'Login' : 'Sign Up')
              }
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                });
              }}
              className="hover:bg-white/20"
              disabled={isLoading}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 