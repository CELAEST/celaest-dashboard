/**
 * AI feature page
 *
 * This page is served at /ai. The actual AI functionality lives in the
 * DashboardShell via the "ai" tab. This route exists to provide a proper
 * URL entrypoint and to prevent Next.js from serving a 404 for the /ai path.
 */

import { redirect } from "next/navigation";

export default function AIPage() {
  // The AI tab is rendered inside the DashboardShell — redirect to the root
  // dashboard and let the shell handle tab selection via the URL hash or
  // the default active tab logic.
  redirect("/");
}
