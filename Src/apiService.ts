import { Business, Job, Article, User } from "./types";
import { INITIAL_BUSINESSES, INITIAL_JOBS } from "./mockData";

export class ApiService {
  private static STORAGE_PREFIX = "bihar_biz_";

  // Check connection to Custom Laravel Server
  static async pingCheck(baseUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/auth/check`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      return response.status === 200 || response.status === 401; // Reachable!
    } catch (e) {
      return false; // Not Reachable / Offline
    }
  }

  // Get Businesses
  static async getBusinesses(baseUrl: string, isLive: boolean): Promise<{ data: Business[]; source: "api" | "local" }> {
    if (isLive) {
      try {
        const response = await fetch(`${baseUrl}/businesses`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });
        if (response.ok) {
          const json = await response.json();
          // Assume response has key 'data' or is direct array
          const rawList = Array.isArray(json) ? json : (json.data || json.businesses || []);
          
          // Map response fields to standard structure if needed
          const businesses: Business[] = rawList.map((item: any, idx: number) => ({
            id: item.id?.toString() || `live-${idx}`,
            slug: item.slug || `slug-${idx}`,
            name: item.name || item.title || "Unnamed Shop",
            phone: item.phone || item.mobile || "N/A",
            whatsapp: item.whatsapp || item.phone || "N/A",
            email: item.email || "",
            website: item.website || "",
            plan: item.plan || item.app_plan?.type || "free",
            app_plan: item.app_plan || null,
            coverImage: item.coverImage || item.cover_image || "",
            galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
            menuCard: item.menuCard || item.menu_card || "",
            facebook: item.facebook || item.facebook_url || "",
            instagram: item.instagram || item.instagram_url || "",
            youtube: item.youtube || item.youtube_url || "",
            offers: item.offers || "",
            mapLink: item.mapLink || item.map_link || "",
            category: item.category || "other",
            city: item.city || "Patna",
            address: item.address || "Bihar, India",
            services: Array.isArray(item.services) ? item.services : (item.services ? item.services.split(",") : []),
            description: item.description || "No description provided.",
            imageUrl: item.image_url || item.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=500&auto=format&fit=crop",
            rating: Number(item.rating) || 4.2,
            reviewCount: Number(item.review_count || item.reviewCount) || 12,
            isVerified: !!(item.is_verified || item.isVerified || item.verified),
            isPremium: !!(item.is_premium || item.isPremium || item.featured || item.premium || ["premium","featured"].includes(item.plan || item.app_plan?.type)),
            openingHours: item.opening_hours || item.openingHours || "9:00 AM - 8:00 PM",
            status: item.status || "approved",
            reviews: item.reviews || []
          }));
          return { data: businesses, source: "api" };
        }
      } catch (e) {
        console.warn("Laravel server returned error for GET /businesses, using mock data", e);
      }
    }

    // Local / Offline fallback
    const key = `${this.STORAGE_PREFIX}businesses`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return { data: JSON.parse(stored), source: "local" };
    }
    // Set first run mock businesses
    localStorage.setItem(key, JSON.stringify(INITIAL_BUSINESSES));
    return { data: INITIAL_BUSINESSES, source: "local" };
  }

  // Get Jobs
  static async getJobs(baseUrl: string, isLive: boolean): Promise<{ data: Job[]; source: "api" | "local" }> {
    if (isLive) {
      try {
        const response = await fetch(`${baseUrl}/jobs`, {
          method: "GET",
          headers: { "Accept": "application/json" }
        });
        if (response.ok) {
          const json = await response.json();
          const rawJobs = Array.isArray(json) ? json : (json.data || json.jobs || []);
          const jobs: Job[] = rawJobs.map((item: any, idx: number) => ({
            id: item.id?.toString() || `live-job-${idx}`,
            title: item.title || "Job Opening",
            company: item.company || "Local Firm",
            city: item.city || "Patna",
            salary: item.salary || "Negociable",
            type: item.type || "Full-Time",
            description: item.description || "",
            contact: item.contact || "7217754368",
            experienceNeeded: item.experience || item.experienceNeeded || "Freshers"
          }));
          return { data: jobs, source: "api" };
        }
      } catch (e) {
        console.warn("Laravel server returned error for GET /jobs, using mock data", e);
      }
    }

    const key = `${this.STORAGE_PREFIX}jobs`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return { data: JSON.parse(stored), source: "local" };
    }
    localStorage.setItem(key, JSON.stringify(INITIAL_JOBS));
    return { data: INITIAL_JOBS, source: "local" };
  }

  // Register Business Store

  static async updateBusinessMedia(
    baseUrl: string,
    isLive: boolean,
    formData: FormData
  ): Promise<{ success: boolean; business?: any; message: string }> {
    if (isLive) {
      try {
        const response = await fetch(`${baseUrl}/business/media-update`, {
          method: "POST",
          //credentials: "include",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const json = await response.json();

        return {
          success: response.ok && json.success,
          business: json.business,
          message: json.message || "Social & images updated.",
        };
      } catch {
        return {
          success: false,
          message: "Server unreachable. Please try again.",
        };
      }
    }

    return {
      success: false,
      message: "Live API mode off hai.",
    };
  }


  static async updateBusinessFinal(
    baseUrl: string,
    isLive: boolean,
    formData: FormData
  ): Promise<{ success: boolean; business?: any; message: string }> {
    if (isLive) {
      try {
        const response = await fetch(`${baseUrl}/business/final-update`, {
          method: "POST",
          //credentials: "include",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const json = await response.json();
        return {
          success: response.ok && json.success,
          business: json.business,
          message: json.message || "Business profile completed.",
        };
      } catch {
        return { success: false, message: "Server unreachable. Please try again." };
      }
    }
    return { success: false, message: "Live API mode off hai." };
  }

  static async postBusinessStore(
    baseUrl: string, 
    isLive: boolean, 
    businessData: Partial<Business>
  ): Promise<{ success: boolean; data?: any; message: string }> {
    if (isLive) {
      try {
        const response = await fetch(`${baseUrl}/business/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(businessData)
        });
        const resJson = await response.json();
        if (response.ok) {
          return { success: true, message: "Business listed successfully in real Laravel DB!", data: resJson };
        } else {
          return { success: false, message: resJson.message || "Failed to save on Laravel server." };
        }
      } catch (e) {
        return { success: false, message: "Laravel server is unreachable. Saving in localized simulated sandbox." };
      }
    }

  

}
