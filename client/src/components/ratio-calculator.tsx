import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Save, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ratioInputSchema, type RatioInput } from "@shared/schema";
import { calculateRatio, getRatioStatus, getRatioStatusColor, getRatioStatusLabel } from "@/lib/ratio-utils";

interface RatioCalculatorProps {
  onCalculate: (upload: number, download: number) => void;
  onSave: (upload: number, download: number, ratio: number) => void;
  initialUpload?: number;
  initialDownload?: number;
  isSaving?: boolean;
}

export function RatioCalculator({ 
  onCalculate, 
  onSave, 
  initialUpload = 0, 
  initialDownload = 0,
  isSaving = false 
}: RatioCalculatorProps) {
  const [calculatedRatio, setCalculatedRatio] = useState<number | null>(null);

  const form = useForm<RatioInput>({
    resolver: zodResolver(ratioInputSchema),
    defaultValues: {
      upload: initialUpload,
      download: initialDownload,
    },
  });

  const uploadValue = form.watch("upload");
  const downloadValue = form.watch("download");

  useEffect(() => {
    if (uploadValue >= 0 && downloadValue > 0) {
      const ratio = calculateRatio(uploadValue, downloadValue);
      setCalculatedRatio(ratio);
    } else {
      setCalculatedRatio(null);
    }
  }, [uploadValue, downloadValue]);

  const handleCalculate = (data: RatioInput) => {
    onCalculate(data.upload, data.download);
  };

  const handleSave = () => {
    if (calculatedRatio !== null) {
      onSave(uploadValue, downloadValue, calculatedRatio);
    }
  };

  const handleReset = () => {
    form.reset({ upload: 0, download: 0 });
    setCalculatedRatio(null);
  };

  const status = calculatedRatio !== null ? getRatioStatus(calculatedRatio) : null;
  const statusColor = status ? getRatioStatusColor(status) : "";
  const statusLabel = status ? getRatioStatusLabel(status) : "";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-muted-foreground" />
          Calculateur de Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="upload"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Upload (GB)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pr-10 text-right tabular-nums"
                          data-testid="input-upload"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          GB
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="download"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Download (GB)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0.001"
                          placeholder="0.00"
                          className="pr-10 text-right tabular-nums"
                          data-testid="input-download"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          GB
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {calculatedRatio !== null && (
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Ratio calculé
                </p>
                <p className={`text-4xl font-bold tabular-nums ${statusColor}`} data-testid="text-calculated-ratio">
                  {calculatedRatio.toFixed(2)}
                </p>
                <p className={`text-sm mt-1 ${statusColor}`}>{statusLabel}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                data-testid="button-calculate"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculer
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSave}
                disabled={calculatedRatio === null || isSaving}
                className="flex-1"
                data-testid="button-save"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleReset}
                data-testid="button-reset"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
