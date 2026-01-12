"use client";

import { useState, useEffect } from "react";

// Define the interface based on your API's validated output
interface AnalyticsData {
  sales: {
    total_sales: number;
    total_amount: number;
  } | null;
  analytics: {
    success: boolean;
    data: Array<{
      id: number;
      label: string;
      price: number;
      validity: string;
      category: string;
      tag: string;
    }>;
  } | null;
  fetchedAt: string;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use AbortController to prevent memory leaks on unmount
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/analytics", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch analytics");

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, []);

  return {
    salesSummary: data?.sales,
    popularOffers: data?.analytics?.data || [],
    isLoading,
    error,
    fetchedAt: data?.fetchedAt,
  };
}
