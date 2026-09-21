"use client";

import { useSyncExternalStore } from "react";
import { LIBRARY_EVENT, LIBRARY_STORAGE_KEY, readLibrary, type LibraryState } from "@/lib/library";

const emptyLibrary: LibraryState = {};

let cachedRaw: string | null = null;
let cachedLibrary: LibraryState = emptyLibrary;

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LIBRARY_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LIBRARY_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLibrary(): LibraryState {
  try {
    const raw = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (raw === cachedRaw) return cachedLibrary;
    cachedRaw = raw;
    cachedLibrary = readLibrary();
    return cachedLibrary;
  } catch {
    return emptyLibrary;
  }
}

function getServerLibrary(): LibraryState {
  return emptyLibrary;
}

export function useLibrary(): LibraryState {
  return useSyncExternalStore(subscribe, getLibrary, getServerLibrary);
}

function subscribeHydration() {
  return () => {};
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeHydration, () => true, () => false);
}
