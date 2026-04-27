'use client';

export function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  void onMenuOpen;

  return (
    <nav
      className="fixed inset-x-0 top-0 z-30 transition-colors duration-500"
      style={{ color: 'var(--fg)' }}
    />
  );
}
