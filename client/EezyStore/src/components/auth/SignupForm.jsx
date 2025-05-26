import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import  {authService } from '../../services/apiService';
import { useForm } from 'react-hook-form'

export default function SignupForm() {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });


  const onSubmit = async (formData) => {

    setLoading(true);
    setError('');
    
    try {
        const response = await authService.signup(formData);
        console.log(response);
        
        toast({
            title: "Account created",
            description: "Your account has been created. Wait for admin approval.",
            className: "bg-green-600 text-white",
          });
        setTimeout(() => {
        navigate('/login');
        }, 2000);
    } catch (err) {
        console.log(err);
        
        if (err?.response?.status === 400) {
            setError(err?.response?.data?.error.includes('email') ? 'Email already exists' : err?.response?.data?.error.includes('username') ? 'Username already exists' : 'Registration failed');
        }
        else{
          setError(err?.response?.data?.error || 'Registration failed');
        }
    } finally {
      setLoading(false);
    }
  };

  return (

    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create a new account to start shopping
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input 
                id="first_name"
                placeholder="Enter your first name"
                className={errors.first_name ? 'border-red-500' : ''}
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: {
                    value: 4,
                    message: 'First name must be at least 4 characters long'
                  },
                  pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: 'First name must contain only letters (no spaces, numbers, or special characters)'
                  }
                })}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input 
                id="last_name"
                placeholder="Enter your last name"
                className={errors.last_name ? 'border-red-500' : ''}
                {...register('last_name', {
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Last name must contain only letters and spaces'
                  }
                })}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              placeholder="Enter your email"
              className={errors.email ? 'border-red-500' : ''}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              placeholder="Add a username (5+ chars - letters + numbers)"
              className={errors.username ? 'border-red-500' : ''}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 5,
                  message: 'Username must be at least 5 characters long'
                },
                validate: {
                  hasLettersAndNumbers: (value) => {
                    if (!/^[a-zA-Z0-9]+$/.test(value)) {
                      return 'Username must contain only letters and numbers';
                    }
                    if (/^[0-9]+$/.test(value)) {
                      return 'Username cannot contain only numbers';
                    }
                    return true;
                  }
                }
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              placeholder="Password (6+ chars, upper + lower case)"
              className={errors.password ? 'border-red-500' : ''}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                },
                validate: {
                  hasUpperCase: (value) => 
                    /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                  hasLowerCase: (value) => 
                    /[a-z]/.test(value) || 'Password must contain at least one lowercase letter'
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password_confirm">Confirm Password</Label>
            <Input 
              id="password_confirm"
              type="password"
              placeholder="Confirm your password"
              className={errors.password_confirm ? 'border-red-500' : ''}
              {...register('password_confirm', {
                required: 'Please confirm your password',
                validate: {
                  matchesPassword: (value) =>
                    value === watch('password') || 'Passwords do not match'
                }
              })}
            />
            {errors.password_confirm && (
              <p className="text-sm text-red-500">{errors.password_confirm.message}</p>
            )}
          </div>
          
          <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>

  );
}