import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle,
  Plus,
  Building2,
  ArrowUpCircle,
  ArrowDownCircle,
  ExternalLink,
  RefreshCw,
  Banknote,
  Smartphone,
  Globe,
  X,
  AlertTriangle,
  Clock,
  Info,
  Eye,
  EyeOff,
  BarChart3,
  Link as LinkIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BankAccount {
  id: string;
  bankName: string;
  accountType: "checking" | "savings";
  accountNumber: string;
  balance: number;
  isLinked: boolean;
  isVerified: boolean;
}

interface TransferOption {
  id: string;
  name: string;
  type: "bank" | "external" | "crypto" | "other";
  description: string;
  icon: any;
  timeframe: string;
  fees: string;
  available: boolean;
}

// Base mock accounts for normal mode
const baseMockAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumber: "****4521",
    balance: 12847.32,
    isLinked: true,
    isVerified: true,
  },
  {
    id: "2",
    bankName: "Wells Fargo",
    accountType: "savings",
    accountNumber: "****7891",
    balance: 45920.15,
    isLinked: false,
    isVerified: false,
  },
];

// Enhanced mock accounts for skipped/demo mode
const filledMockAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumber: "****4521",
    balance: 12847.32,
    isLinked: true,
    isVerified: true,
  },
  {
    id: "2",
    bankName: "Wells Fargo",
    accountType: "savings",
    accountNumber: "****7891",
    balance: 45920.15,
    isLinked: true,
    isVerified: true,
  },
  {
    id: "3",
    bankName: "Bank of America",
    accountType: "checking",
    accountNumber: "****9876",
    balance: 8650.0,
    isLinked: true,
    isVerified: true,
  },
];

const transferOptions: TransferOption[] = [
  {
    id: "bank",
    name: "Bank Transfer (ACH)",
    type: "bank",
    description: "Transfer from your linked bank account",
    icon: Building2,
    timeframe: "1-3 business days",
    fees: "Free",
    available: true,
  },
  {
    id: "wire",
    name: "Wire Transfer",
    type: "bank",
    description: "Same-day transfer from any bank",
    icon: RefreshCw,
    timeframe: "Same day",
    fees: "$25",
    available: true,
  },
  {
    id: "debit",
    name: "Debit Card",
    type: "bank",
    description: "Instant transfer using debit card",
    icon: CreditCard,
    timeframe: "Instant",
    fees: "2.9%",
    available: true,
  },
  {
    id: "external",
    name: "External Brokerage",
    type: "external",
    description: "Transfer from Robinhood, Fidelity, etc.",
    icon: ExternalLink,
    timeframe: "3-5 business days",
    fees: "Free",
    available: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "other",
    description: "Transfer from PayPal balance",
    icon: Smartphone,
    timeframe: "1-2 business days",
    fees: "Free",
    available: false,
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    type: "crypto",
    description: "Convert crypto to cash",
    icon: Globe,
    timeframe: "Instant",
    fees: "1.5%",
    available: false,
  },
];

export default function Banking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAccountDetails, setShowAccountDetails] = useState<string[]>([]);
  const [selectedTransferMethod, setSelectedTransferMethod] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [showSkipOption, setShowSkipOption] = useState(true);
  const [isSkippedMode, setIsSkippedMode] = useState(false);
  const [isLinkingAccount, setIsLinkingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountType: "checking" as "checking" | "savings",
    accountNumber: "",
    routingNumber: "",
  });

  const toggleAccountDetails = (accountId: string) => {
    setShowAccountDetails((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const handleSkipForNow = () => {
    setIsSkippedMode(true);
    setShowSkipOption(false);
  };

  const handleLinkAccount = () => {
    // In a real app, this would integrate with Plaid or similar
    console.log("Linking account:", newAccount);
    setIsLinkingAccount(false);
    setNewAccount({
      bankName: "",
      accountType: "checking",
      accountNumber: "",
      routingNumber: "",
    });
  };

  const handleTransfer = () => {
    if (!selectedTransferMethod || !transferAmount) return;

    // In a real app, this would process the transfer
    console.log("Processing transfer:", {
      method: selectedTransferMethod,
      amount: transferAmount,
    });

    // Show success message or navigate
    alert(`Transfer of $${transferAmount} initiated successfully!`);
  };

  const mockAccounts = isSkippedMode ? filledMockAccounts : baseMockAccounts;

  const totalBalance = mockAccounts
    .filter((acc) => acc.isLinked)
    .reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Banking</h1>
              </Link>
            </div>

            {showSkipOption && (
              <Button variant="outline" onClick={handleSkipForNow}>
                Skip for Now (Development)
              </Button>
            )}
            {isSkippedMode && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Demo Mode</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSkippedMode(false);
                    setShowSkipOption(true);
                  }}
                >
                  Exit Demo
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funding">Fund Account</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Cash Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cash Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  ${(isSkippedMode ? 25000 : totalBalance).toLocaleString()}
                </div>
                <p className="text-muted-foreground">
                  {isSkippedMode
                    ? "Demo cash balance • Ready for trading"
                    : "Available for investing • FDIC insured up to $250,000"}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab("funding")}
              >
                <CardContent className="p-6 text-center">
                  <ArrowUpCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Add Funds</h3>
                  <p className="text-sm text-muted-foreground">
                    Transfer money to invest
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab("withdraw")}
              >
                <CardContent className="p-6 text-center">
                  <ArrowDownCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Withdraw</h3>
                  <p className="text-sm text-muted-foreground">
                    Transfer money out
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveTab("accounts")}
              >
                <CardContent className="p-6 text-center">
                  <LinkIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Link Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect bank account
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Secure & Protected
                    </h4>
                    <p className="text-sm text-green-700">
                      Bank-level security with 256-bit encryption and FDIC
                      insurance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            {isSkippedMode && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Demo Mode Active
                      </h4>
                      <p className="text-sm text-blue-700">
                        This shows how funding would work. In production, real
                        bank connections and transfers would be processed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount">Amount to Add</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Transfer Methods */}
                <div>
                  <Label>Choose Transfer Method</Label>
                  <RadioGroup
                    value={selectedTransferMethod}
                    onValueChange={setSelectedTransferMethod}
                    className="mt-3"
                  >
                    {transferOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center space-x-3 p-4 border rounded-lg",
                            option.available
                              ? "hover:bg-gray-50"
                              : "opacity-50 cursor-not-allowed",
                          )}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            disabled={!option.available}
                          />
                          <Icon className="h-5 w-5" />
                          <div className="flex-1">
                            <Label
                              htmlFor={option.id}
                              className="font-medium cursor-pointer"
                            >
                              {option.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                              <span>Time: {option.timeframe}</span>
                              <span>Fee: {option.fees}</span>
                            </div>
                          </div>
                          {!option.available && (
                            <Badge variant="secondary">Coming Soon</Badge>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleSkipForNow}>
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleTransfer}
                    disabled={!selectedTransferMethod || !transferAmount}
                  >
                    Add ${transferAmount || "0"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Available: ${totalBalance.toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label>Withdraw To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts
                        .filter((acc) => acc.isLinked && acc.isVerified)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.bankName} {account.accountNumber}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Withdrawals typically take 1-3 business days
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleSkipForNow}>
                    Skip for Now
                  </Button>
                  <Button>Withdraw Funds</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            {/* Linked Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Linked Bank Accounts
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLinkingAccount(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Link Account
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{account.bankName}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.accountType.charAt(0).toUpperCase() +
                              account.accountType.slice(1)}{" "}
                            • {account.accountNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {showAccountDetails.includes(account.id) && (
                          <div className="text-right">
                            <div className="font-semibold">
                              ${account.balance.toLocaleString()}
                            </div>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAccountDetails(account.id)}
                        >
                          {showAccountDetails.includes(account.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        {account.isVerified ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Link New Account Modal */}
            {isLinkingAccount && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Link Bank Account</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLinkingAccount(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={newAccount.bankName}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            bankName: e.target.value,
                          })
                        }
                        placeholder="e.g. Chase, Bank of America"
                      />
                    </div>

                    <div>
                      <Label>Account Type</Label>
                      <RadioGroup
                        value={newAccount.accountType}
                        onValueChange={(value) =>
                          setNewAccount({
                            ...newAccount,
                            accountType: value as any,
                          })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="checking" id="checking" />
                          <Label htmlFor="checking">Checking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="savings" id="savings" />
                          <Label htmlFor="savings">Savings</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="routing">Routing Number</Label>
                      <Input
                        id="routing"
                        value={newAccount.routingNumber}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            routingNumber: e.target.value,
                          })
                        }
                        placeholder="9 digits"
                      />
                    </div>

                    <div>
                      <Label htmlFor="account">Account Number</Label>
                      <Input
                        id="account"
                        value={newAccount.accountNumber}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            accountNumber: e.target.value,
                          })
                        }
                        placeholder="Account number"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                          Your information is encrypted and secure
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSkipForNow}
                        className="flex-1"
                      >
                        Skip for Now
                      </Button>
                      <Button onClick={handleLinkAccount} className="flex-1">
                        Link Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
