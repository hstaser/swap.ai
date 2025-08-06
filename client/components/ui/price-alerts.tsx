import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

interface AlertFormData {
  symbol: string;
  targetPrice: string;
  condition: "above" | "below";
}

const mockAlerts: PriceAlert[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 182.52,
    targetPrice: 190.0,
    condition: "above",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    currentPrice: 238.77,
    targetPrice: 220.0,
    condition: "below",
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 138.21,
    targetPrice: 145.0,
    condition: "above",
    isActive: false,
    createdAt: new Date("2024-01-08"),
    triggeredAt: new Date("2024-01-12"),
  },
];

interface PriceAlertsProps {
  onClose: () => void;
}

export function PriceAlerts({ onClose }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AlertFormData>({
    symbol: "",
    targetPrice: "",
    condition: "above",
  });

  const addAlert = () => {
    if (!formData.symbol || !formData.targetPrice) return;

    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substring(2, 15),
      symbol: formData.symbol.toUpperCase(),
      name: `${formData.symbol.toUpperCase()} Inc.`, // In real app, fetch from API
      currentPrice: 75, // In real app, fetch current price
      targetPrice: Number(formData.targetPrice),
      condition: formData.condition,
      isActive: true,
      createdAt: new Date(),
    };

    setAlerts([newAlert, ...alerts]);
    setFormData({ symbol: "", targetPrice: "", condition: "above" });
    setShowForm(false);
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert,
      ),
    );
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggeredAt) return "triggered";
    if (!alert.isActive) return "inactive";

    if (alert.condition === "above") {
      return alert.currentPrice >= alert.targetPrice ? "triggered" : "active";
    } else {
      return alert.currentPrice <= alert.targetPrice ? "triggered" : "active";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "triggered":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "triggered":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const activeAlerts = alerts.filter((alert) => alert.isActive);
  const triggeredAlerts = alerts.filter((alert) => alert.triggeredAt);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Price Alerts
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{activeAlerts.length} active alerts</span>
            <span>•</span>
            <span>{triggeredAlerts.length} triggered this week</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {activeAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {triggeredAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">Triggered</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">
                  {alerts.filter((a) => !a.isActive && !a.triggeredAt).length}
                </div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
            </div>

            {/* Add New Alert */}
            {!showForm ? (
              <Button
                onClick={() => setShowForm(true)}
                className="w-full h-12"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Alert
              </Button>
            ) : (
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">
                    Create Price Alert
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock Symbol</Label>
                      <Input
                        placeholder="AAPL"
                        value={formData.symbol}
                        onChange={(e) =>
                          setFormData({ ...formData, symbol: e.target.value })
                        }
                        className="uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="190.00"
                          value={formData.targetPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              targetPrice: e.target.value,
                            })
                          }
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alert Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          condition: value as "above" | "below",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">
                          Price goes above target
                        </SelectItem>
                        <SelectItem value="below">
                          Price goes below target
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addAlert} className="flex-1">
                      Create Alert
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alerts List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Your Alerts</h4>
                <Badge variant="outline">{alerts.length} total</Badge>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No price alerts created yet.</p>
                  <p className="text-sm">
                    Create your first alert to get notified of price movements.
                  </p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const status = getAlertStatus(alert);
                  const isCloseToTarget =
                    Math.abs(alert.currentPrice - alert.targetPrice) /
                      alert.currentPrice <
                    0.05;

                  return (
                    <Card
                      key={alert.id}
                      className={cn(
                        "border",
                        status === "triggered" &&
                          "border-green-200 bg-green-50",
                        isCloseToTarget &&
                          status === "active" &&
                          "border-yellow-200 bg-yellow-50",
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold">
                                {alert.symbol}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {alert.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              <Badge
                                variant="outline"
                                className={getStatusColor(status)}
                              >
                                {status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={() => toggleAlert(alert.id)}
                              disabled={!!alert.triggeredAt}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAlert(alert.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Current:
                            </span>
                            <div className="font-medium">
                              ${alert.currentPrice.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Target:
                            </span>
                            <div className="font-medium flex items-center gap-1">
                              {alert.condition === "above" ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              ${alert.targetPrice.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <div className="font-medium">
                              {alert.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {isCloseToTarget && status === "active" && (
                          <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
                            <Target className="h-3 w-3 inline mr-1" />
                            Close to target price - alert may trigger soon
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
