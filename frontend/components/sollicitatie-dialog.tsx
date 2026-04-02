"use client";

import * as React from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { Sollicitatie, SollicitatieStatus } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";

interface SollicitatieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sollicitatie?: Sollicitatie | null;
  onSubmit: (data: Omit<Sollicitatie, "id">) => void;
  isSubmitting: boolean;
}

export function SollicitatieDialog({
  open,
  onOpenChange,
  sollicitatie,
  onSubmit,
  isSubmitting,
}: SollicitatieDialogProps) {
  const [bedrijfsnaam, setBedrijfsnaam] = React.useState("");
  const [locatie, setLocatie] = React.useState("");
  const [functie, setFunctie] = React.useState("");
  const [datum, setDatum] = React.useState<Date | undefined>(new Date());
  const [status, setStatus] = React.useState<SollicitatieStatus>("Verzonden");
  const [link, setLink] = React.useState("");
  const [notities, setNotities] = React.useState("");

  // Reset form when dialog opens/closes or sollicitatie changes
  React.useEffect(() => {
    if (open) {
      if (sollicitatie) {
        setBedrijfsnaam(sollicitatie.bedrijfsnaam);
        setLocatie(sollicitatie.locatie);
        setFunctie(sollicitatie.functie);
        setDatum(new Date(sollicitatie.datum));
        setStatus(sollicitatie.status);
        setLink(sollicitatie.link || "");
        setNotities(sollicitatie.notities || "");
      } else {
        setBedrijfsnaam("");
        setLocatie("");
        setFunctie("");
        setDatum(new Date());
        setStatus("Verzonden");
        setLink("");
        setNotities("");
      }
    }
  }, [open, sollicitatie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bedrijfsnaam,
      locatie,
      functie,
      datum: datum ? format(datum, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      status,
      link: link || undefined,
      notities: notities || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {sollicitatie ? "Sollicitatie bewerken" : "Nieuwe sollicitatie"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="bedrijfsnaam">Bedrijfsnaam</FieldLabel>
              <Input
                id="bedrijfsnaam"
                value={bedrijfsnaam}
                onChange={(e) => setBedrijfsnaam(e.target.value)}
                placeholder="Bijv. Vercel"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="functie">Functie</FieldLabel>
              <Input
                id="functie"
                value={functie}
                onChange={(e) => setFunctie(e.target.value)}
                placeholder="Bijv. Frontend Developer"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="locatie">Locatie</FieldLabel>
              <Input
                id="locatie"
                value={locatie}
                onChange={(e) => setLocatie(e.target.value)}
                placeholder="Bijv. Amsterdam"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Datum</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !datum && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {datum ? (
                      format(datum, "d MMMM yyyy", { locale: nl })
                    ) : (
                      <span>Selecteer datum</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={datum}
                    onSelect={setDatum}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select value={status} onValueChange={(v) => setStatus(v as SollicitatieStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="link">Link (optioneel)</FieldLabel>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notities">Notities (optioneel)</FieldLabel>
              <Textarea
                id="notities"
                value={notities}
                onChange={(e) => setNotities(e.target.value)}
                placeholder="Extra informatie..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#B1B2FF] text-slate-800 hover:bg-[#9d9eff]"
            >
              {isSubmitting ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
