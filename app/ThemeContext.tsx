// components/ThemeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define o formato do nosso contexto
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Inicializa como true (Dark Mode por padrão)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ohara-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, [])

  useEffect(() => {
    // Essa mágica aplica a classe 'dark' no corpo do site (body)
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
      localStorage.setItem('ohara-theme', 'dark');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('ohara-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar fácil
export const useTheme = () => useContext(ThemeContext);