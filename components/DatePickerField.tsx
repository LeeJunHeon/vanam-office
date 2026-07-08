"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import { Calendar } from "lucide-react";

export default function DatePickerField({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fmt = (d?: Date) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between ${className}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "날짜 선택"}
        </span>
        <Calendar size={16} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-1 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            locale={ko}
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              onChange(fmt(d));
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(2010, 0)}
            endMonth={new Date(2035, 11)}
            style={{ "--rdp-accent-color": "#3b82f6" } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
}
