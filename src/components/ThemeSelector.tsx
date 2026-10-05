import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ThemeMode, AccentColor } from '../types.ts';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, accent, setAccent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accents: Array<{ id: AccentColor; label: string; colorHex: string }> = [
    { id: 'forest', label: 'Forest Green', colorHex: '#1D5337' },
    { id: 'sage', label: 'Sage Teal', colorHex: '#2C6E56' },
    { id: 'terracotta', label: 'Terracotta Clay', colorHex: '#A8492C' },
    { id: 'amber', label: 'Golden Amber', colorHex: '#B26A18' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Display & theme preferences"
        title="Theme and Accent Colors"
        className="flex items-center gap-1.5 p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-emerald-400" />
        ) : theme === 'light' ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Monitor className="w-4 h-4 text-stone-500 dark:text-stone-400" />
        )}
        <Palette className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
            Appearance
          </div>

          {/* Theme Modes */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg mb-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-stone-500" />
              Auto
            </button>
          </div>

          {/* Accent Color Presets */}
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-2 mb-2">
            Earth Accent
          </div>
          <div className="space-y-1">
            {accents.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setAccent(acc.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  accent === acc.id
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-medium'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                    style={{ backgroundColor: acc.colorHex }}
                  />
                  <span>{acc.label}</span>
                </div>
                {accent === acc.id && (
                  <Check className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 px-2 leading-relaxed">
            Preferences are saved to this device. High contrast AA standards maintained.
          </div>
        </div>
      )}
    </div>
  );
};
