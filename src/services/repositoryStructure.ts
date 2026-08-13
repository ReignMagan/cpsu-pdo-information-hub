import type { User } from "firebase/auth";
import { repositoryStructureSchema } from "../contracts/repositoryStructure";
export async function getRepositoryStructure() {
  const response = await fetch("/api/repository-structure");
  if (!response.ok) throw new Error("Repository structure is unavailable.");
  return repositoryStructureSchema.parse(await response.json()).data;
}
export async function mutateRepositoryStructure(user: User, body: unknown) {
  const response = await fetch("/api/admin/repository-structure", {
    method: "POST",
    headers: {
      authorization: `Bearer ${await user.getIdToken()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload: unknown = await response.json();
  if (!response.ok)
    throw new Error(
      typeof payload === "object" &&
        payload &&
        "error" in payload &&
        typeof payload.error === "object" &&
        payload.error &&
        "message" in payload.error
        ? String(payload.error.message)
        : "The structure operation failed.",
    );
  return repositoryStructureSchema.parse(payload).data;
}
