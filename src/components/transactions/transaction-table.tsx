"use client";

import { useTransactions } from "@/lib/hooks/useTransactions";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react"; // npm install lucide-react

function StatusBadge({
  status,
}: {
  status: "pending" | "success" | "failed" | "cancelled";
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
    cancelled: "bg-slate-50 text-slate-700 ring-slate-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === "success" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-rose-500"}`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function TransactionManager() {
  const {
    transactions,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    totalLoaded,
    isLoading,
  } = useTransactions(20);

  return (
    <div className="flex flex-col gap-5 p-1">
      {/* 1. Enhanced Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            placeholder="Search by receipt, phone, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-xl border-0 py-2 pl-3 pr-10 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 transition-all bg-white"
          >
            {[20, 50, 100].map((val) => (
              <option key={val} value={val}>
                Show {val}
              </option>
            ))}
          </select>
          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm leading-6">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Transaction Details
                </th>
                <th className="px-6 py-4 text-left font-semibold">Payer</th>
                <th className="px-6 py-4 text-left font-semibold">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group hover:bg-slate-50/80 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-[13px] font-semibold text-indigo-600">
                        {tx.mpesa_receipt_number || "PENDING"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                        ID: {tx.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">
                        {tx.paying_number}
                      </div>
                      <div className="text-xs text-slate-500">
                        M-Pesa Express
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <span className="text-[11px] font-normal text-slate-400 mr-1">
                        KES
                      </span>
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-5 active:bg-slate-50 transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm font-bold text-indigo-600">
                  {tx.mpesa_receipt_number || "---"}
                </span>
                <StatusBadge status={tx.status} />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {tx.paying_number}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-tighter">
                    M-Pesa Payment
                  </div>
                </div>
                <div className="text-right font-black text-slate-900">
                  <span className="text-[10px] font-medium text-slate-400 mr-1">
                    KES
                  </span>
                  {tx.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Refined Pagination */}
      <div className="flex items-center justify-between px-2 py-3 border-t border-slate-100">
        <div className="hidden sm:flex flex-1 justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{transactions.length}</span>{" "}
            of <span className="font-semibold">{totalLoaded}</span> records
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end gap-3">
          {/* Pagination buttons are removed as they are not supported by the new hook implementation */}
        </div>
      </div>
    </div>
  );
}