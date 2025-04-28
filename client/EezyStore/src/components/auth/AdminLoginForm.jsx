import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

export default function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.adminLogin({ username, password });

      localStorage.setItem('access', response.access);
      localStorage.setItem('user', JSON.stringify({
        email: response?.user.email,
        firstName: response?.user.first_name,
        username: response?.user.username,
        isAdmin: response?.is_admin
      }));
      
      toast({
        title: "Admin logged in successfully",
        description: "Welcome to the admin dashboard.",
        variant: "default",
      });
      
      
      navigate('/admin');
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        if (err.response.data.error[0] === 'password-mismatch') {
          setError( "Your entered password is incorrect password.");
        } else if (err.response.data.error === 'not-permitted') {
          setError(err.response.data.message || "You do not have permission to access this part.");
        } else if (err.response.data.error === 'not-exist') {
          setError(err.response.data.message || "User with given username does not exist");
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Enter your admin credentials to access the dashboard
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
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="username" 
              placeholder="Enter your admin username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {loading ? 'Logging in...' : 'Admin Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          This login is for administrators only
        </p>
      </CardFooter>
    </Card>
  );
}