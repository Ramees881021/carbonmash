import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AlmacLogo } from '@/components/ui/AlmacLogo';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type AuthView = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [view, setView] = useState<AuthView>(tabParam === 'signup' ? 'signup' : 'login');
  const navigate = useNavigate();

  useEffect(() => {
    if (tabParam === 'signup') {
      setView('signup');
    } else if (tabParam === 'login') {
      setView('login');
    }
  }, [tabParam]);

  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(0, 0%, 100%)' }}>
        <header className="w-full px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'hsl(0, 0%, 100%)', borderBottom: '1px solid hsl(0, 0%, 90%)' }}>
          <a href="/">
             <AlmacLogo className="h-10" />
          </a>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
            <button
              onClick={() => setView('login')}
              className="text-sm hover:underline"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Back to Sign In
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ForgotPasswordForm onBack={() => setView('login')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(0, 0%, 100%)' }}>
      <header className="w-full px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'hsl(0, 0%, 100%)', borderBottom: '1px solid hsl(0, 0%, 90%)' }}>
        <a href="/">
          <AlmacLogo className="h-10" />
        </a>
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as AuthView)} className="w-auto">
            <TabsList className="bg-muted">
              <TabsTrigger value="login" className="data-[state=active]:bg-background">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background">
                Register
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {view === 'login' ? (
            <LoginForm 
              onSwitchToSignup={() => setView('signup')} 
              onForgotPassword={() => setView('forgot-password')} 
            />
          ) : (
            <SignupForm onSwitchToLogin={() => setView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
