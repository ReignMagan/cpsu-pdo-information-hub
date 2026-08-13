import { useQuery } from "@tanstack/react-query";
import { fetchAdminSession } from "../../services/adminSession";
import { useAuth } from "./useAuth";

export function useAdminSessionQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin-session", user?.uid],
    queryFn: () => {
      if (!user) throw new Error("Please sign in to continue.");
      return fetchAdminSession(user);
    },
    enabled: Boolean(user),
    retry: false,
    staleTime: 5 * 60_000,
  });
}
