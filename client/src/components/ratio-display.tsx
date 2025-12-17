import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Upload, Download, Activity } from "lucide-react";
import type { RatioStats } from "@shared/schema";
import { 
  getRatioStatusColor, 
  getRatioStatusLabel, 
  formatSize 
} from "@/lib/ratio-utils";

interface RatioDisplayProps {
  stats: RatioStats;
}

export function RatioDisplay({ stats }: RatioDisplayProps) {
  const { currentRatio, upload, download, status, trend } = stats;
  const statusColor = getRatioStatusColor(status);
  const statusLabel = getRatioStatusLabel(status);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className="relative overflow-visible">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Ratio Actuel
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={statusColor}
            data-testid="badge-ratio-status"
          >
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <span 
              className={`text-6xl font-bold tabular-nums ${statusColor}`}
              data-testid="text-ratio-value"
            >
              {currentRatio.toFixed(2)}
            </span>
            <div className={`flex items-center justify-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm">
                {trend === "up" ? "En hausse" : trend === "down" ? "En baisse" : "Stable"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-md bg-emerald-500/10">
              <Upload className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Upload</p>
              <p className="text-lg font-semibold tabular-nums" data-testid="text-upload-value">
                {formatSize(upload)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-md bg-blue-500/10">
              <Download className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Download</p>
              <p className="text-lg font-semibold tabular-nums" data-testid="text-download-value">
                {formatSize(download)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
