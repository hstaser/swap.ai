import { useState } from "react";
import { PELOSI_TRADES } from "../data/pelosi.trades";
import { getStock } from "../data/stocks.catalog";
import { extendedStockDatabase } from "../data/extended-stocks";
import { useQueue } from "../hooks/use-queue";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Plus, Eye, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PelosiSectionProps {
  onClose?: () => void;
}

export default function PelosiSection({ onClose }: PelosiSectionProps) {
  const navigate = useNavigate();
  const { addToQueue } = useQueue();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const rows = PELOSI_TRADES
    .map(t => {
      // Get stock from extended database for richer data
      const stock = extendedStockDatabase.find(s => s.symbol === t.symbol) || getStock(t.symbol);
      return { ...t, stock };
    })
    .filter(r => r.stock); // only known tickers

  const symbols = rows.map(r => r.stock!.symbol);

  const handleAddAllToQueue = () => {
    symbols.forEach(symbol => addToQueue(symbol, "bullish"));
    setShowSuccessModal(true);

    // Close the original section if callback provided
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const handleAddToQueue = (symbol: string) => {
    addToQueue(symbol, "bullish");
    console.log(`Added ${symbol} to queue`);
  };

  const handleViewQueue = () => {
    setShowSuccessModal(false);
    navigate('/queue/review');
  };

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Nancy Pelosi's Portfolio</CardTitle>
              <p className="text-sm text-gray-600 mt-1">(Congressional disclosure data)</p>
            </div>
            <Button
              onClick={handleAddAllToQueue}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add All to Queue
            </Button>
          </div>
        </CardHeader>

      <CardContent>
        <ScrollArea className="h-[70vh]">
          <div className="space-y-3">
            {rows.map((r, index) => (
              <div
                key={`${r.symbol}-${r.lastTradeDate}-${index}`}
                className="grid grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Stock Symbol & Name */}
                <div className="col-span-4">
                  <div className="font-bold text-lg text-gray-900">{r.stock!.symbol}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">{r.stock!.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {r.stock!.exchange}
                  </Badge>
                </div>

                {/* Last Trade Date */}
                <div className="col-span-3">
                  <div className="text-sm text-gray-500">Last Trade:</div>
                  <div className="font-medium text-sm">
                    {new Date(r.lastTradeDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Amount Range */}
                <div className="col-span-3">
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

                {/* Action Button */}
                <div className="col-span-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleAddToQueue(r.stock!.symbol)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add to Queue
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

    {/* Success Dialog */}
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Portfolio Added!</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                You've added Nancy Pelosi's portfolio to your queue
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">
            {symbols.length} stocks added to your queue
          </div>
          <div className="text-xs text-blue-700">
            {symbols.slice(0, 4).join(', ')}{symbols.length > 4 ? ` and ${symbols.length - 4} more` : ''}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowSuccessModal(false)}
            className="flex-1"
          >
            Continue Research
          </Button>
          <Button
            onClick={handleViewQueue}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            View Queue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
