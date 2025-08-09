import { PELOSI_TRADES } from "../data/pelosi.trades";
import { getStock } from "../data/stocks.catalog";
import { addManyToQueue } from "../store/queue";
import { addManyToWatchlist } from "../store/watchlist";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Plus, Eye, TrendingUp, TrendingDown } from "lucide-react";

export default function PelosiSection() {
  const rows = PELOSI_TRADES
    .map(t => ({ ...t, stock: getStock(t.symbol) }))
    .filter(r => r.stock); // only known tickers

  const symbols = rows.map(r => r.stock!.symbol);

  const handleAddAllToQueue = () => {
    addManyToQueue(symbols, "pelosi");
  };

  const handleAddAllToWatchlist = () => {
    addManyToWatchlist(symbols);
  };

  const handleAddToQueue = (symbol: string) => {
    addManyToQueue([symbol], "pelosi");
  };

  const handleAddToWatchlist = (symbol: string) => {
    addManyToWatchlist([symbol]);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Pelosi Tracker</CardTitle>
            <p className="text-sm text-gray-600 mt-1">(Demo - Congressional disclosure data)</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleAddAllToWatchlist}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Add All to Watchlist
            </Button>
            <Button 
              onClick={handleAddAllToQueue}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add All to Queue
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[70vh]">
          <div className="space-y-3">
            {rows.map(r => (
              <div 
                key={r.stock!.id} 
                className="grid grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Stock Symbol & Name */}
                <div className="col-span-3">
                  <div className="font-bold text-lg text-gray-900">{r.stock!.symbol}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">{r.stock!.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {r.stock!.sector}
                  </Badge>
                </div>

                {/* Current Price & Performance */}
                <div className="col-span-2 text-right">
                  <div className="font-bold text-lg">${r.stock!.price.toFixed(2)}</div>
                  <div className={`flex items-center justify-end gap-1 text-sm ${
                    r.stock!.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {r.stock!.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {r.stock!.changePercent >= 0 ? "+" : ""}{r.stock!.changePercent.toFixed(2)}%
                  </div>
                </div>

                {/* Last Trade Date */}
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Last Trade:</div>
                  <div className="font-medium text-sm">
                    {new Date(r.lastTradeDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Amount Range */}
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Amount:</div>
                  <div className="font-medium text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {r.amountRange}
                  </div>
                  {r.transactionType && (
                    <Badge 
                      variant={r.transactionType === "Buy" ? "default" : "secondary"} 
                      className="text-xs mt-1"
                    >
                      {r.transactionType}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="col-span-3 flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddToWatchlist(r.stock!.symbol)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Watch
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAddToQueue(r.stock!.symbol)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Queue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          * Data based on publicly available congressional disclosure filings. 
          Trades are reported with 45-day delays and amount ranges per disclosure requirements. 
          This is for educational purposes only and not investment advice.
        </div>
      </CardContent>
    </Card>
  );
}
