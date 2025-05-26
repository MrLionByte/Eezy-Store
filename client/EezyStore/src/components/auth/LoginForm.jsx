import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {authService} from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import {toast} from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: formData.email, 
        password: formData.password,
      });

      localStorage.setItem('access', response.access);
      localStorage.setItem('user', JSON.stringify({
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          username: response.user.username,
      }));

      toast({
        title: "Logged in successfully",
        description: "Welcome to eezy-store.",
        className: "bg-green-600 text-white"
      });

      
      setTimeout(() => {
        navigate('/store');
      }, 2000);
      
    } catch (err) {
      console.log(err);
      
      if (err.response?.status === 400) {
              const errorCode = err.response.data.error[0];
              const errorMap = {
                'not-exist': 'User with given email does not exist',
                'wrong-password': 'Wrong password, try again',
                'password-mismatch': 'Wrong password, try again',
                'account-not-activated': 'Account not activated yet, please wait or contact support',
                'account-blocked': 'Account blocked, please contact support',
              };
              setError(errorMap[errorCode] || 'Login failed');
        }else{
            setError('Login failed');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
              <p className="text-sm text-red-500">{error.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
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
            
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Must be at least 6 characters and include uppercase and lowercase letters.
            </p>
          )}

          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}