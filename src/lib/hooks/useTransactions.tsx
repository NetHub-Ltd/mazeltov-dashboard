// import useSWR from "swr";
// import { Transaction } from "@/lib/schemas/zodschemas";

// // 1. Define the Response Structure
// interface TransactionsResponse {
//   message: string;
//   data: Transaction[];
//   error?: string;
// }

// // 2. Optimized Fetcher
// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.error || "Failed to fetch transactions");
//   }
//   return res.json();
// };

// export function useTransactions(limit: number = 50) {
//   const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(
//     `/api/v1/transactions?limit=${limit}`,
//     fetcher,
//     {
//       revalidateOnFocus: false, // Prevents unnecessary jumps
//       dedupingInterval: 5000, // Cache for 5 seconds
//     },
//   );

//   return {
//     transactions: data?.data ?? [],
//     isLoading,
//     isError: !!error,
//     errorMessage: error?.message,
//     refresh: mutate, // Call this to manually refresh data
//   };
// }

import useSWR from "swr";
import { Transaction } from "@/lib/schemas/zodschemas";
import { useState } from "react";

interface TransactionsResponse {
  data: Transaction[];
  totalCount: number; // Ensure your backend/proxy returns this for pagination
  totalPages: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function useTransactions(initialLimit = 20) {
  const [limit, setLimit] = useState(initialLimit);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // SWR Key changes whenever dependencies change, triggering a re-fetch
  const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(
    `/api/v1/transactions?limit=${limit}&page=${page}&search=${encodeURIComponent(search)}`,
    fetcher,
    { keepPreviousData: true }, // Prevents layout pop during pagination
  );

  return {
    transactions: data?.data ?? [],
    pagination: {
      total: data?.totalCount ?? 0,
      totalPages: data?.totalPages ?? 1,
      page,
      setPage,
      limit,
      setLimit,
    },
    search: {
      query: search,
      setQuery: (q: string) => {
        setSearch(q);
        setPage(1);
      }, // Reset page on search
    },
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
