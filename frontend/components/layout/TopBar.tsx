"use client";

import { useSession } from "@/lib/auth-client";
import { MonthYearFilter } from "./MonthYearFilter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="flex min-h-14 flex-wrap items-center gap-2 border-b bg-background px-3 py-2 sm:gap-4 sm:px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
      </div>
      <MonthYearFilter />
      <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
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
