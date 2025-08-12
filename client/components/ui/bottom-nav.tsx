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
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQueue } from "@/hooks/use-queue";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/markets",
    label: "Markets",
    icon: BarChart3,
  },
  {
    href: "/news",
    label: "News",
    icon: Sparkles,
  },
  {
    href: "/research",
    label: "AI",
    icon: Bot,
  },
  {
    href: "/banking",
    label: "Bank",
    icon: Building2,
  },
];

export function BottomNav() {
  const location = useLocation();
  const { queue } = useQueue();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
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
                "flex flex-col items-center justify-center min-w-[60px] py-2 px-2 rounded-lg transition-colors",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {item.href === "/" && queue.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {queue.length}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Queue Review Button */}
        {queue.length > 0 && (
          <Link
            to="/queue/review"
            className="flex flex-col items-center justify-center min-w-[60px] py-2 px-2 rounded-lg bg-blue-600 text-white"
          >
            <Receipt className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Queue</span>
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-white text-blue-600"
            >
              {queue.length}
            </Badge>
          </Link>
        )}
      </div>
    </nav>
  );
}
