export function AuthLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Fancy animated logo or ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

        {/* Pulsing Core */}
        <div className="absolute h-8 w-8 animate-pulse rounded-full bg-primary/40" />
      </div>

      {/* Subtle Text */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-sm font-medium tracking-tight text-foreground animate-pulse">
          Mazeltov Dashboard
        </p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Securely authenticating
        </p>
      </div>
    </div>
  );
}
