
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type Ecosystem = 'jani' | 'umoja' | 'culture';

interface EcosystemState {
  ecosystem: Ecosystem;
  setEcosystem: (ecosystem: Ecosystem) => void;
}

export const EcosystemContext = createContext<EcosystemState | undefined>(undefined);

export const EcosystemProvider = ({ children }: { children: ReactNode }) => {
  const [ecosystem, setEcosystemState] = useState<Ecosystem>('jani');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Automatically switch ecosystem based on the current page
    if (pathname.startsWith('/umoja')) {
      setEcosystemState('umoja');
    } else if (pathname.startsWith('/chat')) {
      setEcosystemState('culture');
    } else {
      setEcosystemState('jani');
    }
  }, [pathname]);

  useEffect(() => {
    // Add a class to the html element to control the theme
    const root = document.documentElement;
    root.classList.remove('theme-jani', 'theme-umoja', 'theme-culture');
    root.classList.add(`theme-${ecosystem}`);
  }, [ecosystem]);
  
  const setEcosystem = (newEcosystem: Ecosystem) => {
    setEcosystemState(newEcosystem);
    if (newEcosystem === 'jani') {
      router.push('/');
    } else if (newEcosystem === 'umoja') {
      router.push('/umoja');
    } else if (newEcosystem === 'culture') {
      router.push('/chat');
    }
  };


  const value = {
    ecosystem,
    setEcosystem,
  };

  return (
    <EcosystemContext.Provider value={value}>
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (context === undefined) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
