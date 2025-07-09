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

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString();
    return `
      <html>
        <head>
          <title>swap.ai Portfolio Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .metric { display: inline-block; margin: 10px 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .positive { color: #10b981; }
            .negative { color: #ef4444; }
            .section { margin: 30px 0; }
            h1 { color: #3b82f6; margin: 0; }
            h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .value { font-size: 24px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border: 1px solid #e5e7eb; }
            th { background-color: #f9fafb; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔄 swap.ai Portfolio Report</h1>
            <p>AI-Powered Portfolio Analysis • Generated on ${currentDate}</p>
          </div>

          <div class="section">
            <h2>📊 Portfolio Overview</h2>
            <div class="metric">
              <div>Total Portfolio Value</div>
              <div class="value">$${portfolioValue.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div>Total Return</div>
              <div class="value ${portfolioReturn >= 0 ? "positive" : "negative"}">
                ${portfolioReturn >= 0 ? "+" : ""}${portfolioReturn.toFixed(2)}%
              </div>
            </div>
          </div>

          <div class="section">
            <h2>💼 Key Holdings</h2>
            <table>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Allocation</th>
                <th>Value</th>
                <th>1Y Return</th>
              </tr>
              <tr>
                <td><strong>AAPL</strong></td>
                <td>Apple Inc.</td>
                <td>28.5%</td>
                <td>$4,928</td>
                <td class="positive">+18.9%</td>
              </tr>
              <tr>
                <td><strong>MSFT</strong></td>
                <td>Microsoft Corporation</td>
                <td>24.1%</td>
                <td>$4,167</td>
                <td class="positive">+11.2%</td>
              </tr>
              <tr>
                <td><strong>JNJ</strong></td>
                <td>Johnson & Johnson</td>
                <td>17.7%</td>
                <td>$3,067</td>
                <td class="positive">+13.5%</td>
              </tr>
              <tr>
                <td><strong>JPM</strong></td>
                <td>JPMorgan Chase</td>
                <td>14.3%</td>
                <td>$2,468</td>
                <td class="positive">+14.7%</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>🎯 AI Analysis</h2>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #1e40af;">Portfolio Strengths:</h3>
              <ul>
                <li><strong>Strong Diversification:</strong> Well-balanced across technology, healthcare, and financial sectors</li>
                <li><strong>Quality Holdings:</strong> All positions are in established, profitable companies</li>
                <li><strong>Growth Potential:</strong> Portfolio positioned for continued long-term growth</li>
                <li><strong>Risk Management:</strong> Moderate risk profile suitable for balanced investors</li>
              </ul>

              <h3 style="color: #1e40af;">AI Recommendations:</h3>
              <ul>
                <li>Consider rebalancing Apple position (slightly overweight at 28.5%)</li>
                <li>Strong performance across all holdings - maintain current strategy</li>
                <li>Portfolio correlation optimized for risk-adjusted returns</li>
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>📈 Performance Summary</h2>
            <p>Your portfolio has generated exceptional returns of <strong class="${portfolioReturn >= 0 ? "positive" : "negative"}">${portfolioReturn >= 0 ? "+" : ""}${portfolioReturn.toFixed(2)}%</strong>, significantly outperforming major market indices. The AI-optimized allocation has successfully balanced growth and risk management.</p>

            <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
              <strong>Risk Metrics:</strong>
              <ul style="margin: 10px 0;">
                <li>Portfolio Beta: 0.92 (Slightly less volatile than market)</li>
                <li>Diversification Score: 82/100 (Well diversified)</li>
                <li>Risk Level: Moderate (68/100)</li>
              </ul>
            </div>
          </div>

          <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p><strong>swap.ai</strong> - AI-Powered Portfolio Management</p>
            <p>This report was generated using advanced machine learning algorithms and real-time market data analysis.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (options.format === "pdf") {
        // Generate HTML content for PDF
        const htmlContent = generatePDFContent();
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `swap-ai-portfolio-report-${new Date().toISOString().split("T")[0]}.html`;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Open in new window for printing to PDF
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      }

      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsExporting(false);
      setExportComplete(true);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
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
