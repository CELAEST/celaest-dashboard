import { api } from "@/lib/api-client";
import { TaskResponse, ErrorAnalyticsResponse } from "./types";

export const errorsApi = {
  async getFailedTasks(
    token: string,
    orgId: string,
    page = 1,
    limit = 50,
    status = "failed"
  ): Promise<TaskResponse> {
    return api.get<TaskResponse>("/api/v1/org/ai/tasks", {
      params: {
        page: String(page),
        limit: String(limit),
        status,
      },
      token,
      orgId,
    });
  },

  async updateTaskStatus(
    token: string,
    orgId: string,
    taskId: string,
    status: string
  ): Promise<{ success: boolean; message: string }> {
    return api.patch<{ success: boolean; message: string }>(
      `/api/v1/org/ai/tasks/${taskId}/status`,
      { status },
      { token, orgId }
    );
  },

  async getErrorStats(
    token: string,
    orgId: string
  ): Promise<ErrorAnalyticsResponse> {
    return api.get<ErrorAnalyticsResponse>("/api/v1/org/analytics/tasks", {
      token,
      orgId,
    });
  },
};
