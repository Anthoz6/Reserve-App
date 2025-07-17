// Componente visual para mostrar el rol de un usuario con un badge de color

const roleClasses: Record<string, string> = {
  ADMIN: 'bg-primary/10 text-primary',
  PROVIDER: 'bg-secondary/10 text-secondary-foreground',
  CUSTOMER: 'bg-accent/10 text-accent-foreground',
};

export default function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${roleClasses[role] || 'bg-muted text-muted-foreground'}`}
    >
      {role}
    </span>
  );
} 