import { useDashboard } from '@/contexts/DashboardContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Menu } from 'lucide-react';

const currentYear = new Date().getFullYear();
// Allow selecting years from 2000 to current year (open backtracking)
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

const currencies = [
  { value: 'GBP', label: '£ GBP' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
];

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { selectedYear, setSelectedYear, currency, setCurrency } = useDashboard();

  return (
    <header className="bg-card border-b px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="p-1.5 -ml-1 rounded-md hover:bg-muted text-muted-foreground lg:hidden transition-colors"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:inline">
            Reporting Period
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[85px] sm:w-32 h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-xs sm:text-sm">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[75px] sm:w-28 h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value} className="text-xs sm:text-sm">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};
