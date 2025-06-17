
import { ReactNode, useEffect } from 'react';
import { useStore } from './useStore';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { theme } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
