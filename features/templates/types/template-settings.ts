import { z } from "zod";

export const LayerTimingSchema = z
  .object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
  })
  .nullable()
  .default(null);

export const TextLayerSchema = z.object({
  id: z.string(),
  text: z.string().default(""),
  x: z.number(),
  y: z.number(),
  width: z.number().min(0.05).max(1),
  rotation: z.number().default(0),
  fontFamily: z
    .string()
    .default("'Microsoft JhengHei', '微軟正黑體', sans-serif"),
  fontSize: z.number().min(0.01).max(0.5),
  fontWeight: z
    .union([z.literal("normal"), z.literal("bold"), z.number()])
    .default("bold"),
  fontStyle: z.enum(["normal", "italic"]).default("normal"),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
  color: z.string().default("#ffffff"),
  stroke: z
    .object({ color: z.string(), width: z.number().min(0) })
    .nullable()
    .default({ color: "#000000", width: 0.004 }),
  background: z.string().nullable().default(null),
  opacity: z.number().min(0).max(1).default(1),
  timing: LayerTimingSchema,
});

export const CanvasPaddingSchema = z.object({
  top: z.number().min(0).max(2).default(0),
  bottom: z.number().min(0).max(2).default(0),
  color: z.string().default("#ffffff"),
});

export const TrimRangeSchema = z
  .object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
  })
  .nullable()
  .default(null);

export const TemplateSettingsSchema = z.object({
  version: z.literal(1).default(1),
  canvas: z.object({ width: z.number(), height: z.number() }).optional(),
  padding: CanvasPaddingSchema.default({ top: 0, bottom: 0, color: "#ffffff" }),
  trim: TrimRangeSchema,
  textLayers: z.array(TextLayerSchema).default([]),
});

export type LayerTiming = z.infer<typeof LayerTimingSchema>;
export type TextLayer = z.infer<typeof TextLayerSchema>;
export type CanvasPadding = z.infer<typeof CanvasPaddingSchema>;
export type TrimRange = z.infer<typeof TrimRangeSchema>;
export type TemplateSettings = z.infer<typeof TemplateSettingsSchema>;
