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
    if (!res.ok) {
      const errBody = await res.text();
      try {
        return JSON.parse(errBody);
      } catch {
        return null;
      }
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed: ${BACKEND_URL}${path}`, error);
    return null;
  }
}

// Public fetch (no tenant header)
async function publicFetch<T = any>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      cache: "no-store",
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ============================================================================
// DASHBOARD
// ============================================================================
export async function fetchDashboardData() { return apiFetch("/dashboard"); }

// ============================================================================
// LEADS
// ============================================================================
export async function fetchLeads() { return apiFetch("/leads"); }
export async function updateLeadStatus(leadId: string, status: string) {
  return apiFetch(`/leads/${leadId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

// ============================================================================
// PROJECTS & TASKS
// ============================================================================
export async function fetchProjects() { return apiFetch("/projects"); }
export async function toggleTask(taskId: string) {
  return apiFetch(`/projects/tasks/${taskId}/toggle`, { method: "PATCH" });
}

// ============================================================================
// QUOTATIONS
// ============================================================================
export async function fetchQuotations() { return apiFetch("/quotations"); }
export async function toggleQuoteItem(itemId: string) {
  return apiFetch(`/quotation-items/${itemId}/toggle`, { method: "PATCH" });
}
export async function addQuoteItem(item: any) {
  return apiFetch("/quotation-items", { method: "POST", body: JSON.stringify(item) });
}
export async function lockQuotation(id: string) { return apiFetch(`/quotations/${id}/lock`, { method: "POST" }); }
export async function exportQuotation(id: string) { return apiFetch(`/quotations/${id}/export`); }
export async function sendQuotationWa(id: string) {
  return apiFetch(`/quotations/${id}/send-wa`, { method: "POST" });
}

// ============================================================================
// RUNDOWN
// ============================================================================
export async function fetchRundownItems(projectId = "proj-1") {
  return apiFetch(`/rundown-items?project_id=${projectId}`);
}
export async function addRundownItem(item: any) {
  return apiFetch("/rundown-items", { method: "POST", body: JSON.stringify(item) });
}

// ============================================================================
// CHAT
// ============================================================================
export async function fetchMessages(projectId = "proj-1") {
  return apiFetch(`/messages?project_id=${projectId}`);
}
export async function sendMessage(msg: any) {
  return apiFetch("/messages", { method: "POST", body: JSON.stringify(msg) });
}

// ============================================================================
// INVENTORY
// ============================================================================
export async function fetchInventoryItems() { return apiFetch("/inventory-items"); }

// ============================================================================
// STAFF
// ============================================================================
export async function fetchStaffCrews() { return apiFetch("/staff-crews"); }

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
  return apiFetch("/ai/copilot", { method: "POST", body: JSON.stringify({ prompt, context: contextData }) });
}
export async function triggerEscrowLock(projectId: string, totalPayment = 90000000) {
  return apiFetch("/innovations/escrow/lock", { method: "POST", body: JSON.stringify({ project_id: projectId, total_payment: totalPayment }) });
}
export async function triggerEscrowRelease(escrowAccountId: string) {
  return apiFetch("/innovations/escrow/release", { method: "POST", body: JSON.stringify({ escrow_account_id: escrowAccountId }) });
}
export async function evaluateSurgeAndWeather(eventDate = "2026-08-14", venueType = "Outdoor Garden Poolside") {
  return apiFetch("/innovations/surge-pricing/evaluate", { method: "POST", body: JSON.stringify({ event_date: eventDate, venue_type: venueType }) });
}

// ============================================================================
// CLIENT PORTAL TOKEN-BASED
// ============================================================================
export async function generatePortalLink(params: any) {
  return apiFetch("/client-portal/generate-link", { method: "POST", body: JSON.stringify(params) });
}
export async function verifyPortalToken(token: string) { return apiFetch(`/client-portal/token/${token}/verify`); }
export async function approvePortalDocument(token: string, documentType: string, clientSignature: string, grandTotal?: number) {
  return apiFetch(`/client-portal/token/${token}/approve`, { method: "POST", body: JSON.stringify({ document_type: documentType, client_signature: clientSignature, grand_total: grandTotal }) });
}

// ============================================================================
// STOREFRONT (Public)
// ============================================================================
export async function fetchStorefrontVendors(query = "", category = "All") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category !== "All") params.set("category", category);
  return apiFetch(`/storefront/vendors${params.toString() ? "?" + params.toString() : ""}`);
}
export async function fetchStorefrontVendor(id: string) { return apiFetch(`/storefront/vendors/${id}`); }

// ============================================================================
// TENANT INFO
// ============================================================================
export async function fetchTenantInfo() { return apiFetch("/tenant"); }

// ============================================================================
// PAYMENT GATEWAY (#2)
// ============================================================================
export async function createInvoicePayment(invoiceId: string, paymentMethod = "QRIS") {
  return apiFetch("/payments/invoice", { method: "POST", body: JSON.stringify({ invoice_id: invoiceId, payment_method: paymentMethod }) });
}
export async function simulatePayment(transactionId: string) {
  return apiFetch("/payments/simulate", { method: "POST", body: JSON.stringify({ transaction_id: transactionId }) });
}
export async function getPaymentStatus(invoiceId: string) { return apiFetch(`/payments/invoice/${invoiceId}`); }

// ============================================================================
// GUEST RSVP (#3)
// ============================================================================
export async function fetchGuests(projectId = "proj-1") { return apiFetch(`/guests?project_id=${projectId}`); }
export async function addGuest(data: any) {
  return apiFetch("/guests", { method: "POST", body: JSON.stringify(data) });
}
export async function rsvpVerify(token: string) { return apiFetch(`/rsvp/${token}`); }
export async function rsvpConfirm(token: string, data: any) {
  return apiFetch(`/rsvp/${token}`, { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// TICKETING (#5)
// ============================================================================
export async function fetchEvents() { return apiFetch("/events"); }
export async function fetchEvent(eventId: string) { return apiFetch(`/events/${eventId}`); }
export async function createTicketOrder(data: any) {
  return apiFetch("/tickets/order", { method: "POST", body: JSON.stringify(data) });
}
export async function verifyTicket(qrToken: string) { return apiFetch(`/tickets/verify/${qrToken}`); }
export async function checkinTicket(qrToken: string) {
  return apiFetch(`/tickets/checkin/${qrToken}`, { method: "POST" });
}

// ============================================================================
// VENDOR SELF-SERVICE (#6)
// ============================================================================
export async function vendorLogin(whatsapp: string, name: string) {
  return apiFetch("/vendor/login", { method: "POST", body: JSON.stringify({ whatsapp, name }) });
}
export async function vendorDashboard(vendorId: string) {
  return apiFetch(`/vendor/dashboard?vendor_id=${vendorId}`);
}

// ============================================================================
// PHASE 1: BLOG CMS
// ============================================================================
export async function fetchBlogPosts() { return publicFetch("/blog"); }
export async function fetchBlogPost(slug: string) { return publicFetch(`/blog/${slug}`); }

// ============================================================================
// PHASE 1: MIDTRANS PAYMENT
// ============================================================================
export async function createMidtransTransaction(invoiceId: string, paymentMethod: string) {
  return apiFetch("/midtrans/charge", { method: "POST", body: JSON.stringify({ invoice_id: invoiceId, payment_method: paymentMethod }) });
}
export async function getMidtransStatus(transactionId: string) { return apiFetch(`/midtrans/status/${transactionId}`); }

// ============================================================================
// PHASE 1: VENDOR ANALYTICS
// ============================================================================
export async function trackVendorView(vendorId: string, ip?: string, referrer?: string, city?: string) {
  return apiFetch("/vendor-analytics/track-view", { method: "POST", body: JSON.stringify({ vendor_id: vendorId, ip_address: ip, referrer, city }) });
}
export async function getVendorStats(vendorId: string) { return apiFetch(`/vendor-analytics/stats/${vendorId}`); }
export async function createStorefrontLead(data: any) {
  return apiFetch("/vendor-analytics/lead", { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// PHASE 2: WISHLIST & INSPIRATION
// ============================================================================
function getSessionId(): string {
  if (typeof window !== "undefined") {
    let sid = sessionStorage.getItem("eventos_session_id");
    if (!sid) { sid = "sess_" + Math.random().toString(36).substring(2, 15); sessionStorage.setItem("eventos_session_id", sid); }
    return sid;
  }
  return "anon";
}
export async function toggleWishlist(vendorId: string) {
  return apiFetch("/wishlist/toggle", { method: "POST", body: JSON.stringify({ session_id: getSessionId(), vendor_id: vendorId }) });
}
export async function getWishlist() { return apiFetch(`/wishlist/session/${getSessionId()}`); }
export async function getInspirationBoards() { return apiFetch(`/inspiration-boards?session_id=${getSessionId()}`); }
export async function createInspirationBoard(title: string) {
  return apiFetch("/inspiration-boards", { method: "POST", body: JSON.stringify({ session_id: getSessionId(), title }) });
}
export async function addInspirationItem(boardId: string, vendorId: string, imageUrl?: string, note?: string) {
  return apiFetch(`/inspiration-boards/${boardId}/items`, { method: "POST", body: JSON.stringify({ vendor_id: vendorId, image_url: imageUrl, note }) });
}

// ============================================================================
// PHASE 2: REVIEWS
// ============================================================================
export async function fetchVendorReviews(vendorId: string) { return publicFetch(`/reviews/${vendorId}`); }
export async function getReviewAverage(vendorId: string) { return publicFetch(`/reviews/${vendorId}/average`); }
export async function submitReview(data: any) {
  return apiFetch("/reviews", { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// PHASE 2: VIRTUAL EXPO
// ============================================================================
export async function fetchVirtualExpos(status?: string) {
  const params = status ? `?status=${status}` : "";
  return publicFetch(`/virtual-expos${params}`);
}
export async function fetchVirtualExpo(id: string) { return publicFetch(`/virtual-expos/${id}`); }
export async function registerExpoBooth(data: any) {
  return apiFetch("/virtual-expos/booths", { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// PHASE 3: FORUM
// ============================================================================
export async function fetchForumTopics(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category && category !== "semua") params.set("category", category);
  if (search) params.set("search", search);
  return publicFetch(`/forum/topics${params.toString() ? "?" + params.toString() : ""}`);
}
export async function fetchForumTopic(id: string) { return publicFetch(`/forum/topics/${id}`); }
export async function createForumTopic(data: any) {
  return apiFetch("/forum/topics", { method: "POST", body: JSON.stringify(data) });
}
export async function replyToTopic(topicId: string, data: any) {
  return apiFetch(`/forum/topics/${topicId}/replies`, { method: "POST", body: JSON.stringify(data) });
}
export async function fetchForumCategories() { return publicFetch("/forum/categories"); }

// ============================================================================
// PHASE 3: UGC GALLERY
// ============================================================================
export async function fetchUgcGallery(vendorId?: string) {
  const path = vendorId ? `/ugc-gallery/vendor/${vendorId}` : "/ugc-gallery";
  return publicFetch(path);
}
export async function submitUgcPhoto(data: any) {
  return apiFetch("/ugc-gallery", { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// PHASE 3: TENANT REGISTRATION
// ============================================================================
export async function registerTenant(data: any) {
  return publicFetch("/tenant/register", { method: "POST", body: JSON.stringify(data) });
}

// ============================================================================
// PHASE 4: PREMIUM PROFILES
// ============================================================================
export async function fetchFeaturedVendors() { return publicFetch("/premium-profiles/featured"); }
export async function getVendorBadge(vendorId: string) { return publicFetch(`/premium-profiles/vendor/${vendorId}/badge`); }

// ============================================================================
// PHASE 4: SPONSORED CONTENT
// ============================================================================
export async function fetchSponsoredContent() { return publicFetch("/sponsored-content"); }

// ============================================================================
// PHASE 4: API KEYS
// ============================================================================
export async function fetchApiKeys() { return apiFetch("/api-keys"); }
export async function generateApiKey(name: string, permissions: string[]) {
  return apiFetch("/api-keys", { method: "POST", body: JSON.stringify({ name, permissions }) });
}
export async function revokeApiKey(id: string) {
  return apiFetch(`/api-keys/${id}/revoke`, { method: "POST" });
}

// ============================================================================
// PHASE 4: AD CAMPAIGNS
// ============================================================================
export async function fetchAdCampaigns(vendorId: string) { return apiFetch(`/ad-campaigns/${vendorId}`); }
export async function createAdCampaign(data: any) {
  return apiFetch("/ad-campaigns", { method: "POST", body: JSON.stringify(data) });
}
export async function recordAdImpression(campaignId: string) {
  return apiFetch(`/ad-campaigns/${campaignId}/impression`, { method: "POST" });
}
export async function recordAdClick(campaignId: string) {
  return apiFetch(`/ad-campaigns/${campaignId}/click`, { method: "POST" });
}
