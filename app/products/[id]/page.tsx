"use client";

import { useEffect, useState } from "react";
import ProductForm, { Product } from "@/app/components/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [params.id]);

  const handleUpdate = async (updated: Product) => {
    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    });
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <section className="p-4">
      <h1 className="text-xl mb-4">Edit Product</h1>
      <ProductForm initialProduct={product} onSubmit={handleUpdate} />
    </section>
  );
}

