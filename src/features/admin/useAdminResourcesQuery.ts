import { useQuery } from "@tanstack/react-query";
import type { ResourceQuery } from "../../contracts/resource";
import { getAdminResources } from "../../services/adminResources";
import { useAuth } from "../auth/useAuth";

export function useAdminResourcesQuery(query: Partial<ResourceQuery>) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin-resources", user?.uid, query],
    queryFn: ({ signal }) => {
      if (!user) throw new Error("Please sign in to view repository files.");
      return getAdminResources(user, query, signal);
    },
    enabled: Boolean(user),
    retry: false,
  });
}
