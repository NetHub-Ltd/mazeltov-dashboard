// import useSWR from "swr";
// import { Transaction } from "@/lib/schemas/zodschemas";
// import { useState } from "react";

// interface TransactionsResponse {
//   data: Transaction[];
//   totalCount: number; // Ensure your backend/proxy returns this for pagination
//   totalPages: number;
// }

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// };

// export function useTransactions(initialLimit = 20) {
//   const [limit, setLimit] = useState(initialLimit);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//   // SWR Key changes whenever dependencies change, triggering a re-fetch
//   const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(
//     `/api/v1/transactions?limit=${limit}&page=${page}&search=${encodeURIComponent(search)}`,
//     fetcher,
//     { keepPreviousData: true }, // Prevents layout pop during pagination
//   );

//   return {
//     transactions: data?.data ?? [],
//     pagination: {
//       total: data?.totalCount ?? 0,
//       totalPages: data?.totalPages ?? 1,
//       page,
//       setPage,
//       limit,
//       setLimit,
//     },
//     search: {
//       query: search,
//       setQuery: (q: string) => {
//         setSearch(q);
//         setPage(1);
//       }, // Reset page on search
//     },
//     isLoading,
//     isError: !!error,
//     refresh: mutate,
//   };
// }

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Transaction } from "@/lib/schemas/zodschemas";

export function useTransactions(initialLimit = 20) {
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetching - Only re-runs when 'limit' changes
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/transactions?limit=${limit}`,
    (url) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false },
  );

  const rawTransactions: Transaction[] = data?.data ?? [];

  // 2. Client-Side Filtering & Sorting Logic
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return rawTransactions;

    return rawTransactions.filter((tx) => {
      return (
        tx.mpesa_receipt_number?.toLowerCase().includes(query) ||
        tx.paying_number.includes(query) ||
        tx.receiving_number.includes(query) ||
        tx.amount.toString().includes(query) ||
        tx.status.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, rawTransactions]);

  return {
    // UI uses this
    transactions: filteredTransactions,
    // Original count for UI stats
    totalLoaded: rawTransactions.length,
    // Controls
    searchQuery,
    setSearchQuery,
    limit,
    setLimit,
    // States
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
