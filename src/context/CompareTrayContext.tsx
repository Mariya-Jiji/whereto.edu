"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CompareCollege {
  id: number;
  name: string;
  location: string;
  rating: number;
}

interface CompareTrayContextType {
  colleges: CompareCollege[];
  addCollege: (college: CompareCollege) => void;
  removeCollege: (id: number) => void;
  clearTray: () => void;
  isInTray: (id: number) => boolean;
  isFull: boolean;
}

const CompareTrayContext = createContext<CompareTrayContextType | null>(null);

export function CompareTrayProvider({ children }: { children: ReactNode }) {
  const [colleges, setColleges] = useState<CompareCollege[]>([]);

  const addCollege = useCallback((college: CompareCollege) => {
    setColleges((prev) => {
      if (prev.find((c) => c.id === college.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  }, []);

  const removeCollege = useCallback((id: number) => {
    setColleges((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearTray = useCallback(() => setColleges([]), []);

  const isInTray = useCallback(
    (id: number) => colleges.some((c) => c.id === id),
    [colleges]
  );

  const isFull = colleges.length >= 3;

  return (
    <CompareTrayContext.Provider
      value={{ colleges, addCollege, removeCollege, clearTray, isInTray, isFull }}
    >
      {children}
    </CompareTrayContext.Provider>
  );
}

export function useCompareTray() {
  const ctx = useContext(CompareTrayContext);
  if (!ctx) throw new Error("useCompareTray must be used within CompareTrayProvider");
  return ctx;
}
