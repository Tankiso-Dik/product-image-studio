"use client";

import ProductForm from "@/app/components/ProductForm";

export default function NewProductPage() {
  const handleCreate = async (product: any) => {
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  };

  return (
    <section className="p-4">
      <h1 className="text-xl mb-4">New Product</h1>
      <ProductForm onSubmit={handleCreate} />
    </section>
  );
}

