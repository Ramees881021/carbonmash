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
    {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm border-b border-slate-100"
      >
        <motion.a 
          href="/" 
          className="shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlmacLogo className="h-8 md:h-10" />
        </motion.a>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, staggerChildren: 0.1 }}
            className="hidden md:flex items-center gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/contact')} className="text-slate-600 transition-colors">
                Contact Us
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/tools-and-services')} className="text-slate-600 transition-colors">
                Tools & Services
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/pricing')} className="text-slate-600 transition-colors">
                Pricing
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="hover:bg-primary hover:text-white border-slate-200 text-slate-700">
                Sign In
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" onClick={() => navigate('/auth?tab=signup')} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
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
            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => {
              navigate('/tools-and-services');
              setIsMobileMenuOpen(false);
            }}>
              Tools & Services
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={() => {
              navigate('/pricing');
              setIsMobileMenuOpen(false);
            }}>
              Pricing
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              navigate('/auth');
              setIsMobileMenuOpen(false);
            }}>
              Sign In
            </Button>
            <Button className="w-full justify-start flex items-center gap-2" onClick={() => {
              navigate('/auth?tab=signup');
              setIsMobileMenuOpen(false);
            }}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

    {/* Hero Section with Background Video */}
    <section className="relative min-h-[95vh] flex flex-col items-center justify-start pt-32 lg:pt-48 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="hero-bg absolute inset-0 w-full h-full -z-10 flex items-center justify-center overflow-hidden">
        <video autoPlay playsInline muted loop className="min-w-full min-h-full object-cover shadow-[inset_0_0_100px_rgba(255,255,255,1)] pointer-events-none">
          <source src="https://d2clay67sid5ua.cloudfront.net/files/0taxxqj5/smc-24/b0ca292a461f7d84a7d40cbb378e81e7ad5e0f21.mp4" type="video/mp4" />
        </video>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Headline */}
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }} 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-[1.15] mb-8 tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-black to-[#00D170] cursor-default select-none" 
        >
          CARBONMASH
        </motion.h1>

        {/* Subtitles (Unified Size and Font matching Logo) */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }} 
          className="text-lg md:text-2xl font-sans flex flex-col gap-3 mb-12 text-slate-700 drop-shadow-sm max-w-3xl mx-auto cursor-default select-none" 
        >
          <span className="block px-4 md:px-0 font-semibold text-slate-800 tracking-wide">
            The Carbon Intelligence Platform for your Organisation
          </span>
          <span className="block px-4 md:px-0 text-base md:text-lg font-medium opacity-90 leading-relaxed text-slate-600">
            Tracking Emissions, Setting Targets, Modelling Pathways, and Driving Sustainable Impact.
          </span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1, type: "spring", stiffness: 100 }} 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="flex items-center justify-center gap-3 text-lg px-8 py-6 w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary/90 transition-all">
              <span className="font-semibold">Get Started</span> 
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
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