"use client";

import { useSession } from "@/lib/auth-client";
import { MonthYearFilter } from "./MonthYearFilter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />
      <MonthYearFilter />
      <div className="ml-auto flex items-center gap-3">
        {session?.user && (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name}
            </span>
            <Badge variant="secondary" className="text-xs capitalize">
              {(session.user as { role?: string }).role ?? "vendeur"}
            </Badge>
          </div>
        )}
      </div>
    </header>
  );
}
