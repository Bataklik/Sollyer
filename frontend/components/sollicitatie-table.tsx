"use client";

import { Pencil, PenOff, Trash2, ExternalLink, X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import type { Sollicitatie } from "@/lib/types";

interface SollicitatieTableProps {
    data: Sollicitatie[] | undefined;
    isLoading: boolean;
    onEdit: (sollicitatie: Sollicitatie) => void;
    onDelete: (id: string) => void;
    isLoggedIn: boolean;
}

export function SollicitatieTable({
    data,
    isLoading,
    onEdit,
    onDelete,
    isLoggedIn,
}: SollicitatieTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white/80">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#D2DAFF]/50">
                            <TableHead>Bedrijf</TableHead>
                            <TableHead>Functie</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notities</TableHead>
                            <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="ml-auto h-8 w-20" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="rounded-lg border bg-white/80 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#D2DAFF]/50 hover:bg-[#D2DAFF]/50">
                        <TableHead className="font-semibold">Bedrijf</TableHead>
                        <TableHead className="font-semibold">Functie</TableHead>
                        <TableHead className="font-semibold">Datum</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">
                            Notities
                        </TableHead>
                        <TableHead className="text-right font-semibold">
                            Acties
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((sollicitatie, index) => (
                        <TableRow
                            key={sollicitatie.id}
                            className={index % 2 === 1 ? "bg-[#EEF1FF]/50" : ""}
                        >
                            <TableCell className="font-medium">
                                {sollicitatie.link ? (
                                    <a
                                        href={sollicitatie.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[#6366f1] hover:underline"
                                    >
                                        {sollicitatie.bedrijfsnaam}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                ) : (
                                    sollicitatie.bedrijfsnaam
                                )}
                            </TableCell>
                            <TableCell>{sollicitatie.functie}</TableCell>
                            <TableCell>
                                {formatDate(sollicitatie.datum)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={sollicitatie.status} />
                            </TableCell>
                            <TableCell className="max-w-50 truncate">
                                {sollicitatie.notities || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                                {isLoggedIn ? (
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(sollicitatie)}
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">
                                                Bewerken
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                onDelete(sollicitatie.id)
                                            }
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Verwijderen
                                            </span>
                                        </Button>
                                    </div>
                                ) : null}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
