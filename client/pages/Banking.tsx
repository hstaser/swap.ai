import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Settings,
  Plus,
  Wallet,
  Building,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AccountBalance {
  type: "checking" | "savings" | "investment";
  balance: number;
  accountNumber: string;
  interestRate?: number;
  lastTransaction?: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "investment";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockAccounts: AccountBalance[] = [
  {
    type: "checking",
    balance: 12847.32,
    accountNumber: "****4521",
    lastTransaction: "2 hours ago",
  },
  {
    type: "savings",
    balance: 45920.15,
    accountNumber: "****7891",
    interestRate: 4.25,
    lastTransaction: "1 day ago",
  },
  {
    type: "investment",
    balance: 87450.67,
    accountNumber: "****3456",
    interestRate: 8.9,
    lastTransaction: "3 hours ago",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 2500,
    description: "Direct Deposit - Salary",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "investment",
    amount: 1000,
    description: "Investment Purchase - AAPL",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "transfer",
    amount: 500,
    description: "Transfer to Savings",
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 200,
    description: "ATM Withdrawal",
    date: "2024-01-12",
    status: "completed",
  },
];

export default function Banking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalances, setShowBalances] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositType, setDepositType] = useState("checking");
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

  const totalBalance = mockAccounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    setIsProcessingDeposit(true);
    // Simulate deposit processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingDeposit(false);
    setDepositAmount("");
    // In real app, would update account balance
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return CreditCard;
      case "savings":
        return PiggyBank;
      case "investment":
        return TrendingUp;
      default:
        return Wallet;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return ArrowDownLeft;
      case "withdrawal":
        return ArrowUpRight;
      case "transfer":
        return ArrowUpRight;
      case "investment":
        return TrendingUp;
      default:
        return DollarSign;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  swap.ai Banking
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="flex items-center gap-2"
              >
                {showBalances ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showBalances ? "Hide" : "Show"} Balances
              </Button>
              <Badge variant="outline" className="bg-white/50">
                FDIC Insured
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Account Overview */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Overview</span>
              <div className="text-2xl font-bold text-green-600">
                {showBalances ? formatCurrency(totalBalance) : "••••••"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockAccounts.map((account) => {
                const Icon = getAccountIcon(account.type);
                return (
                  <Card
                    key={account.accountNumber}
                    className="border-2 hover:border-primary transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-semibold capitalize">
                            {account.type}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {account.accountNumber}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="text-2xl font-bold">
                          {showBalances
                            ? formatCurrency(account.balance)
                            : "••••••"}
                        </div>

                        {account.interestRate && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            {account.interestRate}% APY
                          </div>
                        )}

                        {account.lastTransaction && (
                          <div className="text-xs text-muted-foreground">
                            Last activity: {account.lastTransaction}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Banking Services */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="direct-deposit">Direct Deposit</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    onClick={() => setActiveTab("deposit")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Make a Deposit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("direct-deposit")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Setup Direct Deposit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Transfer Funds
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Banking Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">FDIC Insured</div>
                      <div className="text-xs text-muted-foreground">
                        Up to $250,000 protected
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-sm">
                        Instant Transfers
                      </div>
                      <div className="text-xs text-muted-foreground">
                        To investment accounts
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-sm">
                        High Yield Savings
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Earn 4.25% APY
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deposit Money */}
          <TabsContent value="deposit" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Deposit Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Deposit Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="pl-10 text-lg h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Deposit To</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {mockAccounts.map((account) => (
                        <Button
                          key={account.accountNumber}
                          variant={
                            depositType === account.type ? "default" : "outline"
                          }
                          onClick={() => setDepositType(account.type)}
                          className="flex flex-col p-4 h-auto"
                        >
                          <span className="capitalize font-semibold">
                            {account.type}
                          </span>
                          <span className="text-xs opacity-70">
                            {account.accountNumber}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Deposit Methods</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="flex flex-col p-4 h-auto"
                      >
                        <CreditCard className="h-6 w-6 mb-2" />
                        <span>Bank Transfer</span>
                        <span className="text-xs text-muted-foreground">
                          3-5 business days
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col p-4 h-auto"
                      >
                        <Zap className="h-6 w-6 mb-2" />
                        <span>Instant Transfer</span>
                        <span className="text-xs text-muted-foreground">
                          $0.50 fee
                        </span>
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={
                      !depositAmount ||
                      parseFloat(depositAmount) <= 0 ||
                      isProcessingDeposit
                    }
                    className="w-full h-12"
                  >
                    {isProcessingDeposit
                      ? "Processing..."
                      : `Deposit ${depositAmount ? formatCurrency(parseFloat(depositAmount)) : "$0.00"}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer to Investment */}
          <TabsContent value="transfer" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Transfer to Investment Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Start Investing Today
                  </h3>
                  <p className="text-muted-foreground">
                    Transfer funds from your savings or checking account
                    directly to your investment portfolio
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transfer-amount">Transfer Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="transfer-amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-10 text-lg h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Transfer From</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardContent className="p-4 text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="font-semibold">Checking</div>
                          <div className="text-sm text-muted-foreground">
                            ****4521
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(mockAccounts[0].balance)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 hover:border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <PiggyBank className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <div className="font-semibold">Savings</div>
                          <div className="text-sm text-muted-foreground">
                            ****7891
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(mockAccounts[1].balance)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Instant Investment Transfer
                    </h5>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Transfer Speed:</span>
                        <span className="font-medium">Instant</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transfer Fee:</span>
                        <span className="font-medium text-green-600">
                          $0.00
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available for Trading:</span>
                        <span className="font-medium">Immediately</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Transfer to Investment Account
                  </Button>

                  <div className="text-center">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/portfolio">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Investment Portfolio
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Direct Deposit */}
          <TabsContent value="direct-deposit" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Direct Deposit Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Get Paid Up to 2 Days Early
                  </h3>
                  <p className="text-muted-foreground">
                    Set up direct deposit to access your paycheck faster
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">
                    Bank Information for Employer
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium">
                        Routing Number
                      </Label>
                      <div className="text-lg font-mono font-bold mt-1">
                        121000248
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs"
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-sm font-medium">
                        Account Number
                      </Label>
                      <div className="text-lg font-mono font-bold mt-1">
                        ****4521
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs"
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold mb-2">Bank Address</h5>
                    <div className="text-sm space-y-1">
                      <div>swap.ai Bank</div>
                      <div>123 Financial District</div>
                      <div>New York, NY 10004</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-semibold">
                      Automatic Investment Setup
                    </h5>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">
                            Auto-Invest Option Available
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            Automatically transfer a percentage of each paycheck
                            to your investment account. Set it up after your
                            first direct deposit arrives.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact HR
                    </Button>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Setup Auto-Invest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Savings Account */}
          <TabsContent value="savings" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  High-Yield Savings Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    4.25%
                  </div>
                  <div className="text-lg font-semibold">
                    Annual Percentage Yield
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Earn more on your savings
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Savings Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">FDIC Insured</div>
                        <div className="text-sm text-muted-foreground">
                          Your deposits are protected
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">No Minimum Balance</div>
                        <div className="text-sm text-muted-foreground">
                          Start saving with any amount
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Instant Transfers</div>
                        <div className="text-sm text-muted-foreground">
                          Move money to investments anytime
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h5 className="font-semibold mb-2">
                      Savings Goal Calculator
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Monthly Deposit</Label>
                        <Input placeholder="$500" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Time Period</Label>
                        <Input placeholder="12 months" className="mt-1" />
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="text-sm text-muted-foreground">
                        Projected Balance
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        $6,127.50
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Including 4.25% APY
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => {
                    const Icon = getTransactionIcon(transaction.type);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              transaction.type === "deposit"
                                ? "bg-green-100"
                                : transaction.type === "withdrawal"
                                  ? "bg-red-100"
                                  : transaction.type === "transfer"
                                    ? "bg-blue-100"
                                    : "bg-purple-100",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                transaction.type === "deposit"
                                  ? "text-green-600"
                                  : transaction.type === "withdrawal"
                                    ? "text-red-600"
                                    : transaction.type === "transfer"
                                      ? "text-blue-600"
                                      : "text-purple-600",
                              )}
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={cn(
                              "font-bold",
                              transaction.type === "deposit"
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {transaction.type === "deposit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
