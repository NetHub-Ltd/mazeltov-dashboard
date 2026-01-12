"use client";

import React from "react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { TrendingUp, Package, DollarSign, ArrowUpRight } from "lucide-react";

const DashboardHome = () => {
  const { salesSummary, popularOffers, isLoading, error } = useAnalytics();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl bg-destructive/10 p-6 text-destructive">
          <p className="font-semibold">System Error</p>
          <p className="text-sm opacity-80">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
          >
            Try Refreshing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Performance Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Analytics for{" "}
          <span className="text-primary font-medium">Mazeltov</span> sales and
          offer engagement.
        </p>
      </header>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sales Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Sales
            </p>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tighter text-foreground">
              {salesSummary?.total_sales ?? 0}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              Units Sold
            </span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Gross Revenue
            </p>
            <div className="rounded-full bg-chart-2/10 p-2 text-chart-2">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tighter text-foreground">
              KES {(salesSummary?.total_amount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Popular Offers Table */}
      <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="font-bold text-foreground">Popular Offers</h2>
          </div>
          <button className="text-xs font-semibold text-primary hover:underline">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-4 font-bold">Offer Details</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Validity</th>
                <th className="px-6 py-4 font-bold text-right">Pricing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {popularOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {offer.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      ID: #{offer.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                      {offer.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {offer.validity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-foreground">
                      {offer.price.toLocaleString()}
                    </span>
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      KES
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

/* 2. Skeleton Loading Component */
const DashboardSkeleton = () => (
  <div className="p-6 space-y-8 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-64 bg-muted rounded-lg" />
      <div className="h-4 w-48 bg-muted/60 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-32 bg-muted rounded-2xl" />
      <div className="h-32 bg-muted rounded-2xl" />
    </div>
    <div className="h-96 bg-muted/40 rounded-2xl border border-border" />
  </div>
);

export default DashboardHome;
