import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Share,
  FileText,
  BarChart3,
  Mail,
  Link2,
  CheckCircle,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportOptions {
  format: "pdf" | "csv" | "excel";
  includeCharts: boolean;
  includeAnalytics: boolean;
  includeHoldings: boolean;
  includePerformance: boolean;
  timeframe: "1M" | "3M" | "6M" | "1Y" | "ALL";
  emailRecipients: string[];
}

interface ExportModalProps {
  onClose: () => void;
  portfolioValue: number;
  portfolioReturn: number;
}

export function ExportModal({
  onClose,
  portfolioValue,
  portfolioReturn,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [options, setOptions] = useState<ExportOptions>({
    format: "pdf",
    includeCharts: true,
    includeAnalytics: true,
    includeHoldings: true,
    includePerformance: true,
    timeframe: "1Y",
    emailRecipients: [],
  });

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsExporting(false);
    setExportComplete(true);
  };

  const generateShareUrl = () => {
    const url = `https://swap.ai/portfolio/shared/${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Export & Share Portfolio
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!exportComplete ? (
            <div className="space-y-6">
              {/* Portfolio Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Portfolio Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Value:</span>
                    <div className="font-bold text-lg">
                      ${portfolioValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Return:</span>
                    <div
                      className={cn(
                        "font-bold text-lg",
                        portfolioReturn >= 0
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {portfolioReturn >= 0 ? "+" : ""}
                      {portfolioReturn.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Export Format</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "pdf", label: "PDF Report", icon: FileText },
                    { value: "csv", label: "CSV Data", icon: Download },
                    { value: "excel", label: "Excel File", icon: BarChart3 },
                  ].map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() =>
                          updateOption("format", format.value as any)
                        }
                        className={cn(
                          "p-4 border-2 rounded-lg text-center transition-colors",
                          options.format === format.value
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">
                          {format.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Include Options */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  What to Include
                </Label>
                <div className="space-y-3">
                  {[
                    {
                      key: "includeHoldings",
                      label: "Holdings Details",
                      description: "Individual stock positions and allocations",
                    },
                    {
                      key: "includePerformance",
                      label: "Performance Metrics",
                      description: "Returns, Sharpe ratio, and other metrics",
                    },
                    {
                      key: "includeAnalytics",
                      label: "Advanced Analytics",
                      description: "Risk analysis and optimization insights",
                    },
                    {
                      key: "includeCharts",
                      label: "Charts & Visualizations",
                      description: "Performance charts and allocation graphs",
                    },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                      <Switch
                        checked={
                          options[option.key as keyof ExportOptions] as boolean
                        }
                        onCheckedChange={(checked) =>
                          updateOption(option.key as any, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Frame */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Time Frame</Label>
                <Select
                  value={options.timeframe}
                  onValueChange={(value) =>
                    updateOption("timeframe", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1M">Last Month</SelectItem>
                    <SelectItem value="3M">Last 3 Months</SelectItem>
                    <SelectItem value="6M">Last 6 Months</SelectItem>
                    <SelectItem value="1Y">Last Year</SelectItem>
                    <SelectItem value="ALL">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Share Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Share Portfolio
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={generateShareUrl}
                    className="h-16"
                  >
                    <div className="text-center">
                      <Link2 className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Generate Link</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16">
                    <div className="text-center">
                      <Mail className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm">Email Report</div>
                    </div>
                  </Button>
                </div>

                {shareUrl && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800 mb-1">
                      Share link copied to clipboard!
                    </div>
                    <div className="text-xs text-green-600 break-all">
                      {shareUrl}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <Download className="h-4 w-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export {options.format.toUpperCase()}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Export Complete */
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Export Complete!</h3>
              <p className="text-muted-foreground mb-6">
                Your portfolio report has been generated and will download
                shortly.
              </p>
              <div className="space-y-3">
                <Button onClick={onClose} className="w-full">
                  Done
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setExportComplete(false)}
                  className="w-full"
                >
                  Export Another Format
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
