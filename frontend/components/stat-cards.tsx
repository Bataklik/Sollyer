"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sollicitatie } from "@/lib/types";

interface StatCardsProps {
  data: Sollicitatie[] | undefined;
  isLoading: boolean;
}

export function StatCards({ data, isLoading }: StatCardsProps) {
  const stats = data
    ? {
        totaal: data.length,
        actief: data.filter(
          (s) =>
            s.status !== "Afgewezen" && s.status !== "Aangeboden"
        ).length,
        gesprekGepland: data.filter((s) => s.status === "Gesprek gepland")
          .length,
        aangeboden: data.filter((s) => s.status === "Aangeboden").length,
      }
    : { totaal: 0, actief: 0, gesprekGepland: 0, aangeboden: 0 };

  const cards = [
    {
      label: "Totaal",
      value: stats.totaal,
      borderColor: "border-l-[#B1B2FF]",
    },
    {
      label: "Actief",
      value: stats.actief,
      borderColor: "border-l-[#AAC4FF]",
    },
    {
      label: "Gesprek gepland",
      value: stats.gesprekGepland,
      borderColor: "border-l-[#B1B2FF]",
    },
    {
      label: "Aangeboden",
      value: stats.aangeboden,
      borderColor: "border-l-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={`border-l-4 ${card.borderColor} bg-white/80`}
        >
          <CardContent className="p-4">
            {isLoading ? (
              <>
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
