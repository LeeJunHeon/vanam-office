"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type LookupItem = {
  code: string;
  label: string;
  color: string | null;
  sortOrder: number;
};
export type Lookups = Record<string, LookupItem[]>;

export function useLookups() {
  const [lookups, setLookups] = useState<Lookups>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(api("/api/lookups"))
      .then((r) => (r.ok ? r.json() : {}))
      .then(setLookups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { lookups, loading };
}
