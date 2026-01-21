"use client";

// import { useTransactions } from "@/lib/hooks/useTransactions";

// export function TransactionTable() {
//   const { transactions, isLoading, isError, errorMessage } =
//     useTransactions(20);

//   if (isLoading)
//     return <div className="p-4 animate-pulse">Loading transactions...</div>;
//   if (isError)
//     return <div className="p-4 text-red-500">Error: {errorMessage}</div>;

//   return (
//     <div className="overflow-x-auto rounded-lg border border-slate-200">
//       <table className="w-full text-left text-sm">
//         <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
//           <tr>
//             <th className="px-4 py-3">Receipt</th>
//             <th className="px-4 py-3">Number</th>
//             <th className="px-4 py-3">Amount</th>
//             <th className="px-4 py-3">Status</th>
//             <th className="px-4 py-3">Date</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100">
//           {transactions.map((tx) => (
//             <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
//               <td className="px-4 py-3 font-mono text-xs">
//                 {tx.mpesa_receipt_number ?? "N/A"}
//               </td>
//               <td className="px-4 py-3">{tx.paying_number}</td>
//               <td className="px-4 py-3 font-medium">
//                 KES {tx.amount.toLocaleString()}
//               </td>
//               <td className="px-4 py-3">
//                 <StatusBadge status={tx.status} />
//               </td>
//               <td className="px-4 py-3 text-slate-500">
//                 {new Date(tx.transaction_date).toLocaleDateString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // Sub-component for Status logic
function StatusBadge({
  status,
}: {
  status: "pending" | "success" | "failed" | "cancelled";
}) {
  const styles = {
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// import { useTransactions } from "@/hooks/use-transactions";
import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";

export function TransactionManager() {
  const { transactions, pagination, search, isLoading } = useTransactions(20);

  return (
    <div className="space-y-4">
      {/* 1. Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search all fields..."
          className="w-full md:w-72 p-2 border rounded-lg text-sm"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
        />

        <div className="flex items-center gap-2 text-sm">
          <span>Show:</span>
          <select
            value={pagination.limit}
            onChange={(e) => pagination.setLimit(Number(e.target.value))}
            className="border rounded p-1"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* 2. Desktop Table / Mobile Cards */}
      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            Loading...
          </div>
        )}

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">
                    {tx.mpesa_receipt_number || "---"}
                  </td>
                  <td className="px-4 py-3">{tx.paying_number}</td>
                  <td className="px-4 py-3 font-bold">KES {tx.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-slate-500">
                  {tx.mpesa_receipt_number}
                </span>
                <StatusBadge status={tx.status} />
              </div>
              <div className="font-bold">KES {tx.amount}</div>
              <div className="text-sm text-slate-600">{tx.paying_number}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <button
          disabled={pagination.page === 1}
          onClick={() => pagination.setPage((p) => p - 1)}
          className="px-4 py-2 text-sm border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => pagination.setPage((p) => p + 1)}
          className="px-4 py-2 text-sm border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

