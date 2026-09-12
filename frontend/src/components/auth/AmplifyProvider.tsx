"use client";

import { configureAmplify } from "@/lib/amplify/config";

// Configure Amplify once on the client side
configureAmplify();

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
