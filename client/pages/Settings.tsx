import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Target,
  Shield,
  DollarSign,
  Calendar,
  Bell,
  User,
  Save,
  TrendingUp,
  PieChart,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserSettings {
  // Investment Goals
  targetReturn: number;
  riskTolerance: number;
  investmentHorizon: string;
  monthlyInvestment: number;
  targetPortfolioValue: number;

  // Portfolio Preferences
  maxStockAllocation: number;
  maxSectorAllocation: number;
  enableAutoRebalancing: boolean;
  rebalancingThreshold: number;

  // Notifications
  priceAlerts: boolean;
  newsNotifications: boolean;
  portfolioUpdates: boolean;
  rebalancingAlerts: boolean;
  marketAlerts: boolean;

  // Account Settings
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currency: string;

  // Advanced Settings
  includeDividends: boolean;
  taxOptimization: boolean;
  internationalExposure: number;
}

const defaultSettings: UserSettings = {
  // Investment Goals
  targetReturn: 8,
  riskTolerance: 6,
  investmentHorizon: "5-10 years",
  monthlyInvestment: 1000,
  targetPortfolioValue: 100000,

  // Portfolio Preferences
  maxStockAllocation: 80,
  maxSectorAllocation: 25,
  enableAutoRebalancing: true,
  rebalancingThreshold: 5,

  // Notifications
  priceAlerts: true,
  newsNotifications: true,
  portfolioUpdates: true,
  rebalancingAlerts: true,
  marketAlerts: false,

  // Account Settings
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  currency: "USD",

  // Advanced Settings
  includeDividends: true,
  taxOptimization: false,
  internationalExposure: 20,
};

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return "Conservative";
    if (risk <= 6) return "Moderate";
    if (risk <= 8) return "Aggressive";
    return "Very Aggressive";
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return "text-green-600";
    if (risk <= 6) return "text-yellow-600";
    if (risk <= 8) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Personalize your investment experience
                </p>
              </div>
            </div>
            {hasChanges && (
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                size="sm"
                className="relative"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Settings Tabs */}
        <Tabs defaultValue="goals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Investment Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Return */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Target Annual Return
                    </Label>
                    <span className="text-lg font-bold text-primary">
                      {settings.targetReturn}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.targetReturn]}
                    onValueChange={([value]) =>
                      updateSetting("targetReturn", value)
                    }
                    max={15}
                    min={3}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3% (Conservative)</span>
                    <span>15% (Aggressive)</span>
                  </div>
                </div>

                <Separator />

                {/* Risk Tolerance */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Risk Tolerance
                    </Label>
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getRiskColor(settings.riskTolerance),
                      )}
                    >
                      {getRiskLabel(settings.riskTolerance)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.riskTolerance]}
                    onValueChange={([value]) =>
                      updateSetting("riskTolerance", value)
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Very Aggressive</span>
                  </div>
                </div>

                <Separator />

                {/* Investment Horizon */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Investment Timeline
                  </Label>
                  <Select
                    value={settings.investmentHorizon}
                    onValueChange={(value) =>
                      updateSetting("investmentHorizon", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="5-10 years">5-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                      <SelectItem value="retirement">
                        Until Retirement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Financial Goals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Monthly Investment
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="1000"
                        value={settings.monthlyInvestment}
                        onChange={(e) =>
                          updateSetting(
                            "monthlyInvestment",
                            Number(e.target.value),
                          )
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Target Portfolio Value
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="100000"
                        value={settings.targetPortfolioValue}
                        onChange={(e) =>
                          updateSetting(
                            "targetPortfolioValue",
                            Number(e.target.value),
                          )
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Preferences Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Rebalancing */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Auto-Rebalancing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically rebalance when allocations drift
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAutoRebalancing}
                    onCheckedChange={(checked) =>
                      updateSetting("enableAutoRebalancing", checked)
                    }
                  />
                </div>

                <Separator />

                {/* Rebalancing Threshold */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Rebalancing Threshold
                    </Label>
                    <span className="text-lg font-bold">
                      {settings.rebalancingThreshold}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.rebalancingThreshold]}
                    onValueChange={([value]) =>
                      updateSetting("rebalancingThreshold", value)
                    }
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                    disabled={!settings.enableAutoRebalancing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Rebalance when any allocation drifts by this amount
                  </p>
                </div>

                <Separator />

                {/* Max Allocations */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">
                        Max Single Stock
                      </Label>
                      <span className="text-lg font-bold">
                        {settings.maxStockAllocation}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.maxStockAllocation]}
                      onValueChange={([value]) =>
                        updateSetting("maxStockAllocation", value)
                      }
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">
                        Max Sector Allocation
                      </Label>
                      <span className="text-lg font-bold">
                        {settings.maxSectorAllocation}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.maxSectorAllocation]}
                      onValueChange={([value]) =>
                        updateSetting("maxSectorAllocation", value)
                      }
                      max={50}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">
                        International Exposure
                      </Label>
                      <span className="text-lg font-bold">
                        {settings.internationalExposure}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.internationalExposure]}
                      onValueChange={([value]) =>
                        updateSetting("internationalExposure", value)
                      }
                      max={50}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                {/* Advanced Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Advanced Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">
                          Include Dividends in Analysis
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Factor dividend yields into returns
                        </p>
                      </div>
                      <Switch
                        checked={settings.includeDividends}
                        onCheckedChange={(checked) =>
                          updateSetting("includeDividends", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">
                          Tax Optimization
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Optimize for tax efficiency
                        </p>
                      </div>
                      <Switch
                        checked={settings.taxOptimization}
                        onCheckedChange={(checked) =>
                          updateSetting("taxOptimization", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Price Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of significant price movements
                      </p>
                    </div>
                    <Switch
                      checked={settings.priceAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("priceAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        News Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Breaking news about your holdings
                      </p>
                    </div>
                    <Switch
                      checked={settings.newsNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("newsNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Portfolio Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Daily portfolio performance summaries
                      </p>
                    </div>
                    <Switch
                      checked={settings.portfolioUpdates}
                      onCheckedChange={(checked) =>
                        updateSetting("portfolioUpdates", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Rebalancing Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When portfolio needs rebalancing
                      </p>
                    </div>
                    <Switch
                      checked={settings.rebalancingAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("rebalancingAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        Market Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Major market movements and events
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("marketAlerts", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">First Name</Label>
                    <Input
                      value={settings.firstName}
                      onChange={(e) =>
                        updateSetting("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Last Name</Label>
                    <Input
                      value={settings.lastName}
                      onChange={(e) =>
                        updateSetting("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateSetting("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => updateSetting("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">
                        AUD - Australian Dollar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Account Actions
                    </Label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (confirm("Are you sure you want to sign out?")) {
                          // Clear all user data
                          localStorage.clear();
                          sessionStorage.clear();
                          // Redirect to landing page
                          window.location.href = "/";
                        }
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 left-4 right-4 z-50">
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="w-full h-12 text-lg font-semibold shadow-lg"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Save className="h-5 w-5 mr-2 animate-pulse" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
