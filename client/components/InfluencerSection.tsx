import { getInfluencerStocks } from "../data/influencer.map";
import { addToQueue } from "../store/queue";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

interface InfluencerSectionProps {
  slug?: string;
}

export default function InfluencerSection({ slug = "lebron-james" }: InfluencerSectionProps) {
  const stocks = getInfluencerStocks(slug);

  const handleAddToQueue = (symbol: string) => {
    addToQueue(symbol);
    // Optional: Show toast notification or feedback
    console.log(`Added ${symbol} to queue`);
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
    <section className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">LeBron James — Related Public Tickers</h3>
        <p className="text-sm text-gray-600">(Demo - Public associations only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stocks.map(stock => {
          const isPositive = (stock!.changePercent ?? 0) >= 0;
          return (
            <Card key={stock!.symbol} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg text-gray-900">{stock!.symbol}</div>
                    <div className="text-sm text-gray-600 font-medium">{stock!.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {stock!.exchange}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${stock!.price?.toFixed(2) ?? "0.00"}</div>
                    <div className={`flex items-center gap-1 text-sm ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? "+" : ""}{stock!.changePercent?.toFixed(2) ?? "0.00"}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {stock!.sector}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleAddToQueue(stock!.symbol)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        * Based on publicly reported business relationships. Not investment advice.
      </div>
    </section>
  );
}
