"use client";

import * as React from "react";
import useSWR from "swr";
import { Download, Plus, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { StatCards } from "@/components/stat-cards";
import { SollicitatieTable } from "@/components/sollicitatie-table";
import { SollicitatieDialog } from "@/components/sollicitatie-dialog";
import { EmptyState } from "@/components/empty-state";
import type { Sollicitatie } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DashboardProps {
    isLoggedIn: boolean;
}

export function Dashboard({ isLoggedIn }: DashboardProps) {
    const { data, error, isLoading, mutate } = useSWR<Sollicitatie[]>(
        "/api/sollicitatie",
        fetcher,
    );

    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingSollicitatie, setEditingSollicitatie] =
        React.useState<Sollicitatie | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    // Filter data based on search and status
    const filteredData = React.useMemo(() => {
        if (!data) return [];

        return data.filter((item) => {
            const matchesSearch =
                searchQuery === "" ||
                item.bedrijfsnaam
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.functie
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.locatie.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, searchQuery, statusFilter]);

    const handleAdd = () => {
        setEditingSollicitatie(null);
        setDialogOpen(true);
    };

    const handleEdit = (sollicitatie: Sollicitatie) => {
        setEditingSollicitatie(sollicitatie);
        setDialogOpen(true);
    };

    const handleDownload = (format: "csv" | "markdown") => {
        if (!data || data.length === 0) return;

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === "csv") {
            const headers = ["Bedrijf", "Functie", "Locatie", "Datum", "Status", "Link", "Notities"];
            const rows = data.map((s) => [
                s.bedrijfsnaam,
                s.functie,
                s.locatie,
                s.datum,
                s.status,
                s.link ?? "",
                (s.notities ?? "").replace(/\n/g, " "),
            ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
            content = [headers.join(","), ...rows].join("\n");
            filename = "sollicitaties.csv";
            mimeType = "text/csv";
        } else {
            const header = "| Bedrijf | Functie | Locatie | Datum | Status | Link | Notities |\n|---|---|---|---|---|---|---|";
            const rows = data.map((s) =>
                `| ${s.bedrijfsnaam} | ${s.functie} | ${s.locatie} | ${s.datum} | ${s.status} | ${s.link ?? "-"} | ${s.notities ?? "-"} |`
            );
            content = [header, ...rows].join("\n");
            filename = "sollicitaties.txt";
            mimeType = "text/plain";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (id: string) => {
        if (
            !confirm("Weet je zeker dat je deze sollicitatie wilt verwijderen?")
        ) {
            return;
        }

        try {
            await fetch(`/api/sollicitatie/${id}`, { method: "DELETE" });
            mutate();
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    const handleSubmit = async (formData: Omit<Sollicitatie, "id">) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            let res: Response;
            if (editingSollicitatie) {
                res = await fetch(`/api/sollicitatie/${editingSollicitatie.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } else {
                res = await fetch("/api/sollicitatie", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            }

            if (!res.ok) {
                setSubmitError("Opslaan mislukt. Controleer de ingevulde gegevens.");
                return;
            }

            mutate();
            setDialogOpen(false);
        } catch (err) {
            console.error("Failed to save:", err);
            setSubmitError("Er is een onverwachte fout opgetreden.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center text-red-500">
                Er is een fout opgetreden bij het laden van de data.
            </div>
        );
    }

    const showEmptyState = !isLoading && (!data || data.length === 0);
    const showNoResults =
        !isLoading && data && data.length > 0 && filteredData.length === 0;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <StatCards data={data} isLoading={isLoading} />

            {/* Filters and Add button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <InputGroup className="w-full sm:w-72">
                        <InputGroupAddon>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder="Zoeken..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>

                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter op status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Alle statussen</SelectItem>
                            {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={!data || data.length === 0}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload("csv")}>
                                CSV (Excel)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload("markdown")}>
                                Markdown
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {isLoggedIn && (
                        <Button
                            onClick={handleAdd}
                            className="bg-[#B1B2FF] text-slate-800 hover:bg-[#9d9eff]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nieuwe sollicitatie
                        </Button>
                    )}
                </div>
            </div>

            {/* Table or Empty State */}
            {showEmptyState ? (
                <EmptyState onAdd={handleAdd} />
            ) : showNoResults ? (
                <div className="flex h-40 items-center justify-center rounded-lg border bg-white/80 text-muted-foreground">
                    Geen sollicitaties gevonden voor je zoekopdracht.
                </div>
            ) : (
                <SollicitatieTable
                    data={filteredData}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoggedIn={isLoggedIn}
                />
            )}

            {/* Add/Edit Dialog */}
            <SollicitatieDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                sollicitatie={editingSollicitatie}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={submitError}
            />
        </div>
    );
}
