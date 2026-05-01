import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AlmacLogo } from '@/components/ui/AlmacLogo';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { MinimalBackground } from '@/components/landing/MinimalBackground';

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
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <MinimalBackground />
        <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-100">
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
              className="text-sm hover:underline font-medium"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Back to Sign In
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl"
          >
            <ForgotPasswordForm onBack={() => setView('login')} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <MinimalBackground />

      <header className="relative z-10 w-full px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm border-b border-slate-100">
        <a href="/" className="shrink-0">
          <AlmacLogo className="h-8 md:h-10" />
        </a>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as AuthView)} className="w-auto">
            <TabsList className="bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="login" className="data-[state=active]:bg-background text-xs sm:text-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background text-xs sm:text-sm">
                Register
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2 text-xs sm:text-sm h-8 sm:h-9">
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Home
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view === 'login' ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {view === 'login' ? (
                <LoginForm 
                  onSwitchToSignup={() => setView('signup')} 
                  onForgotPassword={() => setView('forgot-password')} 
                />
              ) : (
                <SignupForm onSwitchToLogin={() => setView('login')} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;
