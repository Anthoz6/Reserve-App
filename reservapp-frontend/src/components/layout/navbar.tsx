'use client';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';

// --- Componentes de UI (simulando shadcn/ui) ---
// En un proyecto real, este componente se importaría desde '@/components/ui/button'
// Lo incluyo aquí para que el componente Navbar sea autocontenido.
const ShadcnButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
ShadcnButton.displayName = 'Button';

export function Navbar() {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  const { user, logout, isAuthenticated } = auth;

  let links: { href: string; label: string }[] = [];
  if (isAuthenticated && user) {
    const role = user.role.role.toUpperCase();
    if (role === 'ADMIN') {
      links = [
        { href: '/dashboard/admin', label: 'Panel Admin' },
        { href: '/dashboard/admin/users', label: 'Gestión de Usuarios' },
      ];
    } else if (role === 'PROVIDER') {
      links = [
        { href: '/dashboard/provider', label: 'Panel Proveedor' },
        { href: '/dashboard/provider/services', label: 'Mis Servicios' },
        {
          href: '/dashboard/provider/reservations',
          label: 'Reservas Recibidas',
        },
      ];
    } else if (role === 'CUSTOMER') {
      links = [
        { href: '/dashboard/customer', label: 'Panel Cliente' },
        { href: '/dashboard/customer/reservations', label: 'Mis Reservas' },
      ];
    }
  }

  return (
    <nav className="w-full bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/" className="text-lg font-bold text-primary">
          ReservApp
        </Link>
        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span className="hidden sm:inline text-sm text-muted-foreground font-medium">
              {user.name || user.email}{' '}
              <span className="capitalize text-xs">({user.role.role.toLowerCase()})</span>
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button size="sm">Iniciar sesión</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
