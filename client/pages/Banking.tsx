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
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BankingOnboarding } from "@/components/banking/BankingOnboarding";

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
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [showBalances, setShowBalances] = useState(true);
  const [showBankingFeatures, setShowBankingFeatures] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAccount, setDepositAccount] = useState("checking");
  const [withdrawAccount, setWithdrawAccount] = useState("checking");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedDepositMethod, setSelectedDepositMethod] = useState("");
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState("");
  const [showBankingOnboarding, setShowBankingOnboarding] = useState(false);

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
              <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  Back to Home
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  swap.ai Banking
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={showBankingFeatures ? "default" : "outline"}
                onClick={() => setShowBankingFeatures(!showBankingFeatures)}
                className="text-sm"
              >
                {showBankingFeatures ? "Hide Banking" : "Add Banking"} (Dev)
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {!showBankingFeatures ? (
          // Blank state before banking is added
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your Banking
              </h2>
              <p className="text-gray-600 mb-6">
                Link your bank accounts to seamlessly manage deposits,
                withdrawals, and track your financial growth alongside your
                investments.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Secure bank account linking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Real-time balance tracking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Investment analytics</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated transfers</span>
                </div>
              </div>
              <Button
                onClick={() => setShowBankingOnboarding(true)}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                Get Started - Connect Banking
              </Button>
            </div>
          </div>
        ) : (
          <>
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
              <TabsList className="grid w-full grid-cols-3 bg-white/80">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
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
                            {Math.round((totalBalance / 150000) * 100)}% of
                            monthly goal
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
                        <Button
                          onClick={() => {
                            // Navigate to deposits tab
                            const depositsTab = document.querySelector(
                              '[value="deposits"]',
                            ) as HTMLElement;
                            depositsTab?.click();
                          }}
                          className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Deposit
                        </Button>
                        <Button
                          onClick={() => {
                            // Navigate to withdrawals tab
                            const withdrawalsTab = document.querySelector(
                              '[value="withdrawals"]',
                            ) as HTMLElement;
                            withdrawalsTab?.click();
                          }}
                          variant="outline"
                          className="h-12 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <ArrowDownLeft className="h-4 w-4 mr-2" />
                          Withdraw
                        </Button>
                        <Button
                          onClick={() => {
                            setConfirmationMessage(
                              "Transfer functionality coming soon! Use the deposits/withdrawals tabs for now.",
                            );
                            setShowConfirmation(true);
                          }}
                          variant="outline"
                          className="h-12 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Transfer
                        </Button>
                        <Button
                          onClick={() => navigate("/")}
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
                                transaction.type === "deposit" &&
                                  "bg-green-100",
                                transaction.type === "withdrawal" &&
                                  "bg-red-100",
                                transaction.type === "transfer" &&
                                  "bg-blue-100",
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
                                {new Date(
                                  transaction.date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "font-semibold",
                                transaction.type === "deposit" &&
                                  "text-green-600",
                                transaction.type === "withdrawal" &&
                                  "text-red-600",
                                transaction.type === "transfer" &&
                                  "text-blue-600",
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
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5" />
                        One-Time Deposit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white/90">Amount</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <div>
                        <Label className="text-white/90">To Investment Account</Label>
                        <select
                          value={depositAccount}
                          onChange={(e) => setDepositAccount(e.target.value)}
                          className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white"
                        >
                          <option value="checking">From Checking ****4521</option>
                          <option value="savings">From Savings ****7891</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Auto-Redeposit Feature */}
                  <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Auto-Redeposit Setup
                      </CardTitle>
                      <p className="text-white/90 text-sm">Automatically transfer funds from your checking account to investments on a schedule</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/90">Amount</Label>
                          <Input
                            type="number"
                            placeholder="$500"
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                          />
                        </div>
                        <div>
                          <Label className="text-white/90">Frequency</Label>
                          <select className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white">
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Every 2 Weeks</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/90">From Account</Label>
                        <select className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white">
                          <option value="checking">Checking ****4521 ($12,847 available)</option>
                          <option value="savings">Savings ****7891 ($45,920 available)</option>
                        </select>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm font-medium">Smart Safety Features</span>
                        </div>
                        <ul className="text-xs text-white/80 space-y-1">
                          <li>• Only transfer if account balance &gt; $1,000</li>
                          <li>• Pause if 3 consecutive failed attempts</li>
                          <li>• Email notifications before each transfer</li>
                        </ul>
                      </div>
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <Zap className="h-4 w-4 mr-2" />
                        Enable Auto-Redeposit
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        selectedDepositMethod === "bank"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300",
                      )}
                    >
                      <CardContent
                        onClick={() => setSelectedDepositMethod("bank")}
                        className="p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Bank Transfer</p>
                            <p className="text-sm text-gray-500">
                              1-3 business days • Free
                            </p>
                          </div>
                          {selectedDepositMethod === "bank" && (
                            <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        selectedDepositMethod === "card"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300",
                      )}
                    >
                      <CardContent
                        onClick={() => setSelectedDepositMethod("card")}
                        className="p-4"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">Debit Card</p>
                            <p className="text-sm text-gray-500">
                              Instant • 2.9% fee
                            </p>
                          </div>
                          {selectedDepositMethod === "card" && (
                            <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Confirm Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        if (!depositAmount) {
                          setConfirmationMessage(
                            "Please enter a deposit amount.",
                          );
                          setShowConfirmation(true);
                          return;
                        }
                        if (!selectedDepositMethod) {
                          setConfirmationMessage(
                            "Please select a deposit method.",
                          );
                          setShowConfirmation(true);
                          return;
                        }
                        const methodName =
                          selectedDepositMethod === "bank"
                            ? "Bank Transfer"
                            : "Debit Card";
                        setConfirmationMessage(
                          `Successfully deposited $${depositAmount} to ${depositAccount} account via ${methodName}!`,
                        );
                        setShowConfirmation(true);
                        setDepositAmount("");
                        setSelectedDepositMethod("");
                      }}
                      disabled={!depositAmount || !selectedDepositMethod}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Deposit
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Withdrawals Tab */}
              <TabsContent value="withdrawals" className="space-y-6">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowDownLeft className="h-5 w-5" />
                        Withdrawal Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white/90">Amount</Label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <div>
                        <Label className="text-white/90">From Account</Label>
                        <select
                          value={withdrawAccount}
                          onChange={(e) => setWithdrawAccount(e.target.value)}
                          className="w-full p-2 rounded-md bg-white/20 border-white/30 text-white"
                        >
                          <option value="checking">Checking ****4521</option>
                          <option value="savings">Savings ****7891</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Withdrawal Method Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        selectedWithdrawMethod === "bank"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300",
                      )}
                    >
                      <CardContent
                        onClick={() => setSelectedWithdrawMethod("bank")}
                        className="p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-6 w-6 text-red-600" />
                          <div>
                            <p className="font-semibold">Bank Transfer</p>
                            <p className="text-sm text-gray-500">
                              1-3 business days • Free
                            </p>
                          </div>
                          {selectedWithdrawMethod === "bank" && (
                            <CheckCircle className="h-5 w-5 text-red-600 ml-auto" />
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        selectedWithdrawMethod === "instant"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300",
                      )}
                    >
                      <CardContent
                        onClick={() => setSelectedWithdrawMethod("instant")}
                        className="p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Zap className="h-6 w-6 text-orange-600" />
                          <div>
                            <p className="font-semibold">Instant Transfer</p>
                            <p className="text-sm text-gray-500">
                              Instant • $1.50 fee
                            </p>
                          </div>
                          {selectedWithdrawMethod === "instant" && (
                            <CheckCircle className="h-5 w-5 text-orange-600 ml-auto" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Limits Information */}
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            Daily Limit: $2,500 • Monthly Limit: $50,000
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            $800 used today • $9,200 used this month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Confirm Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        if (!withdrawAmount) {
                          setConfirmationMessage(
                            "Please enter a withdrawal amount.",
                          );
                          setShowConfirmation(true);
                          return;
                        }
                        if (!selectedWithdrawMethod) {
                          setConfirmationMessage(
                            "Please select a withdrawal method.",
                          );
                          setShowConfirmation(true);
                          return;
                        }
                        const amount = parseFloat(withdrawAmount);
                        if (amount > 2500) {
                          setConfirmationMessage(
                            "Withdrawal amount exceeds daily limit of $2,500.",
                          );
                          setShowConfirmation(true);
                          return;
                        }
                        const methodName =
                          selectedWithdrawMethod === "bank"
                            ? "Bank Transfer"
                            : "Instant Transfer";
                        setConfirmationMessage(
                          `Successfully withdrew $${withdrawAmount} from ${withdrawAccount} account via ${methodName}!`,
                        );
                        setShowConfirmation(true);
                        setWithdrawAmount("");
                        setSelectedWithdrawMethod("");
                      }}
                      disabled={!withdrawAmount || !selectedWithdrawMethod}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Withdrawal
                    </Button>
                  </div>
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
                      <CardTitle className="text-blue-700">
                        Yearly Growth
                      </CardTitle>
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
                      <CardTitle className="text-purple-700">
                        Avg Monthly
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          $3,247
                        </p>
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
                            {Math.round((account.balance / totalBalance) * 100)}
                            % of total
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Banking Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{confirmationMessage}</p>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmationMessage("");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Banking Onboarding Modal */}
      {showBankingOnboarding && (
        <BankingOnboarding
          onComplete={() => {
            setShowBankingOnboarding(false);
            setConfirmationMessage(
              "Banking account setup complete! Your account is being verified and will be ready for use within 1-2 business days.",
            );
            setShowConfirmation(true);
          }}
          onCancel={() => setShowBankingOnboarding(false)}
        />
      )}
    </div>
  );
}
