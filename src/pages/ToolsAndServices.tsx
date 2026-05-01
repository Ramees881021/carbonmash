import { MinimalBackground } from '@/components/landing/MinimalBackground';
import { AlmacLogo } from '@/components/ui/AlmacLogo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BarChart3, Target, Leaf, Globe2, ShieldCheck, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const toolsAndServices = [
    {
        icon: BarChart3,
        title: "Carbotracker",
        description: "Comprehensive Scope 1, 2 & 3 emissions calculator and monitoring tool across your entire value chain.",
        features: ["Automated Data Entry", "Multi-site Tracking", "Year-on-Year Benchmarking"]
    },
    {
        icon: Globe2,
        title: "Net-Z Platform",
        description: "Showcase your sustainability journey with detailed roadmapping and internal reporting for boards.",
        features: ["Public Dashboard", "Progress Tracking", "Sustainability Badges"]
    },
    {
        icon: Target,
        title: "CarboConnect",
        description: "Automated supplier engagement tool for global supply chains and risk modeling.",
        features: ["Automated Data Requests", "Auditor-Ready Data", "Supplier Engagement"]
    },
    {
        icon: Leaf,
        title: "Sustainability Consulting",
        description: "Expert guidance on decarbonisation strategy, aligning with SBTi methodology.",
        features: ["SBTi Target Setting", "Policy Development", "Regulatory Compliance"]
    },
    {
        icon: ShieldCheck,
        title: "Audit & Assurance Support",
        description: "Pre-audit verification of emissions data to ensure total transparency and readiness.",
        features: ["Data Verification", "Reporting Alignment", "Gap Analysis"]
    }
];

const ToolsAndServices = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col">
            <MinimalBackground />

            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50">
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <AlmacLogo className="h-10 md:h-12" />
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="hidden md:flex items-center gap-2 text-slate-600 hover:text-primary hover:bg-primary/5"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => navigate('/auth?tab=signup')}
                        className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                    >
                        Get Started
                    </Button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-12 lg:p-20 pt-10 md:pt-16">
                <div className="max-w-7xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16 md:mb-24"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Tools & Services</h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Empower your organization with our comprehensive suite of carbon intelligence tools. 
                            From calculation to engagement, we have everything you need to drive meaningful climate action.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-8 mb-20">
                        {toolsAndServices.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                                    className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:bg-white hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-colors transition-shadow duration-300 group flex flex-col"
                                >
                                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                                    <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{service.description}</p>
                                    
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <motion.li 
                                                key={i} 
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) + (i * 0.08), ease: "easeOut" }}
                                                className="flex items-center gap-3 text-sm font-medium text-slate-700"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <Button 
                                        variant="ghost" 
                                        className="w-full group/btn text-primary hover:text-primary hover:bg-primary/5 flex items-center justify-between mt-auto transition-transform"
                                        onClick={() => navigate('/pricing')}
                                    >
                                        Explore Pricing
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start your Net Zero journey?</h2>
                            <p className="text-slate-300 text-lg md:text-xl mb-10">
                                Join thousands of organizations using Carbonmash to measure, reduce, and report their carbon footprint.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                                    Get Started Free
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ToolsAndServices;
