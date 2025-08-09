import { getInfluencerStocks } from "../data/influencer.map";
import { addToQueue } from "../store/queue";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

interface InfluencerSectionProps {
  slug?: string;
}

export default function InfluencerSection({ slug = "lebron-james" }: InfluencerSectionProps) {
  const stocks = getInfluencerStocks(slug); // [{id,symbol,name},...]
  
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
        {stocks.map(stock => (
          <Card key={stock!.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-lg text-gray-900">{stock!.symbol}</div>
                  <div className="text-sm text-gray-600 font-medium">{stock!.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${stock!.price.toFixed(2)}</div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stock!.changePercent >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {stock!.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stock!.changePercent >= 0 ? "+" : ""}{stock!.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {stock!.sector}
                </Badge>
                <Button 
                  size="sm"
                  onClick={() => addToQueue(stock!.symbol, "lebron")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Queue
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Market Cap: {stock!.marketCap}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        * Based on publicly reported business relationships. Not investment advice.
      </div>
    </section>
  );
}
