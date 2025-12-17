import type { RatioStats, Recommendation, RatioEntry } from "@shared/schema";

export function calculateRatio(upload: number, download: number): number {
  if (download === 0) return 0;
  return Math.round((upload / download) * 100) / 100;
}

export function getRatioStatus(ratio: number): RatioStats["status"] {
  if (ratio >= 2) return "excellent";
  if (ratio >= 1) return "good";
  if (ratio >= 0.5) return "warning";
  return "critical";
}

export function getRatioStatusColor(status: RatioStats["status"]): string {
  switch (status) {
    case "excellent":
      return "text-emerald-500";
    case "good":
      return "text-chart-2";
    case "warning":
      return "text-amber-500";
    case "critical":
      return "text-destructive";
  }
}

export function getRatioStatusBorderColor(status: RatioStats["status"]): string {
  switch (status) {
    case "excellent":
      return "border-l-emerald-500";
    case "good":
      return "border-l-chart-2";
    case "warning":
      return "border-l-amber-500";
    case "critical":
      return "border-l-destructive";
  }
}

export function getRatioStatusLabel(status: RatioStats["status"]): string {
  switch (status) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Bon";
    case "warning":
      return "À surveiller";
    case "critical":
      return "Critique";
  }
}

export function formatSize(sizeInGB: number): string {
  if (sizeInGB >= 1000) {
    return `${(sizeInGB / 1000).toFixed(2)} TB`;
  }
  return `${sizeInGB.toFixed(2)} GB`;
}

export function calculateRequiredUpload(
  currentUpload: number,
  currentDownload: number,
  targetRatio: number
): number {
  const required = targetRatio * currentDownload - currentUpload;
  return Math.max(0, Math.round(required * 100) / 100);
}

export function getTrend(entries: RatioEntry[]): RatioStats["trend"] {
  if (entries.length < 2) return "stable";
  const sorted = [...entries].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );
  const latest = sorted[0].ratio;
  const previous = sorted[1].ratio;
  if (latest > previous + 0.05) return "up";
  if (latest < previous - 0.05) return "down";
  return "stable";
}

export function generateRecommendations(
  upload: number,
  download: number,
  ratio: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const status = getRatioStatus(ratio);

  if (status === "critical") {
    recommendations.push({
      id: "critical-warning",
      priority: "high",
      title: "Ratio critique",
      description: `Votre ratio est de ${ratio.toFixed(2)}. Risque de ban ou restrictions.`,
      action: `Uploadez ${calculateRequiredUpload(upload, download, 0.5).toFixed(2)} GB pour atteindre 0.5`,
      icon: "AlertTriangle",
    });
  }

  if (ratio < 1) {
    const neededFor1 = calculateRequiredUpload(upload, download, 1);
    recommendations.push({
      id: "reach-1",
      priority: status === "critical" ? "high" : "medium",
      title: "Atteindre le ratio 1.0",
      description: "Un ratio de 1.0 est le minimum pour être un bon partageur.",
      action: `Uploadez ${neededFor1.toFixed(2)} GB supplémentaires`,
      icon: "Target",
    });
  }

  if (ratio >= 0.5 && ratio < 2) {
    recommendations.push({
      id: "improve-ratio",
      priority: "medium",
      title: "Améliorer votre ratio",
      description: "Seedez vos torrents plus longtemps pour augmenter l'upload.",
      action: "Laissez vos torrents en seed 24/7",
      icon: "TrendingUp",
    });
  }

  if (download > 100 && ratio < 1.5) {
    recommendations.push({
      id: "large-download",
      priority: "medium",
      title: "Volume élevé de téléchargement",
      description: `Vous avez téléchargé ${formatSize(download)}. Pensez à équilibrer.`,
      action: "Privilégiez les torrents avec peu de seeders",
      icon: "Download",
    });
  }

  if (ratio >= 1 && ratio < 2) {
    recommendations.push({
      id: "good-progress",
      priority: "low",
      title: "Bon ratio",
      description: "Vous êtes sur la bonne voie. Continuez !",
      action: "Visez le ratio 2.0 pour plus de sécurité",
      icon: "CheckCircle",
    });
  }

  if (ratio >= 2) {
    recommendations.push({
      id: "excellent",
      priority: "low",
      title: "Excellent ratio",
      description: "Votre ratio est excellent. Vous êtes un super partageur !",
      action: "Maintenez ce niveau pour rester safe",
      icon: "Star",
    });
  }

  recommendations.push({
    id: "tips-freeleech",
    priority: "low",
    title: "Conseil : Freeleech",
    description: "Profitez des promotions freeleech pour télécharger sans impact.",
    icon: "Gift",
  });

  return recommendations.slice(0, 5);
}
