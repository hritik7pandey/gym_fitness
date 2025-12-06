"use client";
import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <button
      aria-pressed={dark}
      aria-label="Toggle theme"
      onClick={() => setDark((s) => !s)}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/60 ios-glass-accent"
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
