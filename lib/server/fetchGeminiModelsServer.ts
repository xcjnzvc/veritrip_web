import { createServerApi } from "./createServerApi";

type GeminiModelItem = {
  id?: string;
  modelId?: string;
  name?: string;
};

type GeminiModelResponse = {
  data?: unknown;
};

function pickModelId(item: unknown): string {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null) {
    const maybe = item as GeminiModelItem & { displayName?: string };
    return maybe.modelId ?? maybe.id ?? maybe.name ?? maybe.displayName ?? "";
  }
  return "";
}

function normalizeGeminiModelIds(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload.map(pickModelId).filter((v): v is string => v.trim().length > 0);
  }

  if (typeof payload === "object" && payload !== null) {
    const maybe = payload as {
      data?: unknown;
      models?: unknown;
      items?: unknown;
      result?: unknown;
    };
    return [
      ...normalizeGeminiModelIds(maybe.data),
      ...normalizeGeminiModelIds(maybe.models),
      ...normalizeGeminiModelIds(maybe.items),
      ...normalizeGeminiModelIds(maybe.result),
    ];
  }

  return [];
}

export async function fetchGeminiModelsServer(): Promise<string[]> {
  const api = await createServerApi();
  const response = await api.get<GeminiModelResponse>("/mgmt/gemini/model");
  const candidates = [
    ...normalizeGeminiModelIds(response.data),
    ...normalizeGeminiModelIds(response.data?.data),
  ];

  return Array.from(new Set(candidates));
}
