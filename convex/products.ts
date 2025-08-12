import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function trimAndOmitEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  const entries = Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === "string") {
        value = value.trim();
      }
      return [key, value];
    })
    .filter(([_, value]) => value !== "" && value !== undefined && value !== null);
  return Object.fromEntries(entries);
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    media: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const doc = trimAndOmitEmpty({ ...args, media: args.media ?? [] });
    return await ctx.db.insert("products", doc);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    patch: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      media: v.optional(v.array(v.any())),
    }),
  },
  handler: async (ctx, args) => {
    const patch = trimAndOmitEmpty({ ...args.patch, media: args.patch.media ?? [] });
    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
