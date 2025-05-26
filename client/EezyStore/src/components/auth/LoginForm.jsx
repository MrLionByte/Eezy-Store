import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {authService} from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import {toast} from "@/hooks/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });

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
        variant: "default",
      });
      navigate('/store');
    setTimeout(() => {
    navigate('/store');
    }, 2000);
      
    } catch (err) {
      console.log(err);
      
        if (err.response?.status === 400) {
            if (err.response.data.error[0] == ['not-exist']) {
                setError('User with given email does not exist');
            } else if (err.response.data.error[0] == ['wrong-password']) {
                setError('Wrong password, try again');
            } else if (err.response.data.error[0] == ['password-mismatch']) {
                setError('Wrong password, try again');
            } else if (err.response.data.error[0] == ['account-not-activated']) {
                setError('Account not activated yet, please wait or contact support');
            } else if (err.response.data.error[0] == ['account-blocked']) {
                setError('Account blocked, please contact support');
            } else {
                setError('Login failed');
            }
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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