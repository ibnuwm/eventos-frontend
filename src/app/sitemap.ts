import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eventos.id";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/landing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/storefront`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/forum`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${baseUrl}/expo`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/inspiration`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/ai-consultant`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const cities = [
    "jakarta", "bandung", "surabaya", "bali", "yogyakarta",
    "semarang", "makassar", "medan", "palembang", "batam",
    "bekasi", "tangerang", "depok", "bogor", "malang",
  ];

  const cityRoutes = cities.map((city) => ({
    url: `${baseUrl}/seo/cities/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...cityRoutes];
}
