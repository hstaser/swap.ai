import { useState } from "react";
import { getInfluencerStocks } from "../data/influencer.map";
import { useQueue } from "../hooks/use-queue";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Plus, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InfluencerSectionProps {
  slug?: string;
  onClose?: () => void;
}

export default function InfluencerSection({ slug = "lebron-james", onClose }: InfluencerSectionProps) {
  const navigate = useNavigate();
  const { addToQueue } = useQueue();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const stocks = getInfluencerStocks(slug);

  const handleAddToQueue = (symbol: string) => {
    addToQueue(symbol, "bullish");
    console.log(`Added ${symbol} to queue`);
  };

  const handleAddAllToQueue = () => {
    const symbols = stocks.map(stock => stock!.symbol);
    symbols.forEach(symbol => addToQueue(symbol, "bullish"));
    setShowSuccessModal(true);

    // Close the original section if callback provided
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const handleViewQueue = () => {
    setShowSuccessModal(false);
    navigate('/queue/review');
  };

  if (stocks.length === 0) {
    return (
      <section className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-bold mb-2">LeBron James — Related Stocks</h3>
        <p className="text-gray-500">No verified associations available at this time.</p>
      </section>
    );
  }

  return (
    <>
      <section className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">LeBron James's Portfolio</h3>
            <p className="text-sm text-gray-600">(Public business associations)</p>
          </div>
          <Button
            onClick={handleAddAllToQueue}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add All to Queue
          </Button>
        </div>

      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <div
            key={`${stock!.symbol}-${index}`}
            className="grid grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Stock Symbol & Name */}
            <div className="col-span-10">
              <div className="font-bold text-lg text-gray-900">{stock!.symbol}</div>
              <div className="text-sm text-gray-600 line-clamp-1">{stock!.name}</div>
              <Badge variant="outline" className="text-xs mt-1">
                {stock!.exchange}
              </Badge>
            </div>

            {/* Action Button */}
            <div className="col-span-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => handleAddToQueue(stock!.symbol)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add to Queue
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        * Based on publicly reported business relationships. Not investment advice.
      </div>
    </section>

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
                You've added LeBron James's portfolio to your queue
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">
            {stocks.length} stocks added to your queue
          </div>
          <div className="text-xs text-blue-700">
            {stocks.map(s => s!.symbol).join(', ')}
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
