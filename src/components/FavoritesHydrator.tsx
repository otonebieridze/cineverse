"use client";

import { useEffect } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

export function FavoritesHydrator() {
  useEffect(() => {
    void useFavoritesStore.persist.rehydrate();
  }, []);

  return null;
}
