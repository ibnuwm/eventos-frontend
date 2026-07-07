/**
 * API Client Utility - Hubungan Next.js 15 Frontend ke Laravel 12 Backend API
 * URL Dasar: http://localhost:8000/api/v1
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchDashboardData(tenantId = "tenant-demo-uuid") {
  try {
    const res = await fetch(`${BACKEND_URL}/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard from Laravel API");
    return await res.json();
  } catch (error) {
    console.warn("Using local context data. Backend API reachable at:", BACKEND_URL);
    return null;
  }
}

export async function askAiCopilotFromBackend(prompt: string, contextData: any = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}/ai/copilot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, context: contextData }),
    });
    if (!res.ok) throw new Error("AI Service request failed");
    return await res.json();
  } catch (error) {
    console.warn("AI fallback local simulation activated.");
    return null;
  }
}

export async function searchVendorsMeilisearch(query: string, category = "All") {
  try {
    const res = await fetch(`${BACKEND_URL}/marketplace/vendors?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Meilisearch query failed");
    return await res.json();
  } catch (error) {
    return null;
  }
}

// ============================================================================
// CATEGORY KING INNOVATIONS API CLIENT METHODS
// ============================================================================

export async function triggerEscrowLock(projectId: string, totalPayment = 90000000) {
  try {
    const res = await fetch(`${BACKEND_URL}/innovations/escrow/lock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, total_payment: totalPayment }),
    });
    return await res.json();
  } catch (err) {
    return { status: "fallback_simulated", success: true };
  }
}

export async function triggerEscrowRelease(escrowAccountId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/innovations/escrow/release`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ escrow_account_id: escrowAccountId }),
    });
    return await res.json();
  } catch (err) {
    return { status: "fallback_simulated", success: true };
  }
}

export async function evaluateSurgeAndWeather(eventDate = "2026-08-14", venueType = "Outdoor Garden Poolside") {
  try {
    const res = await fetch(`${BACKEND_URL}/innovations/surge-pricing/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_date: eventDate, venue_type: venueType }),
    });
    return await res.json();
  } catch (err) {
    return { status: "fallback_simulated", success: true };
  }
}
