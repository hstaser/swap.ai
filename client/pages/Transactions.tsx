import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Search,
  ArrowUpDown,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  date: string;
  type: "BUY" | "SELL" | "DIVIDEND" | "FEE";
  symbol: string;
  companyName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  orderId: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    date: "2024-01-15T10:30:00Z",
    type: "BUY",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    quantity: 10,
    price: 182.52,
    totalAmount: 1825.2,
    fees: 0.99,
    status: "COMPLETED",
    orderId: "ORD_AAPL_001",
  },
  {
    id: "txn_002",
    date: "2024-01-12T14:15:00Z",
    type: "BUY",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    quantity: 5,
    price: 378.85,
    totalAmount: 1894.25,
    fees: 0.99,
    status: "COMPLETED",
    orderId: "ORD_MSFT_002",
  },
  {
    id: "txn_003",
    date: "2024-01-10T09:45:00Z",
    type: "DIVIDEND",
    symbol: "JNJ",
    companyName: "Johnson & Johnson",
    quantity: 25,
    price: 1.19,
    totalAmount: 29.75,
    fees: 0,
    status: "COMPLETED",
    orderId: "DIV_JNJ_003",
  },
  {
    id: "txn_004",
    date: "2024-01-08T16:20:00Z",
    type: "SELL",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    quantity: 3,
    price: 238.77,
    totalAmount: 716.31,
    fees: 0.99,
    status: "COMPLETED",
    orderId: "ORD_TSLA_004",
  },
  {
    id: "txn_005",
    date: "2024-01-05T11:30:00Z",
    type: "BUY",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    quantity: 2,
    price: 722.48,
    totalAmount: 1444.96,
    fees: 0.99,
    status: "COMPLETED",
    orderId: "ORD_NVDA_005",
  },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredTransactions = transactions
    .filter((txn) => {
      const matchesSearch =
        txn.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.orderId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "ALL" || txn.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" || txn.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const aValue =
        sortBy === "date"
          ? new Date(a.date).getTime()
          : a[sortBy as keyof Transaction];
      const bValue =
        sortBy === "date"
          ? new Date(b.date).getTime()
          : b[sortBy as keyof Transaction];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalValue = transactions
    .filter((txn) => txn.status === "COMPLETED")
    .reduce((sum, txn) => {
      if (txn.type === "BUY") return sum + txn.totalAmount + txn.fees;
      if (txn.type === "SELL") return sum + txn.totalAmount - txn.fees;
      return sum + txn.totalAmount;
    }, 0);

  const totalFees = transactions
    .filter((txn) => txn.status === "COMPLETED")
    .reduce((sum, txn) => sum + txn.fees, 0);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      [
        "Date",
        "Type",
        "Symbol",
        "Company",
        "Quantity",
        "Price",
        "Total",
        "Fees",
        "Status",
        "Order ID",
      ].join(","),
      ...filteredTransactions.map((txn) =>
        [
          new Date(txn.date).toLocaleString(),
          txn.type,
          txn.symbol,
          `"${txn.companyName}"`,
          txn.quantity,
          txn.price,
          txn.totalAmount,
          txn.fees,
          txn.status,
          txn.orderId,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BUY":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "SELL":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "DIVIDEND":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "FEE":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BUY":
        return "bg-green-100 text-green-800 border-green-300";
      case "SELL":
        return "bg-red-100 text-red-800 border-red-300";
      case "DIVIDEND":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "FEE":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  Transactions
                </h1>
              </Link>
            </div>
            <Button onClick={exportTransactions} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Traded</p>
                  <p className="text-2xl font-bold">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search symbol, company, or order ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="BUY">Buy Orders</SelectItem>
                  <SelectItem value="SELL">Sell Orders</SelectItem>
                  <SelectItem value="DIVIDEND">Dividends</SelectItem>
                  <SelectItem value="FEE">Fees</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => handleSort("date")}
                className="justify-start"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by Date{" "}
                {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <Badge
                        variant="outline"
                        className={getTypeColor(transaction.type)}
                      >
                        {transaction.type}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {transaction.symbol}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.companyName}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)} • Order:{" "}
                        {transaction.orderId}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      {transaction.type === "BUY" ? "-" : "+"}$
                      {transaction.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.quantity} shares @ ${transaction.price}
                    </div>
                  </div>

                  <Badge
                    variant={
                      transaction.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                    className="ml-4"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
