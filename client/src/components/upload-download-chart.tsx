import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUpDown } from "lucide-react";
import type { RatioEntry } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UploadDownloadChartProps {
  entries: RatioEntry[];
}

export function UploadDownloadChart({ entries }: UploadDownloadChartProps) {
  const chartData = entries
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .slice(-10)
    .map((entry) => ({
      date: format(new Date(entry.recordedAt), "dd MMM", { locale: fr }),
      upload: entry.upload,
      download: entry.download,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
            Upload vs Download
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <ArrowUpDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune donnée disponible</p>
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
          <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
          Upload vs Download
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]" data-testid="chart-upload-download">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value.toFixed(2)} GB`]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
              <Bar 
                dataKey="upload" 
                name="Upload" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="download" 
                name="Download" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
