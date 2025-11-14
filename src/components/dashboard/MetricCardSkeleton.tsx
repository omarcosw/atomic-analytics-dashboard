import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const MetricCardSkeleton = () => {
  return (
    <Card 
      className="overflow-hidden border border-border/40 h-[160px]"
      style={{ borderRadius: '14px' }}
    >
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted animate-shimmer" />
          <div className="h-3 w-32 rounded bg-muted animate-shimmer" />
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-4">
        <div className="h-11 w-40 rounded bg-muted animate-shimmer mb-3" />
        <div className="h-3 w-28 rounded bg-muted animate-shimmer" />
      </CardContent>
    </Card>
  );
};

export const HeroMetricCardSkeleton = () => {
  return (
    <Card 
      className="overflow-hidden border border-border/40 col-span-2 min-h-[200px]"
      style={{ borderRadius: '14px' }}
    >
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-muted animate-shimmer" />
          <div className="h-4 w-40 rounded bg-muted animate-shimmer" />
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-14 w-48 rounded bg-muted animate-shimmer" />
            <div className="h-3 w-56 rounded bg-muted animate-shimmer" />
            <div className="h-3 w-40 rounded bg-muted animate-shimmer" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full h-20 rounded bg-muted animate-shimmer" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton = ({ title }: { title: string }) => {
  return (
    <div 
      className="border border-border/40 overflow-hidden p-6 bg-white"
      style={{ borderRadius: '14px' }}
    >
      <div className="mb-6">
        <div className="h-5 w-48 rounded bg-muted animate-shimmer mb-2" />
        <div className="h-3 w-32 rounded bg-muted animate-shimmer" />
      </div>
      <div className="h-[300px] w-full rounded bg-muted animate-shimmer" />
    </div>
  );
};
