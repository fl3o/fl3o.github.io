import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { BarChart3 } from "lucide-react";
import type { RatioEntry } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RatioChartProps {
  entries: RatioEntry[];
}

export function RatioChart({ entries }: RatioChartProps) {
  const chartData = entries
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .map((entry) => ({
      date: format(new Date(entry.recordedAt), "dd MMM", { locale: fr }),
      ratio: entry.ratio,
      upload: entry.upload,
      download: entry.download,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Évolution du Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune donnée disponible</p>
              <p className="text-sm">Enregistrez vos statistiques pour voir l'évolution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Évolution du Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]" data-testid="chart-ratio-evolution">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ratioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
                formatter={(value: number) => [value.toFixed(2), "Ratio"]}
              />
              <Area
                type="monotone"
                dataKey="ratio"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#ratioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
