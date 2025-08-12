"use client";

import { useState } from "react";

export type Product = {
  id?: string;
  name?: string;
  features?: string[];
  categories?: string[];
  tags?: string[];
  media?: string[];
};

export default function ProductForm({
  initialProduct = {},
  onSubmit,
}: {
  initialProduct?: Product;
  onSubmit: (data: Product) => void;
}) {
  const [name, setName] = useState(initialProduct.name || "");
  const [featureText, setFeatureText] = useState(
    (initialProduct.features || []).join(", ")
  );
  const [categoryText, setCategoryText] = useState(
    (initialProduct.categories || []).join(", ")
  );
  const [tagText, setTagText] = useState(
    (initialProduct.tags || []).join(", ")
  );
  const [media, setMedia] = useState<string[]>(initialProduct.media || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const features = featureText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const categories = categoryText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload: Product = {
      ...initialProduct,
      name,
      features,
      categories,
      tags,
      media: media.length ? media : [],
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2"
      />
      <input
        value={featureText}
        onChange={(e) => setFeatureText(e.target.value)}
        placeholder="Features (comma separated)"
        className="border p-2"
      />
      <input
        value={categoryText}
        onChange={(e) => setCategoryText(e.target.value)}
        placeholder="Categories (comma separated)"
        className="border p-2"
      />
      <input
        value={tagText}
        onChange={(e) => setTagText(e.target.value)}
        placeholder="Tags (comma separated)"
        className="border p-2"
      />
      {/* In a full app a media uploader would update state here */}
      <button type="submit" className="bg-blue-600 text-white p-2">
        Save Product
      </button>
    </form>
  );
}

