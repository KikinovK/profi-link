'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    };

    const storedTheme = getCookie('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    setIsMounted(true);
  }, []);


  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-yellow-500 dark:text-gray-400 transition-colors" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Moon className="h-5 w-5 text-gray-700 dark:text-yellow-300 transition-colors" />
    </div>
  );
}

export default ThemeToggle;
