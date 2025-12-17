import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Target, ArrowRight, Upload } from "lucide-react";
import { calculateRequiredUpload, formatSize, getRatioStatus, getRatioStatusColor } from "@/lib/ratio-utils";

interface GoalCalculatorProps {
  currentUpload: number;
  currentDownload: number;
  currentRatio: number;
}

export function GoalCalculator({ currentUpload, currentDownload, currentRatio }: GoalCalculatorProps) {
  const [targetRatio, setTargetRatio] = useState<number>(Math.max(1, Math.ceil(currentRatio)));
  const [requiredUpload, setRequiredUpload] = useState<number>(0);

  useEffect(() => {
    const required = calculateRequiredUpload(currentUpload, currentDownload, targetRatio);
    setRequiredUpload(required);
  }, [currentUpload, currentDownload, targetRatio]);

  const targetStatus = getRatioStatus(targetRatio);
  const targetStatusColor = getRatioStatusColor(targetStatus);

  const progressPercent = currentRatio > 0 ? Math.min(100, (currentRatio / targetRatio) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          Calculateur d'Objectif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Ratio cible
            </Label>
            <span className={`text-2xl font-bold tabular-nums ${targetStatusColor}`} data-testid="text-target-ratio">
              {targetRatio.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[targetRatio]}
            onValueChange={(value) => setTargetRatio(value[0])}
            min={0.5}
            max={5}
            step={0.1}
            className="w-full"
            data-testid="slider-target-ratio"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5</span>
            <span>1.0</span>
            <span>2.0</span>
            <span>3.0</span>
            <span>5.0</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Progression vers l'objectif
          </Label>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {progressPercent.toFixed(0)}% de l'objectif atteint
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Upload requis
                </p>
                <p className="text-xl font-bold tabular-nums" data-testid="text-required-upload">
                  {requiredUpload > 0 ? formatSize(requiredUpload) : "Objectif atteint !"}
                </p>
              </div>
            </div>
            {requiredUpload > 0 && (
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          {requiredUpload > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              Vous devez uploader <strong>{formatSize(requiredUpload)}</strong> supplémentaires pour atteindre un ratio de {targetRatio.toFixed(1)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
