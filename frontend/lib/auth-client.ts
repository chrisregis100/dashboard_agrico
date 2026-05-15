// Auth client configuration - to be implemented
// Placeholder exports for build compatibility

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResult {
  error: { message: string } | null;
  data?: unknown;
}

export const signIn = {
  email: async (_credentials: SignInCredentials): Promise<SignInResult> => {
    // TODO: Implement actual authentication
    return { error: { message: "Authentication not implemented" } };
  },
};

export async function signOut(): Promise<void> {
  // TODO: Implement actual sign out
  console.log("signOut called");
}

interface Session {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface UseSessionResult {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
}

export function useSession(): UseSessionResult {
  // TODO: Implement actual session hook
  return {
    data: null,
    isPending: false,
    error: null,
  };
}
