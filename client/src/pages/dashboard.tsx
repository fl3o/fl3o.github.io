import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RatioDisplay } from "@/components/ratio-display";
import { RatioCalculator } from "@/components/ratio-calculator";
import { GoalCalculator } from "@/components/goal-calculator";
import { RecommendationsPanel } from "@/components/recommendations-panel";
import { RatioChart } from "@/components/ratio-chart";
import { UploadDownloadChart } from "@/components/upload-download-chart";
import { HistoryTable } from "@/components/history-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import type { RatioEntry, RatioStats, Recommendation } from "@shared/schema";
import { 
  calculateRatio, 
  getRatioStatus, 
  getTrend, 
  generateRecommendations 
} from "@/lib/ratio-utils";

export default function Dashboard() {
  const { toast } = useToast();
  const [currentStats, setCurrentStats] = useState<{
    upload: number;
    download: number;
    ratio: number;
  } | null>(null);

  const { data: entries = [], isLoading } = useQuery<RatioEntry[]>({
    queryKey: ["/api/entries"],
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: { upload: number; download: number; ratio: number }) => {
      const res = await apiRequest("POST", "/api/entries", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Enregistré",
        description: "Vos statistiques ont été sauvegardées.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Supprimé",
        description: "L'entrée a été supprimée.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const latestEntry = useMemo(() => {
    if (entries.length === 0) return null;
    return [...entries].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    )[0];
  }, [entries]);

  const stats: RatioStats = useMemo(() => {
    if (currentStats) {
      return {
        currentRatio: currentStats.ratio,
        upload: currentStats.upload,
        download: currentStats.download,
        status: getRatioStatus(currentStats.ratio),
        trend: getTrend(entries),
      };
    }
    if (latestEntry) {
      return {
        currentRatio: latestEntry.ratio,
        upload: latestEntry.upload,
        download: latestEntry.download,
        status: getRatioStatus(latestEntry.ratio),
        trend: getTrend(entries),
      };
    }
    return {
      currentRatio: 0,
      upload: 0,
      download: 0,
      status: "critical",
      trend: "stable",
    };
  }, [currentStats, latestEntry, entries]);

  const recommendations: Recommendation[] = useMemo(() => {
    if (stats.upload === 0 && stats.download === 0) return [];
    return generateRecommendations(stats.upload, stats.download, stats.currentRatio);
  }, [stats]);

  const handleCalculate = (upload: number, download: number) => {
    const ratio = calculateRatio(upload, download);
    setCurrentStats({ upload, download, ratio });
  };

  const handleSave = (upload: number, download: number, ratio: number) => {
    createEntryMutation.mutate({ upload, download, ratio });
  };

  const handleDelete = (id: string) => {
    deleteEntryMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Ratio Master</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg lg:col-span-2" />
            <Skeleton className="h-[400px] rounded-lg lg:col-span-2" />
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="text-app-title">Ratio Master</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Calculateur et optimiseur de ratio
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RatioDisplay stats={stats} />
          <div className="lg:col-span-2">
            <RatioCalculator
              onCalculate={handleCalculate}
              onSave={handleSave}
              initialUpload={stats.upload}
              initialDownload={stats.download}
              isSaving={createEntryMutation.isPending}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalCalculator
            currentUpload={stats.upload}
            currentDownload={stats.download}
            currentRatio={stats.currentRatio}
          />
          <RecommendationsPanel recommendations={recommendations} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RatioChart entries={entries} />
          <UploadDownloadChart entries={entries} />
        </section>

        <section>
          <HistoryTable
            entries={entries}
            onDelete={handleDelete}
            isDeleting={deleteEntryMutation.isPending}
          />
        </section>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Ratio Master - Optimisez votre ratio de partage</p>
        </div>
      </footer>
    </div>
  );
}
