import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AlmacLogo } from '@/components/ui/AlmacLogo';
import { useAdmin } from '@/hooks/useAdmin';
import { Shield, ArrowRight, BarChart3, Target, TrendingDown, Award, Leaf, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { NetZeroPath } from '@/components/landing/NetZeroPath';
import { MinimalBackground } from '@/components/landing/MinimalBackground';

const FadeInSection = ({
  children,
  className = '',
  delay = 0
}: { children: React.ReactNode; className?: string; delay?: number; }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-60px'
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 50
  }} animate={isInView ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: 50
  }} transition={{
    duration: 0.7,
    delay,
    ease: [0.25, 0.4, 0, 1]
  }} className={className}>
    {children}
  </motion.div>;
};

const features = [{
  icon: BarChart3,
  title: 'Emissions Tracking',
  description: 'Comprehensive Scope 1, 2 & 3 emissions monitoring across your entire value chain.'
}, {
  icon: Target,
  title: 'Net Zero Pathways',
  description: 'Science-based target setting aligned with SBTi methodology for decarbonisation.'
}, {
  icon: TrendingDown,
  title: 'Carbon Budget',
  description: 'Financial carbon cost analysis with discount rate modelling and forecasting.'
}, {
  icon: Award,
  title: 'Sustainability Credentials',
  description: 'Track CDP scores, EcoVadis ratings, and SBTi commitments in one place.'
}];

const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const {
    isAdmin
  } = useAdmin();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{
      backgroundColor: 'hsl(0, 0%, 100%)'
    }}>
      <motion.div animate={{
        opacity: [0.4, 1, 0.4]
      }} transition={{
        duration: 1.5,
        repeat: Infinity
      }}>
        <span className="text-2xl font-bold" style={{
          color: 'hsl(222, 47%, 11%)'
        }}>Loading...</span>
      </motion.div>
    </div>;
  }

  if (user) return null;

  return <div className="relative min-h-screen flex flex-col overflow-x-hidden">
    <MinimalBackground />
    {/* Header */}
    <header className="relative z-50 w-full px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-sm">
      <a href="/">
        <AlmacLogo className="h-8 md:h-12" />
      </a>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/contact')} className="text-slate-600">
          Contact Us
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
          Sign In
        </Button>
        <Button size="sm" onClick={() => navigate('/pricing')} className="flex items-center gap-2">
          Get Started <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-slate-600"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-4 flex flex-col gap-4 md:hidden"
          >
            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => {
              navigate('/contact');
              setIsMobileMenuOpen(false);
            }}>
              Contact Us
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              navigate('/auth');
              setIsMobileMenuOpen(false);
            }}>
              Sign In
            </Button>
            <Button className="w-full justify-start flex items-center gap-2" onClick={() => {
              navigate('/pricing');
              setIsMobileMenuOpen(false);
            }}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Hero Section with Net Zero Path */}
    <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 overflow-hidden">
      <NetZeroPath />

      <div className="relative z-10 max-w-3xl">
        {/* Logo mark */}

        {/* Headline */}
        <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4,
          ease: [0.25, 0.4, 0, 1]
        }} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] md:leading-[1.15] mb-6 -ml-0 md:-ml-10" style={{
          color: 'hsl(222, 47%, 11%)'
        }}>The Carbon Intelligence Platform for your Organisation's
          <br />
          <span style={{
            color: 'hsl(var(--primary))'
          }}>Net Zero journey</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.8
        }} className="text-base md:text-lg mb-10 max-w-xl -ml-0 md:-ml-10" style={{
          color: 'hsl(215, 16%, 47%)'
        }}>
          Tracking Emissions, Setting Targets, Modelling Pathways, and Driving Sustainable Impact.
        </motion.p>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }} className="flex flex-col sm:flex-row gap-4 -ml-0 md:-ml-10">
          <Button size="lg" onClick={() => navigate('/pricing')} className="flex items-center justify-center gap-2 text-base px-8 w-full sm:w-auto">
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>


    {/* Footer */}
    <footer className="w-full px-6 md:px-12 lg:px-20 py-8 text-center text-sm opacity-100" style={{
      borderTop: '1px solid hsl(0, 0%, 90%)',
      color: 'hsl(215, 16%, 47%)'
    }}>
      © {new Date().getFullYear()} Carbonmash.com
    </footer>
  </div>;
};

export default Index;