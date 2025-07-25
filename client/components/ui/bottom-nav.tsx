import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  Eye,
  Bot,
  CreditCard,
  Receipt,
  Building2,
  Wallet,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQueue } from "@/hooks/use-queue";

const navigationItems = [
  {
    href: "/",
    label: "Discover",
    icon: Home,
  },
  {
    href: "/markets",
    label: "Markets",
    icon: BarChart3,
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    icon: Eye,
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: Wallet,
  },
  {
    href: "/research",
    label: "AI Chat",
    icon: Bot,
  },
];

export function BottomNav() {
  const location = useLocation();
  const { queue } = useQueue();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-50 safe-area-bottom">
      <div className="relative">
        {/* Queue Floating Action Button */}
        {queue.length > 0 && (
          <Link
            to="/queue/review"
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 hover:bg-blue-700 transition-colors touch-manipulation"
          >
            <Receipt className="h-6 w-6 text-white" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs shadow-md"
            >
              {queue.length}
            </Badge>
          </Link>
        )}

        <div className="flex items-center justify-around px-2 py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href === "/" && location.pathname.startsWith("/stock"));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-2xl transition-all duration-200 touch-manipulation",
                  isActive
                    ? "text-blue-600 bg-blue-50 scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95",
                )}
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "mb-1 transition-all duration-200",
                      isActive ? "h-6 w-6" : "h-5 w-5"
                    )} 
                  />
                  {item.href === "/" && queue.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "font-semibold" : ""
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Safe Area Padding */}
        <div className="h-0 pb-safe-area-bottom" />
      </div>
    </nav>
  );
}
