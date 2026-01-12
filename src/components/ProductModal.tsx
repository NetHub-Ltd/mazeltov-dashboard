// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { Product, ProductSchema } from "@/types/product";
// import { Product, ProductSchema } from "@/lib/schemas/zodschemas";

// export default function ProductModal({
//   product,
//   onClose,
//   onSave,
// }: {
//   product: Product | null;
//   onClose: () => void;
//   onSave: (data: Product) => void;
// }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Product>({
//     resolver: zodResolver(ProductSchema),
//     defaultValues: product || {
//       label: "",
//       price: 0,
//       validity: "",
//       category: "data",
//       description: "",
//       tag: null,
//     },
//   });

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
//         <h2 className="text-xl font-bold mb-4">
//           {product ? "Edit Plan" : "Add New Plan"}
//         </h2>
//         <form onSubmit={handleSubmit(onSave)} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-bold uppercase text-gray-500">
//                 Label
//               </label>
//               <input
//                 {...register("label")}
//                 className="w-full border rounded p-2"
//                 placeholder="e.g. 1GB"
//               />
//               {errors.label && (
//                 <span className="text-red-500 text-xs">
//                   {errors.label.message}
//                 </span>
//               )}
//             </div>
//             <div>
//               <label className="text-xs font-bold uppercase text-gray-500">
//                 Price
//               </label>
//               <input
//                 {...register("price", { valueAsNumber: true })}
//                 type="number"
//                 className="w-full border rounded p-2"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-bold uppercase text-gray-500">
//               Category
//             </label>
//             <select
//               {...register("category")}
//               className="w-full border rounded p-2 bg-white"
//             >
//               <option value="data">Data</option>
//               <option value="minutes">Minutes</option>
//               <option value="sms">SMS</option>
//               <option value="minutesPlusData">Minutes + Data</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-bold uppercase text-gray-500">
//               Validity
//             </label>
//             <input
//               {...register("validity")}
//               className="w-full border rounded p-2"
//               placeholder="e.g. 24HRS"
//             />
//           </div>

//           {/* tag and description */}
//           <div className="flex flex-col gap-4">
//             <div>
//               <label className="text-xs font-bold uppercase text-gray-500">
//                 Description
//               </label>
//               <textarea
//                 {...register("description")}
//                 className="w-full border rounded p-2"
//                 rows={2}
//               />
//             </div>

//             {/* <div>
//               <label className="text-xs font-bold uppercase text-gray-500">
//                 Tag
//               </label>
//               <input
//                 {...register("tag")}
//                 className="w-full border rounded p-2"
//                 placeholder="e.g. 24HRS"
//               />
//             </div> */}
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, ProductSchema } from "@/lib/schemas/zodschemas";
import { X, Save, Package } from "lucide-react";

export default function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Product) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: product || {
      label: "",
      price: 0,
      validity: "",
      category: "data",
      description: "",
      tag: "",
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Animated Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {product ? "Edit Plan Details" : "Create New Plan"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Mazeltov Bingwa Inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Label Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                Plan Label
              </label>
              <input
                {...register("label")}
                className={`w-full bg-background border ${
                  errors.label ? "border-destructive" : "border-border"
                } rounded-xl px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                placeholder="e.g. 1GB Ultra"
              />
              {errors.label && (
                <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                  {errors.label.message}
                </p>
              )}
            </div>

            {/* Price Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                Price (KES)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60">
                  KES
                </span>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 text-sm font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                Service Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="data text-foreground">Data Bundles</option>
                <option value="minutes">Voice Minutes</option>
                <option value="sms">SMS Packages</option>
                <option value="minutesPlusData">Hybrid Plan</option>
              </select>
            </div>

            {/* Validity Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                Validity Period
              </label>
              <input
                {...register("validity")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. 24HRS or 30 DAYS"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
              Internal Description
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              rows={3}
              placeholder="Detailed notes about this offer..."
            />
          </div>

          {/* Tag Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
              Badge / Promo Tag (Optional)
            </label>
            <input
              {...register("tag")}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="e.g. HOT DEAL, NEW"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Save size={18} />
              {product ? "Update Plan" : "Confirm & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
