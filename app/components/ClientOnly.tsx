'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client-side
 * Helps prevent hydration errors by ensuring browser-specific code
 * only runs after hydration is complete
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only render children on the client to avoid hydration mismatch
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 