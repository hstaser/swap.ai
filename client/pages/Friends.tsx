import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FriendsInterface } from "@/components/ui/friends-interface";
import { ArrowLeft, Bell, Settings, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Friends() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Friends</h1>
                <p className="text-sm text-muted-foreground">
                  Connect and share stock ideas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <FriendsInterface
            onSendMessage={(friendId) =>
              navigate(`/messages?friend=${friendId}`)
            }
            onViewWatchlist={(friendId) =>
              navigate(`/friends/${friendId}/watchlist`)
            }
            onShareStock={(friendId) => {
              // Handle sharing logic - could open a stock sharing modal
              console.log(`Sharing with friend: ${friendId}`);
              navigate(`/friends/${friendId}/share`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
