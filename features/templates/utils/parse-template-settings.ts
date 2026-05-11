import {
  TemplateSettingsSchema,
  type TemplateSettings,
} from "@/features/templates/types/template-settings";

const EMPTY_SETTINGS: TemplateSettings = {
  version: 1,
  padding: { top: 0, bottom: 0, color: "#ffffff" },
  trim: null,
  textLayers: [],
};

export function parseTemplateSettings(value: unknown): TemplateSettings {
  if (value == null) return EMPTY_SETTINGS;

  const candidate =
    typeof value === "string"
      ? safeJsonParse(value)
      : (value as Record<string, unknown>);

  if (!candidate || typeof candidate !== "object") return EMPTY_SETTINGS;

  const result = TemplateSettingsSchema.safeParse(candidate);
  if (!result.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[parseTemplateSettings] invalid settings, falling back to empty",
        result.error.flatten(),
      );
    }
    return EMPTY_SETTINGS;
  }
  return result.data;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
