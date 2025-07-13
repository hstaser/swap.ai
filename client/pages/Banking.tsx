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
  const [showSkipOption, setShowSkipOption] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [showBalances, setShowBalances] = useState(true);
  const [showBankingFeatures, setShowBankingFeatures] = useState(false);

  const handleSkipForNow = () => {
    setShowSkipOption(false);
  };

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyGrowth = 12.4;
  const yearlyGrowth = 8.7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  swap.ai Banking
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {showSkipOption && (
                <Button
                  variant="outline"
                  onClick={handleSkipForNow}
                  className="text-sm"
                >
                  Skip for Now (Dev)
                </Button>
              )}
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {mockAccounts.map((account, index) => (
            <Card
              key={account.accountNumber}
              className={cn(
                "relative overflow-hidden border-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105",
                account.type === "checking" &&
                  "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
                account.type === "savings" &&
                  "bg-gradient-to-br from-green-500 to-green-700 text-white",
                account.type === "investment" &&
                  "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
              )}
              onClick={() => setSelectedAccount(account.accountNumber)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {account.type.charAt(0).toUpperCase() +
                        account.type.slice(1)}
                    </p>
                    <p className="text-white/60 text-xs">
                      {account.accountNumber}
                    </p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-lg">
                    {account.type === "checking" && (
                      <CreditCard className="h-5 w-5" />
                    )}
                    {account.type === "savings" && (
                      <PiggyBank className="h-5 w-5" />
                    )}
                    {account.type === "investment" && (
                      <TrendingUp className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Balance</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white/60 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBalances(!showBalances);
                      }}
                    >
                      {showBalances ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-2xl font-bold">
                    {showBalances
                      ? `$${account.balance.toLocaleString()}`
                      : "••••••"}
                  </p>
                  {account.interestRate && (
                    <p className="text-white/80 text-sm">
                      {account.interestRate}% APY
                    </p>
                  )}
                  <p className="text-white/60 text-xs">
                    Last activity: {account.lastTransaction}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Banking Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Portfolio Value */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Total Portfolio Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        ${totalBalance.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-semibold">
                          +{monthlyGrowth}%
                        </span>
                        <span className="text-gray-500 text-sm">
                          this month
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly Goal
                        </span>
                        <span className="text-sm font-semibold">
                          ${(150000).toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(totalBalance / 150000) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">
                        {Math.round((totalBalance / 150000) * 100)}% of monthly
                        goal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Transfer
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Invest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            transaction.type === "deposit" && "bg-green-100",
                            transaction.type === "withdrawal" && "bg-red-100",
                            transaction.type === "transfer" && "bg-blue-100",
                            transaction.type === "investment" &&
                              "bg-purple-100",
                          )}
                        >
                          {transaction.type === "deposit" && (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          )}
                          {transaction.type === "withdrawal" && (
                            <ArrowDownLeft className="h-4 w-4 text-red-600" />
                          )}
                          {transaction.type === "transfer" && (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          )}
                          {transaction.type === "investment" && (
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-semibold",
                            transaction.type === "deposit" && "text-green-600",
                            transaction.type === "withdrawal" && "text-red-600",
                            transaction.type === "transfer" && "text-blue-600",
                            transaction.type === "investment" &&
                              "text-purple-600",
                          )}
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}$
                          {transaction.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposits Tab */}
          <TabsContent value="deposits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5" />
                    Make a Deposit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/90">Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">To Account</Label>
                    <select className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white">
                      <option>Checking ****4521</option>
                      <option>Savings ****7891</option>
                    </select>
                  </div>
                  <Button className="w-full bg-white text-green-700 hover:bg-white/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Deposit
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Deposit Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border border-green-200 rounded-lg hover:bg-green-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold">Bank Transfer</p>
                          <p className="text-sm text-gray-500">
                            1-3 business days • Free
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">Debit Card</p>
                          <p className="text-sm text-gray-500">
                            Instant • 2.9% fee
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDownLeft className="h-5 w-5" />
                    Withdraw Funds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white/90">Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">From Account</Label>
                    <select className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white">
                      <option>Checking ****4521</option>
                      <option>Savings ****7891</option>
                    </select>
                  </div>
                  <Button className="w-full bg-white text-red-700 hover:bg-white/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Withdrawal
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Withdrawal Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Daily Limit</span>
                        <span className="text-sm font-semibold">$2,500</span>
                      </div>
                      <Progress value={32} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        $800 used today
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Monthly Limit</span>
                        <span className="text-sm font-semibold">$50,000</span>
                      </div>
                      <Progress value={18} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        $9,200 used this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Monthly Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      +{monthlyGrowth}%
                    </p>
                    <p className="text-sm text-gray-500">vs last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700">Yearly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      +{yearlyGrowth}%
                    </p>
                    <p className="text-sm text-gray-500">vs last year</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700">Avg Monthly</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">$3,247</p>
                    <p className="text-sm text-gray-500">net deposits</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Account Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAccounts.map((account) => (
                    <div key={account.accountNumber} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold capitalize">
                          {account.type} {account.accountNumber}
                        </span>
                        <span className="font-bold">
                          ${account.balance.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(account.balance / totalBalance) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">
                        {Math.round((account.balance / totalBalance) * 100)}% of
                        total
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
