"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateTimePickerProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [pickerView, setPickerView] = React.useState<"calendar" | "monthYear">(
    "calendar",
  );
  const [displayMonth, setDisplayMonth] = React.useState<Date>(() =>
    value ? new Date(value) : new Date(),
  );
  const [yearPage, setYearPage] = React.useState(() => {
    const y = value ? new Date(value).getFullYear() : new Date().getFullYear();
    return Math.floor(y / 12) * 12;
  });

  const dateValue = value ? new Date(value) : undefined;
  const hours = dateValue ? dateValue.getHours() : 12;
  const minutes = dateValue ? dateValue.getMinutes() : 0;
  const now = new Date();

  const toDateTimeLocal = (d: Date, h: number, m: number) => {
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hr = String(h).padStart(2, "0");
    const mn = String(m).padStart(2, "0");
    return `${y}-${mo}-${day}T${hr}:${mn}`;
  };

  const handleDateSelect = (day: Date | undefined) => {
    if (!day) {
      onChange(null);
      return;
    }
    const h = dateValue ? dateValue.getHours() : 12;
    const m = dateValue ? dateValue.getMinutes() : 0;
    onChange(toDateTimeLocal(day, h, m));
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    const base = dateValue ? new Date(dateValue) : new Date();
    onChange(toDateTimeLocal(base, newHours, newMinutes));
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(monthIndex);
    setDisplayMonth(newDate);
    setPickerView("calendar");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(year);
    setDisplayMonth(newDate);
  };

  const incrementHour = () => handleTimeChange((hours + 1) % 24, minutes);
  const decrementHour = () => handleTimeChange((hours - 1 + 24) % 24, minutes);
  const incrementMinute = () => handleTimeChange(hours, (minutes + 5) % 60);
  const decrementMinute = () =>
    handleTimeChange(hours, (minutes - 5 + 60) % 60);

  React.useEffect(() => {
    if (open) {
      setPickerView("calendar");
      setDisplayMonth(dateValue ?? new Date());
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            "bg-black/40 border-white/5 hover:bg-black/60 hover:border-blue-500/20",
            "text-sm transition-all group",
            !value && "text-neutral-600",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-neutral-600 group-hover:text-blue-400 transition-colors" />
          {dateValue ? (
            <span className="text-neutral-200 font-bold tracking-wide">
              {format(dateValue, "dd MMM yyyy", { locale: es })}
              <span className="text-neutral-500 font-mono ml-2">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}
              </span>
            </span>
          ) : (
            <span className="text-neutral-600 font-medium">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-neutral-950 border-white/10 shadow-2xl shadow-black/50"
        align="start"
        side="bottom"
        avoidCollisions
        sideOffset={8}
      >
        {/* Scoped dark theme for react-day-picker v9 */}
        <style>{`
          .dtp-dark .rdp-root {
            --rdp-accent-color: #2563eb;
            --rdp-accent-background-color: rgba(37,99,235,0.15);
            --rdp-day-height: 38px;
            --rdp-day-width: 38px;
          }
          .dtp-dark .rdp-month_caption { color: #e5e5e5; text-transform: capitalize; font-weight: 800; cursor: pointer; user-select: none; }
          .dtp-dark .rdp-month_caption:hover .rdp-caption_label { color: #60a5fa; }
          .dtp-dark .rdp-button_previous,
          .dtp-dark .rdp-button_next { color: #737373; border-radius: 8px; }
          .dtp-dark .rdp-button_previous:hover,
          .dtp-dark .rdp-button_next:hover { color: #60a5fa; background: rgba(255,255,255,0.05); }
          .dtp-dark .rdp-weekday { color: #525252; font-weight: 700; text-transform: uppercase; font-size: 10px; padding: 4px 0; }
          .dtp-dark .rdp-day_button { color: #a3a3a3; border-radius: 9px; transition: all 0.12s; font-size: 13px; }
          .dtp-dark .rdp-day_button:hover { background: rgba(255,255,255,0.06); color: #fff; }
          .dtp-dark .rdp-selected .rdp-day_button { background: #2563eb !important; color: #fff !important; font-weight: 800; }
          .dtp-dark .rdp-today:not(.rdp-selected) .rdp-day_button { background: rgba(255,255,255,0.04); color: #60a5fa; font-weight: 700; }
          .dtp-dark .rdp-outside .rdp-day_button { color: #3a3a3a; }
          .dtp-dark .rdp-disabled .rdp-day_button { color: #282828 !important; cursor: not-allowed; }
          .dtp-dark .rdp-disabled .rdp-day_button:hover { background: transparent; }
        `}</style>

        {/* Horizontal layout: calendar LEFT | right panel RIGHT */}
        <div className="dtp-dark flex divide-x divide-white/5">
          {/* ─── LEFT: Calendar (fixed width keeps arrows inside) ─── */}
          <div className="w-[300px] shrink-0 flex flex-col">
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest(".rdp-caption_label")) {
                  e.preventDefault();
                  e.stopPropagation();
                  setYearPage(Math.floor(displayMonth.getFullYear() / 12) * 12);
                  setPickerView("monthYear");
                }
              }}
            >
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={handleDateSelect}
                locale={es}
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                disabled={{ before: new Date() }}
                className="p-4"
              />
            </div>
            {/* Bottom space — available for future content */}
            <div className="flex-1 flex items-end justify-center pb-4 px-5">
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className="text-[10px] font-bold text-neutral-700 hover:text-red-400 uppercase tracking-widest transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/5 w-full text-center"
                  aria-label="Borrar fecha"
                >
                  Borrar fecha
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT: Time + optional month/year picker ─── */}
          <div className="flex flex-col min-w-[160px]">
            {pickerView === "calendar" ? (
              /* Time picker */
              <div className="flex flex-col items-center justify-center flex-1 px-5 py-5 gap-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-blue-400/60" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Hora
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hours */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={incrementHour}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Incrementar hora"
                    >
                      <CaretUp className="w-4 h-4" />
                    </button>
                    <div className="w-14 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                      <span className="text-2xl font-black text-neutral-100 font-mono tabular-nums">
                        {String(hours).padStart(2, "00")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={decrementHour}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Decrementar hora"
                    >
                      <CaretDown className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-2xl font-black text-neutral-700 mb-0.5">
                    :
                  </span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={incrementMinute}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Incrementar minutos"
                    >
                      <CaretUp className="w-4 h-4" />
                    </button>
                    <div className="w-14 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                      <span className="text-2xl font-black text-neutral-100 font-mono tabular-nums">
                        {String(minutes).padStart(2, "0")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={decrementMinute}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Decrementar minutos"
                    >
                      <CaretDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Selected date summary */}
                {dateValue && (
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-neutral-300">
                      {format(dateValue, "dd MMM yyyy", { locale: es })}
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">
                      {String(hours).padStart(2, "0")}:
                      {String(minutes).padStart(2, "0")} hrs
                    </p>
                  </div>
                )}

                {/* Clear button */}
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="text-[9px] font-bold text-neutral-700 hover:text-red-400 uppercase tracking-widest transition-colors px-2 py-1 rounded-lg hover:bg-red-500/5"
                    aria-label="Borrar fecha"
                  >
                    Borrar fecha
                  </button>
                )}
              </div>
            ) : (
              /* Month / Year picker */
              <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Year section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => setYearPage((p) => p - 12)}
                      className="p-1 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Años anteriores"
                    >
                      <CaretLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                      {yearPage}–{yearPage + 11}
                    </span>
                    <button
                      type="button"
                      onClick={() => setYearPage((p) => p + 12)}
                      className="p-1 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-blue-400 transition-colors"
                      aria-label="Años siguientes"
                    >
                      <CaretRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 12 }, (_, i) => yearPage + i).map(
                      (year) => {
                        const isSel = displayMonth.getFullYear() === year;
                        const isCur = now.getFullYear() === year;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => handleYearSelect(year)}
                            className={cn(
                              "py-1.5 rounded-lg text-[11px] font-bold transition-all",
                              isSel
                                ? "bg-blue-600 text-white font-black"
                                : isCur
                                  ? "bg-white/5 text-blue-400"
                                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            {year}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Month section */}
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2">
                    Mes
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {MONTHS_ES.map((month, i) => {
                      const isSel = displayMonth.getMonth() === i;
                      const isCur =
                        now.getMonth() === i &&
                        displayMonth.getFullYear() === now.getFullYear();
                      const isPast =
                        displayMonth.getFullYear() === now.getFullYear() &&
                        i < now.getMonth();
                      return (
                        <button
                          key={month}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleMonthSelect(i)}
                          className={cn(
                            "py-1.5 rounded-lg text-[11px] font-bold transition-all",
                            isPast
                              ? "text-neutral-800 cursor-not-allowed"
                              : isSel
                                ? "bg-blue-600 text-white font-black"
                                : isCur
                                  ? "bg-white/5 text-blue-400"
                                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          {month}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Back */}
                <button
                  type="button"
                  onClick={() => setPickerView("calendar")}
                  className="text-[9px] font-bold text-neutral-600 hover:text-blue-400 uppercase tracking-widest transition-colors py-1 rounded-lg hover:bg-white/5"
                >
                  ← Volver
                </button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
