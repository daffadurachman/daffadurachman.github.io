'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CommandPaletteModal = dynamic(
  () =>
    import('@/components/command/CommandPaletteModal').then(
      (mod) => mod.CommandPaletteModal
    ),
  { ssr: false }
);

interface CommandPaletteContextValue {
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  openCommandPalette: () => {},
  closeCommandPalette: () => {},
});

export function useCommandPalette(): CommandPaletteContextValue {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openCommandPalette = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const target = e.target as HTMLElement | null;
        const isEditable =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);

        // Allow Cmd/Ctrl+K to toggle closed even when focused inside the palette input itself
        if (isEditable && !isOpen) return;

        e.preventDefault();
        setHasOpened(true);
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  return (
    <CommandPaletteContext.Provider value={{ openCommandPalette, closeCommandPalette }}>
      {children}
      {hasOpened ? (
        <CommandPaletteModal isOpen={isOpen} onClose={closeCommandPalette} />
      ) : null}
    </CommandPaletteContext.Provider>
  );
}
