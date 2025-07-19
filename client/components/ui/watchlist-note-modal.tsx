import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Eye,
  TrendingUp,
  TrendingDown,
  FileText,
  Save,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface WatchlistNoteModalProps {
  isOpen: boolean;
  stock: Stock;
  onClose: () => void;
  onSave: (symbol: string, note: string) => void;
  existingNote?: string;
}

export function WatchlistNoteModal({
  isOpen,
  stock,
  onClose,
  onSave,
  existingNote = "",
}: WatchlistNoteModalProps) {
  const [note, setNote] = useState(existingNote);

  const handleSave = () => {
    onSave(stock.symbol, note);
    onClose();
  };

  if (!isOpen) return null;

  const isPositive = stock.change >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Add to Watchlist
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stock Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{stock.symbol}</div>
                <div className="text-sm text-gray-600">{stock.name}</div>
                <div className="text-xs text-gray-500 mt-1">{stock.sector}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  ${stock.price.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium mb-2 block">
              Note <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Add a note about this stock..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {note.length}/500 characters
            </div>
          </div>

          {/* Sample Note Suggestions */}
          {!note && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">
                Quick note ideas:
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  "Strong earnings expected",
                  "Waiting for dip to buy",
                  "Long-term hold candidate",
                  "Monitor for news",
                  "Technical breakout potential",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => setNote(suggestion)}
                    className="text-xs h-6 px-2 text-blue-600 hover:bg-blue-50"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button onClick={handleSave} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Save to Watchlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
