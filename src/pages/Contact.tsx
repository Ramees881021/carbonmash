import { MinimalBackground } from '@/components/landing/MinimalBackground';
import { AlmacLogo } from '@/components/ui/AlmacLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, ArrowLeft, Linkedin, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
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
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-12 lg:p-20">
                <div className="max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 md:mb-16"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">Get in Touch</h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                                        <p className="text-slate-600 mb-1">Our friendly team is here to help.</p>
                                        <a href="mailto:info@carbonmash.com" className="text-primary font-medium hover:underline">info@carbonmash.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Linkedin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Follow Us</h3>
                                        <p className="text-slate-600 mb-1">Stay updated with our latest news.</p>
                                        <a href="https://www.linkedin.com/company/carbonmash/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">CarbonMash on LinkedIn</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Our Location</h3>
                                        <p className="text-slate-600 mb-1">CARBONMASH LTD <br /> UNITED KINGDOM</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                                </div>

                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
