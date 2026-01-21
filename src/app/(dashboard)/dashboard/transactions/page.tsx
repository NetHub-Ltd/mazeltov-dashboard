import { Metadata } from "next";
import { TransactionManager } from "@/components/transactions/transaction-table";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Transactions | Dashboard",
  description: "View and manage your M-Pesa transactions.",
};

export default function TransactionsPage() {
  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm">
            History of all processed mobile money payments.
          </p>
        </div>
        {/* You could add a 'Download CSV' or 'Filter' button here later */}
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200">
        <Suspense fallback={<TransactionTableSkeleton />}>
          {/* <TransactionTable /> */}
          <TransactionManager />
        </Suspense>
      </section>
    </main>
  );
}

/**
 * A simple skeleton to prevent layout shift during initial JS load
 */
function TransactionTableSkeleton() {
  return (
    <div className="w-full space-y-4 p-4 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-1/4" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-50 rounded" />
        ))}
      </div>
    </div>
  );
}
