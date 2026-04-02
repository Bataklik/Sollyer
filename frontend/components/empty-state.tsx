"use client";

import { FileSearch } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <Empty className="border bg-white/80 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-[#D2DAFF]">
          <FileSearch className="h-6 w-6 text-[#6366f1]" />
        </EmptyMedia>
        <EmptyTitle>Geen sollicitaties gevonden</EmptyTitle>
        <EmptyDescription>
          Je hebt nog geen sollicitaties toegevoegd. Begin met het bijhouden van
          je sollicitaties door er een toe te voegen.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          onClick={onAdd}
          className="bg-[#B1B2FF] text-slate-800 hover:bg-[#9d9eff]"
        >
          Eerste sollicitatie toevoegen
        </Button>
      </EmptyContent>
    </Empty>
  );
}
