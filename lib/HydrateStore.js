"use client";
import { useEffect } from "react";
import { useStore } from "./store";

export default function HydrateStore() {
  useEffect(() => {
    useStore.persist.rehydrate();
    useStore.getState().hydrateFromSupabase();
  }, []);
  return null;
}
