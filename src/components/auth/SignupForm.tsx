import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const INDUSTRIES = [
  'Manufacturing',
  'Technology',
  'Healthcare',
  'Financial Services',
  'Energy & Utilities',
  'Retail & Consumer Goods',
  'Transportation & Logistics',
  'Construction & Real Estate',
  'Agriculture & Food',
  'Mining & Metals',
  'Chemicals',
  'Pharmaceuticals',
  'Telecommunications',
  'Automotive',
  'Aerospace & Defence',
  'Hospitality & Tourism',
  'Education',
  'Government & Public Sector',
  'Other',
];

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!companyName.trim()) {
      toast.error('Please enter your company name');
      return;
    }

    if (!industry) {
      toast.error('Please select your industry');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, companyName.trim(), industry);

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Account created! Please check your email to verify.');
      onSwitchToLogin();
    }
  };

  const PasswordCheck = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={passed ? 'text-primary' : 'text-muted-foreground'}>{label}</span>
    </div>
  );

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="text-center space-y-2 px-0">
        <CardTitle className="text-2xl font-bold" style={{ color: 'hsl(222, 47%, 11%)' }}>Create Account</CardTitle>
        <CardDescription style={{ color: 'hsl(215, 16%, 47%)' }}>Join Netzero Platform to track your sustainability journey</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: 'hsl(222, 47%, 11%)' }}>Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" style={{ color: 'hsl(222, 47%, 11%)' }}>Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" style={{ color: 'hsl(222, 47%, 11%)' }}>Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: 'hsl(222, 47%, 11%)' }}>Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="space-y-1 mt-2 p-3 bg-muted rounded-md">
                <PasswordCheck passed={passwordChecks.length} label="At least 8 characters" />
                <PasswordCheck passed={passwordChecks.uppercase} label="One uppercase letter" />
                <PasswordCheck passed={passwordChecks.lowercase} label="One lowercase letter" />
                <PasswordCheck passed={passwordChecks.number} label="One number" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: 'hsl(222, 47%, 11%)' }}>Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-2 text-sm mt-1">
                {passwordsMatch ? (
                  <>
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-primary">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">Passwords don't match</span>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 px-0">
          <Button type="submit" className="w-full" disabled={loading || !isPasswordValid || !passwordsMatch}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
