import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Product } from "@/types/product";
import { Product } from "@/lib/schemas/zodschemas";

const BASE_URL = "/api/v1/bingwa"; // Your Next.js API route path

export function useBingwaOffers(authToken?: string) {
  const queryClient = useQueryClient();

  // Helper for authenticated headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  });

  // --- READ ---
  const {
    data: offers = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["bingwa-offers"],
    queryFn: async () => {
      const res = await fetch(BASE_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  // --- CREATE ---
  const createMutation = useMutation({
    mutationFn: async (newOffer: Omit<Product, "id">) => {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newOffer),
      });
      if (!res.ok) throw new Error("Failed to create offer");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bingwa-offers"] }),
  });

  // --- UPDATE (EDIT) ---
  const updateMutation = useMutation({
    mutationFn: async (updatedOffer: Product) => {
      // id should be a parameter in the URL
      const res = await fetch(`${BASE_URL}?id=${updatedOffer.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedOffer),
      });
      if (!res.ok) throw new Error("Failed to update offer");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bingwa-offers"] }),
  });

  // --- DELETE ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE_URL}?id=${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete offer");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bingwa-offers"] }),
  });

  return {
    offers,
    isLoading,
    isError,
    // Actions
    createOffer: createMutation.mutateAsync,
    updateOffer: updateMutation.mutateAsync,
    deleteOffer: deleteMutation.mutateAsync,
    // Loading States for UI feedback
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
