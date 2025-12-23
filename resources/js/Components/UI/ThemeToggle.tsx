import React from 'react';
import { useTheme } from '@/Hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: '☀️ Light', icon: '☀️' },
    { value: 'dark', label: '🌙 Dark', icon: '🌙' },
    { value: 'system', label: '💻 System', icon: '💻' },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-muted">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            theme === t.value
              ? 'bg-bg-base text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
