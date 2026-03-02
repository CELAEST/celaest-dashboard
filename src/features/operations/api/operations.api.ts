import { z } from "zod";
import { api } from "@/lib/api-client";
import { TelemetryData, TelemetryDataSchema } from "./schemas";

export const operationsApi = {
  getTelemetry: async (token: string, orgId: string, period: string = "1h") => {
    return api.get<TelemetryData>("/api/v1/org/telemetry", {
      token,
      orgId,
      params: { period },
      schema: TelemetryDataSchema as unknown as z.ZodType<TelemetryData>,
    });
  },
};
