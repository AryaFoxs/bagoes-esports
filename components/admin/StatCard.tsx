import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/20",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm mt-1",
                  change.type === "increase"
                    ? "text-accent"
                    : "text-destructive"
                )}
              >
                {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}%
                <span className="text-muted-foreground ml-1">vs bulan lalu</span>
              </p>
            )}
          </div>
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              iconBgColor
            )}
          >
            <Icon className={cn("w-7 h-7", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
