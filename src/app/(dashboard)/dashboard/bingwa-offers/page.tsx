"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  PackageSearch,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/schemas/zodschemas";
import ProductModal from "@/components/ProductModal";
import { useBingwaOffers } from "@/lib/hooks/use-bingwa-offers";

export default function ProductDashboard() {
  const {
    offers,
    isLoading,
    isError,
    createOffer,
    updateOffer,
    deleteOffer,
    isDeleting,
    isCreating,
  } = useBingwaOffers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: number) => {
    toast.warning("Confirm Deletion", {
      description: "This action cannot be undone. Delete this plan?",
      action: {
        label: "Delete",
        onClick: async () => {
          toast.promise(deleteOffer(id), {
            loading: "Removing plan...",
            success: "Plan purged successfully",
            error: (err) => `Failed to delete: ${err.message}`,
          });
        },
      },
    });
  };

  const handleSave = async (data: Product) => {
    const isEditing = !!editingProduct?.id;
    toast.promise(
      isEditing
        ? updateOffer({ ...data, id: editingProduct.id })
        : createOffer(data),
      {
        loading: isEditing ? "Updating record..." : "Provisioning plan...",
        success: () => {
          setIsModalOpen(false);
          setEditingProduct(null);
          return isEditing ? "Plan updated!" : "New plan live!";
        },
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <PackageSearch className="absolute text-primary/40" size={20} />
        </div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-tight">
          Synchronizing Bingwa Inventory...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 mt-10 max-w-xl mx-auto text-center border border-destructive/20 bg-destructive/5 rounded-2xl shadow-sm">
        <AlertCircle className="mx-auto text-destructive mb-4" size={32} />
        <h3 className="font-bold text-foreground text-lg italic">
          Connection Interrupted
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          We couldn't synchronize with the Bingwa API. Please check your
          network.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-destructive text-destructive-foreground px-6 py-2 rounded-xl hover:opacity-90 transition-all font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            Plan Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure and deploy{" "}
            <span className="text-primary font-semibold">Bingwa</span> service
            tiers.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          disabled={isCreating}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 font-bold text-sm tracking-tight"
        >
          {isCreating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}
          New Plan
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden border border-border bg-card rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                <th className="p-5">Offer Identity</th>
                <th className="p-5">Category</th>
                <th className="p-5">Pricing</th>
                <th className="p-5">Validity</th>
                <th className="p-5">Tagging</th>
                <th className="p-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {offers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-20 text-center text-muted-foreground italic"
                  >
                    No active plans found in this segment.
                  </td>
                </tr>
              ) : (
                offers.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-accent/30 transition-all group"
                  >
                    <td className="p-5">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {product.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        #{product.id}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-background border border-border rounded-lg text-[10px] font-bold uppercase text-muted-foreground shadow-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-primary text-base">
                          KES {product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                          Standard Rate
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-muted-foreground font-medium">
                      {product.validity}
                    </td>
                    <td className="p-5">
                      {product.tag ? (
                        <span className="bg-chart-4/10 text-chart-4 border border-chart-4/20 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter">
                          {product.tag}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 text-[10px] italic">
                          No Tag
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 hover:bg-primary/10 text-primary rounded-xl transition-colors"
                          title="Edit Plan"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => product.id && handleDelete(product.id)}
                          disabled={isDeleting}
                          className="p-2.5 hover:bg-destructive/10 text-destructive rounded-xl transition-colors disabled:opacity-20"
                          title="Delete Plan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
