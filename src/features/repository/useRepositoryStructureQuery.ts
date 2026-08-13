import { useQuery } from "@tanstack/react-query";
import { getRepositoryStructure } from "../../services/repositoryStructure";
export function useRepositoryStructureQuery() {
  return useQuery({
    queryKey: ["repository-structure"],
    queryFn: getRepositoryStructure,
    staleTime: 60_000,
  });
}
