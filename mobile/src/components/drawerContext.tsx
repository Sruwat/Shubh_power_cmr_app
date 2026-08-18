import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: PropsWithChildren) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const value = useMemo<DrawerContextValue>(() => ({
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    isDrawerOpen
  }), [isDrawerOpen]);
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  return useContext(DrawerContext) ?? {
    openDrawer: () => undefined,
    closeDrawer: () => undefined,
    isDrawerOpen: false
  };
}
