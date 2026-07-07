const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const TENANT_ID = "tenant-demo-uuid";

async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": TENANT_ID,
        ...options?.headers,
      },
      cache: "no-store",
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`API call failed: ${BACKEND_URL}${path}`, error);
    return null;
  }
}

// ============================================================================
// DASHBOARD
// ============================================================================
export async function fetchDashboardData() {
  return apiFetch("/dashboard");
}

// ============================================================================
// LEADS
// ============================================================================
export async function fetchLeads() {
  return apiFetch("/leads");
}

export async function updateLeadStatus(leadId: string, status: string) {
  return apiFetch(`/leads/${leadId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ============================================================================
// PROJECTS & TASKS
// ============================================================================
export async function fetchProjects() {
  return apiFetch("/projects");
}

export async function toggleTask(taskId: string) {
  return apiFetch(`/projects/tasks/${taskId}/toggle`, {
    method: "PATCH",
  });
}

// ============================================================================
// QUOTATIONS
// ============================================================================
export async function fetchQuotations() {
  return apiFetch("/quotations");
}

export async function toggleQuoteItem(itemId: string) {
  return apiFetch(`/quotation-items/${itemId}/toggle`, {
    method: "PATCH",
  });
}

export async function addQuoteItem(item: {
  quotation_id: string;
  category: string;
  title: string;
  vendor_name: string;
  price: number;
  is_optional?: boolean;
  is_selected?: boolean;
}) {
  return apiFetch("/quotation-items", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function lockQuotation(id: string) {
  return apiFetch(`/quotations/${id}/lock`, { method: "POST" });
}

export async function exportQuotation(id: string) {
  return apiFetch(`/quotations/${id}/export`);
}

export async function sendQuotationWa(id: string) {
  return apiFetch(`/quotations/${id}/send-wa`, { method: "POST" });
}

// ============================================================================
// RUNDOWN
// ============================================================================
export async function fetchRundownItems(projectId = "proj-1") {
  return apiFetch(`/rundown-items?project_id=${projectId}`);
}

export async function addRundownItem(item: {
  project_id: string;
  time_slot: string;
  duration_minutes: number;
  activity_title: string;
  division_pic: string;
  notes?: string;
}) {
  return apiFetch("/rundown-items", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

// ============================================================================
// CHAT
// ============================================================================
export async function fetchMessages(projectId = "proj-1") {
  return apiFetch(`/messages?project_id=${projectId}`);
}

export async function sendMessage(msg: {
  project_id: string;
  channel: string;
  sender_name: string;
  sender_role: string;
  text: string;
}) {
  return apiFetch("/messages", {
    method: "POST",
    body: JSON.stringify(msg),
  });
}

// ============================================================================
// INVENTORY
// ============================================================================
export async function fetchInventoryItems() {
  return apiFetch("/inventory-items");
}

// ============================================================================
// STAFF
// ============================================================================
export async function fetchStaffCrews() {
  return apiFetch("/staff-crews");
}

// ============================================================================
// MARKETPLACE
// ============================================================================
export async function searchVendorsMeilisearch(query: string, category = "All") {
  return apiFetch(`/marketplace/vendors?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
}

// ============================================================================
// AI & INNOVATION
// ============================================================================
export async function askAiCopilotFromBackend(prompt: string, contextData: any = {}) {
  return apiFetch("/ai/copilot", {
    method: "POST",
    body: JSON.stringify({ prompt, context: contextData }),
  });
}

export async function triggerEscrowLock(projectId: string, totalPayment = 90000000) {
  return apiFetch("/innovations/escrow/lock", {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, total_payment: totalPayment }),
  });
}

export async function triggerEscrowRelease(escrowAccountId: string) {
  return apiFetch("/innovations/escrow/release", {
    method: "POST",
    body: JSON.stringify({ escrow_account_id: escrowAccountId }),
  });
}

export async function evaluateSurgeAndWeather(eventDate = "2026-08-14", venueType = "Outdoor Garden Poolside") {
  return apiFetch("/innovations/surge-pricing/evaluate", {
    method: "POST",
    body: JSON.stringify({ event_date: eventDate, venue_type: venueType }),
  });
}
