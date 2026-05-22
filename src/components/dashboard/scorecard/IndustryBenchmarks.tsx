import { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, Building2, Award, Leaf, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface Benchmark {
  company_name: string;
  industry: string;
  avg_scope_1_intensity: number | null;
  avg_scope_2_intensity: number | null;
  avg_scope_3_intensity: number | null;
  avg_cdp_score: string | null;
  avg_ecovadis_score: number | null;
  sbti_adoption_rate: number | null;
  is_leader: boolean | null;
}

interface IndustryBenchmarksProps {
  benchmarks: Benchmark[];
  userIntensity: number;
  userCdpScore: string | null;
  userEcoVadisScore: number | null;
  userSbtiStatus: string | null;
  companyName: string;
  userIndustry: string | null;
}

const getCdpNumericValue = (score: string | null): number => {
  const scores: Record<string, number> = {
    'A': 100, 'A-': 90, 'B': 75, 'B-': 65, 'C': 50, 'C-': 40, 'D': 25, 'D-': 15, 'Not Rated': 0
  };
  return scores[score || ''] || 0;
};

const getSbtiNumericValue = (status: string | null): number => {
  const statuses: Record<string, number> = {
    'Targets Set': 100,
    'Near-term Targets': 80,
    'Long-term Targets': 60,
    'Committed': 40,
    'None': 0
  };
  return statuses[status || ''] || 0;
};

export const IndustryBenchmarks = ({ 
  benchmarks, 
  userIntensity, 
  userCdpScore,
  userEcoVadisScore,
  userSbtiStatus,
  companyName,
  userIndustry
}: IndustryBenchmarksProps) => {
  const { currencySymbol } = useDashboard();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Group benchmarks by industry
  const industries = [...new Set(benchmarks.map(b => b.industry))].sort();

  // Filter to same industry for comparison charts, fallback to all if no match
  const sameIndustryBenchmarks = userIndustry 
    ? benchmarks.filter(b => b.industry === userIndustry)
    : benchmarks;
  const comparisonBenchmarks = sameIndustryBenchmarks.length > 0 ? sameIndustryBenchmarks : benchmarks;

  // Get top performers from same industry
  const topPerformers = [...comparisonBenchmarks]
    .map(b => ({
      ...b,
      totalIntensity: (b.avg_scope_1_intensity || 0) + (b.avg_scope_2_intensity || 0) + (b.avg_scope_3_intensity || 0)
    }))
    .sort((a, b) => a.totalIntensity - b.totalIntensity)
    .slice(0, 10);

  // Calculate average across same industry leaders
  const avgLeaderIntensity = comparisonBenchmarks.reduce((sum, b) => 
    sum + (b.avg_scope_1_intensity || 0) + (b.avg_scope_2_intensity || 0) + (b.avg_scope_3_intensity || 0), 0
  ) / (comparisonBenchmarks.length || 1);

  const industryLabel = sameIndustryBenchmarks.length > 0 && userIndustry ? userIndustry : 'All Industries';

  // Prepare chart data for intensity comparison
  const intensityChartData = [
    {
      name: companyName || 'Your Company',
      intensity: userIntensity,
      isUser: true
    },
    ...topPerformers.slice(0, 5).map(b => ({
      name: b.company_name,
      intensity: b.totalIntensity,
      isUser: false
    }))
  ].sort((a, b) => a.intensity - b.intensity);

  // ESG comparison data
  const esgChartData = [
    {
      name: companyName || 'Your Company',
      CDP: getCdpNumericValue(userCdpScore),
      EcoVadis: userEcoVadisScore || 0,
      SBTi: getSbtiNumericValue(userSbtiStatus),
      isUser: true
    },
    ...topPerformers.slice(0, 4).map(b => ({
      name: b.company_name,
      CDP: getCdpNumericValue(b.avg_cdp_score),
      EcoVadis: b.avg_ecovadis_score || 0,
      SBTi: b.sbti_adoption_rate || 0,
      isUser: false
    }))
  ];

  const labelFormatter = (value: string) => {
    if (isMobile && value.length > 10) {
      return value.substring(0, 8) + '...';
    }
    return value;
  };

  const ComparisonRow = ({ benchmark }: { benchmark: Benchmark }) => {
    const totalIntensity = (benchmark.avg_scope_1_intensity || 0) + 
                           (benchmark.avg_scope_2_intensity || 0) + 
                           (benchmark.avg_scope_3_intensity || 0);
    const difference = userIntensity - totalIntensity;
    const isLower = difference < 0;
    const percentDiff = totalIntensity > 0 ? (difference / totalIntensity * 100) : 0;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 hover:bg-muted/50 px-2 rounded transition-colors gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{benchmark.company_name}</div>
            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="truncate">{benchmark.industry}</span>
              {benchmark.avg_cdp_score && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
                  CDP: {benchmark.avg_cdp_score}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-right pl-[52px] sm:pl-0">
          <div>
            <div className="font-semibold text-sm sm:text-base">{totalIntensity.toFixed(1)}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">tCO₂e/M{currencySymbol}</div>
          </div>
          <div className={`flex items-center gap-1 min-w-[80px] sm:min-w-[100px] justify-end text-sm sm:text-base ${
            isLower ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {isLower ? (
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : difference > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            <span className="font-medium">
              {Math.abs(percentDiff).toFixed(0)}% {isLower ? 'better' : difference > 0 ? 'higher' : 'same'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userIntensity.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Your Intensity (tCO₂e/M{currencySymbol})</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgLeaderIntensity.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Leaders Average</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${userIntensity <= avgLeaderIntensity ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                <Leaf className={`h-6 w-6 ${userIntensity <= avgLeaderIntensity ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${userIntensity <= avgLeaderIntensity ? 'text-green-600' : 'text-orange-600'}`}>
                  {userIntensity <= avgLeaderIntensity ? 'Leader' : 'Gap to Close'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {userIntensity <= avgLeaderIntensity 
                    ? 'Below average intensity' 
                    : `${((userIntensity - avgLeaderIntensity) / avgLeaderIntensity * 100).toFixed(0)}% above leaders`
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intensity Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Intensity Comparison — {industryLabel}</CardTitle>
          <CardDescription>Your performance vs top {industryLabel.toLowerCase()} leaders (lower is better)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intensityChartData} layout="vertical" margin={{ left: isMobile ? 0 : 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" unit={` tCO₂e/M${currencySymbol}`} tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis type="category" dataKey="name" width={isMobile ? 60 : 100} tick={{ fontSize: isMobile ? 10 : 12 }} tickFormatter={labelFormatter} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} tCO₂e/M${currencySymbol}`, 'Intensity']}
                />
                <Bar dataKey="intensity" radius={[0, 4, 4, 0]}>
                  {intensityChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isUser ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ESG Scores Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Performance Comparison — {industryLabel}</CardTitle>
          <CardDescription>CDP, EcoVadis, and SBTi adoption compared to {industryLabel.toLowerCase()} leaders (higher is better)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={esgChartData} margin={{ left: isMobile ? 0 : 20, right: 20, top: 10, bottom: isMobile ? 30 : 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 9 : 11 }} 
                  tickFormatter={labelFormatter}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 30}
                />
                <YAxis domain={[0, 100]} width={isMobile ? 30 : 40} tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar dataKey="CDP" fill="hsl(var(--chart-1))" name="CDP Score" />
                <Bar dataKey="EcoVadis" fill="hsl(var(--chart-2))" name="EcoVadis" />
                <Bar dataKey="SBTi" fill="hsl(var(--chart-3))" name="SBTi %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark by Industry</CardTitle>
          <CardDescription>Compare against leaders in specific sectors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={industries[0]} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
              {industries.map(industry => (
                <TabsTrigger key={industry} value={industry} className="text-xs">
                  {industry}
                </TabsTrigger>
              ))}
            </TabsList>
            {industries.map(industry => (
              <TabsContent key={industry} value={industry}>
                <div className="divide-y">
                  {benchmarks
                    .filter(b => b.industry === industry)
                    .sort((a, b) => {
                      const aTotal = (a.avg_scope_1_intensity || 0) + (a.avg_scope_2_intensity || 0) + (a.avg_scope_3_intensity || 0);
                      const bTotal = (b.avg_scope_1_intensity || 0) + (b.avg_scope_2_intensity || 0) + (b.avg_scope_3_intensity || 0);
                      return aTotal - bTotal;
                    })
                    .map(benchmark => (
                      <ComparisonRow key={benchmark.company_name} benchmark={benchmark} />
                    ))
                  }
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
