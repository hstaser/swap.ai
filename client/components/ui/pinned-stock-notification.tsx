import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pin,
  MessageCircle,
  Edit,
  Save,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PinnedNote {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isOwn?: boolean;
}

interface PinnedStockNotificationProps {
  symbol: string;
  stockName: string;
  pinnedBy: string;
  pinnedByAvatar: string;
  pinnedAt: Date;
  initialNote?: string;
  className?: string;
}

export function PinnedStockNotification({
  symbol,
  stockName,
  pinnedBy,
  pinnedByAvatar,
  pinnedAt,
  initialNote,
  className,
}: PinnedStockNotificationProps) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState<PinnedNote[]>([
    {
      id: "1",
      author: pinnedBy,
      content: initialNote || "Check this out - great growth potential!",
      timestamp: pinnedAt,
      isOwn: false,
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: PinnedNote = {
      id: Date.now().toString(),
      author: "You",
      content: newNote,
      timestamp: new Date(),
      isOwn: true,
    };

    setNotes(prev => [...prev, note]);
    setNewNote("");
    setIsAddingNote(false);
  };

  return (
    <>
      <Card 
        className={cn(
          "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
        onClick={() => setShowNotesModal(true)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Pin className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={pinnedByAvatar}
                  alt={pinnedBy}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-purple-800">
                  Pinged by {pinnedBy}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                {formatTimeAgo(pinnedAt)}
              </Badge>
              <MessageCircle className="h-3 w-3 text-purple-600" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-xs text-purple-700 italic truncate">
              "{initialNote || 'Check this out - great growth potential!'}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pin className="h-5 w-5 text-purple-600" />
              Notes for {symbol}
            </DialogTitle>
            <DialogDescription>
              {stockName} • Pinged by {pinnedBy}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Existing Notes */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    note.isOwn 
                      ? "bg-blue-50 border-blue-200 ml-4" 
                      : "bg-gray-50 border-gray-200 mr-4"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {note.author}
                      </span>
                      {note.isOwn && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(note.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Add New Note */}
            {isAddingNote ? (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Textarea
                  placeholder="Add your thoughts about this stock..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote("");
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsAddingNote(true)}
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Add Your Note
              </Button>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotesModal(false)}
              >
                Close
              </Button>
              <div className="text-xs text-gray-500">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper function to check if a stock is pinned by friends
export const getPinnedStockInfo = (symbol: string) => {
  const pinnedStocks = {
    MSFT: {
      pinnedBy: "Sarah",
      pinnedByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
      pinnedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      note: "Microsoft's Azure growth is incredible - 27% YoY! This could be a long-term winner with their AI partnerships."
    },
    GOOGL: {
      pinnedBy: "Josh",
      pinnedByAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      pinnedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      note: "Search dominance + AI investment = long-term winner"
    },
    NVDA: {
      pinnedBy: "Sarah", 
      pinnedByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
      pinnedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      note: "AI boom continues - this could be huge!"
    }
  };

  return pinnedStocks[symbol as keyof typeof pinnedStocks] || null;
};
