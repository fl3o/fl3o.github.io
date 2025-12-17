import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  AlertTriangle, 
  Target, 
  TrendingUp, 
  Download, 
  CheckCircle, 
  Star, 
  Gift 
} from "lucide-react";
import type { Recommendation } from "@shared/schema";

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const iconMap: Record<string, typeof AlertTriangle> = {
  AlertTriangle,
  Target,
  TrendingUp,
  Download,
  CheckCircle,
  Star,
  Gift,
};

const priorityStyles = {
  high: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    border: "border-l-destructive",
    bg: "bg-destructive/5",
  },
  medium: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    border: "border-l-amber-500",
    bg: "bg-amber-500/5",
  },
  low: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/5",
  },
};

const priorityLabels = {
  high: "Urgent",
  medium: "Important",
  low: "Conseil",
};

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Entrez vos statistiques pour obtenir des recommandations personnalisées</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-muted-foreground" />
          Recommandations
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const Icon = iconMap[rec.icon] || Lightbulb;
          const styles = priorityStyles[rec.priority];

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border-l-4 ${styles.border} ${styles.bg}`}
              data-testid={`recommendation-${rec.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-background/80">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={styles.badge}
                    >
                      {priorityLabels[rec.priority]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  {rec.action && (
                    <p className="text-sm font-medium mt-2 text-foreground">
                      {rec.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
