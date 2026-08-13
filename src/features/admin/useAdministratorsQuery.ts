import { useQuery } from "@tanstack/react-query";
import { getAdministrators } from "../../services/adminOperations";
import { useAuth } from "../auth/useAuth";
export function useAdministratorsQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["administrators", user?.uid],
    enabled: Boolean(user),
    queryFn: () => {
      if (!user) throw new Error("Authentication is required.");
      return getAdministrators(user);
    },
  });
}
