import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MinimalBackground } from '@/components/landing/MinimalBackground';
import { Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlmacLogo } from '@/components/ui/AlmacLogo';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Assuming sonner is installed/used for toasts

const ContactSalesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        phoneNumber: '',
        workEmail: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log("Form Data Submitted:", formData);
        toast.success("Request sent! We'll be in touch shortly.");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Contact Sales</DialogTitle>
                    <DialogDescription>
                        Get a custom quote for your enterprise needs.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            name="companyName"
                            placeholder="Acme Inc."
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="workEmail">Work Email</Label>
                        <Input
                            id="workEmail"
                            name="workEmail"
                            type="email"
                            placeholder="john@acme.com"
                            value={formData.workEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Submit Request</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Pricing = () => {
    const navigate = useNavigate();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handlePlanAction = (planName: string) => {
        if (planName === 'Enterprise') {
            setIsContactModalOpen(true);
        } else {
            navigate('/auth?tab=signup');
        }
    };

    const pricingData = {
        carbotracker: {
            title: "Carbotracker (The Carbon Calculator)",
            plans: [
                {
                    name: 'SME Essentials',
                    price: '£10',
                    period: '/month',
                    description: 'Basic emissions tracking for small businesses.',
                    features: [
                        'Scopes 1, 2, and 3 Calculation',
                        'Automated data entry for energy, fuel, and waste',
                        'Basic Scope 3 (Commute & Travel)'
                    ],
                    highlight: false,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Corporate Pro',
                    price: '£99',
                    period: '/month',
                    description: 'Advanced tracking for growing companies.',
                    features: [
                        'Full Scope 3 (Multiple Sites)',
                        'Multi-site tracking',
                        'Year-on-year benchmarking'
                    ],
                    highlight: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom Quote',
                    period: '',
                    description: 'Custom solutions for complex needs.',
                    features: [
                        'API integrations with ERP/Accounting software',
                        'Custom emissions factors for specialized industries'
                    ],
                    highlight: false,
                    buttonText: 'Contact Sales'
                }
            ]
        },
        netzeroview: {
            title: "Net-Z Platform (The Netzero Platform)",
            plans: [
                {
                    name: 'SME Starter',
                    price: '£25',
                    period: '/month',
                    description: 'Showcase your sustainability journey.',
                    features: [
                        'Simple "Net Zero" badge for your website',
                        'Basic public-facing dashboard'
                    ],
                    highlight: false,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Large Company',
                    price: '£149',
                    period: '/month',
                    description: 'Comprehensive roadmapping and reporting.',
                    features: [
                        'Detailed roadmapping',
                        'Tracks progress against 2030/2050 targets',
                        'Internal reporting for boards'
                    ],
                    highlight: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom Quote',
                    period: '',
                    description: 'Full-scale sustainability management.',
                    features: [
                        'White-label platform',
                        'Group-wide sustainability progress tracking',
                        'Subsidiary management'
                    ],
                    highlight: false,
                    buttonText: 'Contact Sales'
                }
            ]
        },
        carboconnect: {
            title: "CarboConnect (Supplier Engagement Tool)",
            plans: [
                {
                    name: 'SME Starter',
                    price: '£49',
                    period: '/month',
                    description: 'For suppliers reporting to clients.',
                    features: [
                        'Small firms needing to report data upward',
                        'Often included in NetZeroView'
                    ],
                    highlight: false,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Large Company',
                    price: '£299 - £499',
                    period: '/month',
                    description: 'Automated engagement for key suppliers.',
                    features: [
                        'Engaging up to 200 key suppliers',
                        'Automated email requests',
                        'Data collection templates'
                    ],
                    highlight: true,
                    buttonText: 'Get Started'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom Quote',
                    period: '',
                    description: 'Global supply chain management.',
                    features: [
                        'Global supply chains (1,000+ suppliers)',
                        'Auditor-Ready data',
                        'Risk modeling'
                    ],
                    highlight: false,
                    buttonText: 'Contact Sales'
                }
            ]
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            <MinimalBackground />
            <ContactSalesModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

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

            {/* Main Content */}
            <main className="flex-grow flex flex-col p-4 md:p-12 lg:p-20 pt-10 md:pt-16">
                <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
                    >
                        Choose the plan that fits your organization's sustainability goals. No hidden fees.
                    </motion.p>
                </div>

                {/* Tabs & Pricing Cards */}
                <Tabs defaultValue="carbotracker" className="w-full max-w-7xl mx-auto">
                    <div className="flex justify-center mb-12">
                        <TabsList className="grid w-full max-w-2xl grid-cols-1 md:grid-cols-3 h-auto gap-2 bg-slate-100/50 p-1.5 rounded-2xl">
                            {['carbotracker', 'netzeroview', 'carboconnect'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300"
                                >
                                    {tab === 'carbotracker' ? 'Carbotracker' : tab === 'netzeroview' ? 'Net-Z Platform' : 'CarboConnect'}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {Object.entries(pricingData).map(([key, data]) => (
                        <TabsContent key={key} value={key} className="mt-4 relative z-10 focus-visible:outline-none">
                            <div className="mb-12 text-center">
                                <motion.h2
                                    key={data.title}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight"
                                >
                                    {data.title}
                                </motion.h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                                {data.plans.map((plan, index) => (
                                    <motion.div
                                        key={plan.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.15 }}
                                        whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.3 } }}
                                        className={`relative p-6 md:p-8 rounded-[2rem] border transition-all duration-300 flex flex-col group ${plan.highlight
                                            ? 'border-primary/50 bg-white/95 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 z-10'
                                            : 'border-slate-200 bg-white/80 hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
                                            } backdrop-blur-md`}
                                    >
                                        {plan.highlight && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground px-5 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 tracking-wide">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1 mb-4">
                                                <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                                                {plan.period && <span className="text-slate-500 font-medium text-sm lg:text-base">{plan.period}</span>}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                                        </div>

                                        <div className="flex-grow mb-8 border-t border-slate-100 pt-8">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Features</p>
                                            <ul className="space-y-4">
                                                {plan.features.map((feature, i) => (
                                                    <motion.li
                                                        key={feature}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + (index * 0.1) + (i * 0.05) }}
                                                        className="flex items-start gap-3 text-sm text-slate-700 font-medium group/item"
                                                    >
                                                        <div className="mt-0.5 rounded-full bg-primary/10 p-1 group-hover/item:bg-primary/20 transition-colors duration-300">
                                                            <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={3} />
                                                        </div>
                                                        <span className="leading-snug">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Button
                                            className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 relative overflow-hidden ${plan.highlight
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1'
                                                : 'bg-white text-slate-900 border-2 border-slate-100 hover:border-primary hover:text-primary hover:bg-slate-50'
                                                }`}
                                            variant={plan.highlight ? 'default' : 'outline'}
                                            size="lg"
                                            onClick={() => handlePlanAction(plan.name)}
                                        >
                                            <span className="relative z-10">{plan.buttonText}</span>
                                            {plan.highlight && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
                                            )}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
};

export default Pricing;
