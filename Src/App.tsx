import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

import { 
  Home, 
  Search, 
  Grid, 
  Briefcase, 
  User, 
  Utensils, 
  Hotel as HotelIcon, 
  Hospital as HospitalIcon, 
  UserRound, 
  Zap, 
  Droplets, 
  Pill, 
  ChevronLeft,
  Dumbbell, 
  GraduationCap, 
  Sparkles, 
  Wind, 
  Camera, 
  Car, 
  Briefcase as JobIcon, 
  BookOpen, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube, 
  Search as SearchIcon, 
  BadgeHelp, 
  User as UserIcon, 
  LogOut, 
  Heart, 
  Star, 
  Plus, 
  Lock, 
  Check, 
  Settings, 
  Bell, 
  FileText,
  MessageSquare,
  Sparkle,
  Bookmark,
  SlidersHorizontal,
  Building2,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  IndianRupee
  
} from "lucide-react";
import logo from "./assets/logo.png";
import hero1 from "./assets/1.png";
import hero2 from "./assets/2.png";
import hero3 from "./assets/3.png";
import hero4 from "./assets/4.png";
import hero5 from "./assets/5.png";
import hero6 from "./assets/6.png";
import ownershipBanner from "./assets/ownership.png";
import yojnaAd from "./assets/yojna.jpeg";
import digitalAd from "./assets/digital.jpeg";
import { Language, Business, Job, Article, User as UserType } from "./types";
//import { BIHAR_CITIES, CATEGORIES } from "./mockData";
import { CATEGORIES } from "./mockData";
import { TRANSLATIONS } from "./translations";
import { ApiService } from "./apiService";
import AndroidFrame from "./components/AndroidFrame";

import { ShimmerBusinessCard, ShimmerFeaturedSlider, ShimmerJobCard, Shimmer } from "./components/Shimmer";

// Category Icon Switch Helper
const CategoryIcon = ({ iconName, className = "w-5 h-5" }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case "Utensils": return <Utensils className={className} />;
    case "Hotel": return <HotelIcon className={className} />;
    case "Hospital": return <HospitalIcon className={className} />;
    case "UserRound": return <UserRound className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Droplets": return <Droplets className={className} />;
    case "Pills": return <Pill className={className} />;
    case "Dumbbell": return <Dumbbell className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Wind": return <Wind className={className} />;
    case "Camera": return <Camera className={className} />;
    case "Car": return <Car className={className} />;
    default: return <Grid className={className} />;
  }
};

export default function App() {
  // Navigation / Control Configuration States
  const [activeTab, setActiveTab] = useState<"home" | "category" | "listings" | "jobs" | "profile" | "blog">("home");
  const [activeScreen, setActiveScreen] = useState<
  | "splash"
  | "app"
  | "detail"
  | "add-business"
  | "article-detail"
  | "login"
  | "business-contact"
  | "business-description"
  | "business-media"
  | "business-final"
>(() => sessionStorage.getItem("bb_splash_done") === "1" ? "app" : "splash");
  
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  // const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem("bihar_biz_api_url") || "https://www.biharbusiness.com/api");

  const [apiUrl, setApiUrl] = useState(
  "https://www.biharbusiness.com/api"
);
  const [apiConnectionStatus, setApiConnectionStatus] = useState<"connected" | "disconnected" | "testing">("disconnected");

  // Dynamic Content States
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [latestBusinesses, setLatestBusinesses] = useState<Business[]>([]);
  const [profileBusinesses, setProfileBusinesses] = useState<Business[]>([]);
  const [profileBusinessesLoading, setProfileBusinessesLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [touristBlogs, setTouristBlogs] = useState<any[]>([]);
  const [categorySections, setCategorySections] = useState<any[]>([]);
  const [categoryPageBanners, setCategoryPageBanners] = useState<any[]>([]);
  const [categoryBannerIndex, setCategoryBannerIndex] = useState(0);
  const [appBanners, setAppBanners] = useState<any>({ home: [], category: [], search: [], jobs: [] });
  const [appBannerIndexes, setAppBannerIndexes] = useState<any>({ home: 0, category: 0, search: 0, jobs: 0 });
  // Selection States
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [jobPage, setJobPage] = useState(1);
  const [jobHasMore, setJobHasMore] = useState(false);
  const [jobTotal, setJobTotal] = useState(0);
  const [businessPage, setBusinessPage] = useState(1);
  const [businessHasMore, setBusinessHasMore] = useState(false);
  const [businessTotal, setBusinessTotal] = useState(0);
  const [businessLoadingMore, setBusinessLoadingMore] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
const [jobDetailMode, setJobDetailMode] = useState(false);
const [jobBannerIndex, setJobBannerIndex] = useState(0);
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [cities, setCities] = useState<string[]>(["All Cities"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  const [businessEmail, setBusinessEmail] = useState("");
const [businessWebsite, setBusinessWebsite] = useState("");
const [businessMapLink, setBusinessMapLink] = useState("");
const [businessDescription, setBusinessDescription] = useState("");
const [businessTags, setBusinessTags] = useState("");
const [facebookUrl, setFacebookUrl] = useState("");
const [instagramUrl, setInstagramUrl] = useState("");
const [youtubeUrl, setYoutubeUrl] = useState("");
const [coverImage, setCoverImage] = useState<File | null>(null);
const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
const [menuCard, setMenuCard] = useState<File | null>(null);
const [businessOffers, setBusinessOffers] = useState("");
const [openingHours, setOpeningHours] = useState("");
  // Authenticated Session State
  const [user, setUser] = useState<UserType | null>(null);
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  // Job Application Modal State
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [applySuccessAlert, setApplySuccessAlert] = useState(false);
 const [applyMode, setApplyMode] = useState(false);
const [applyLoading, setApplyLoading] = useState(false);
const [resumeFile, setResumeFile] = useState<File | null>(null);


const [businessName, setBusinessName] = useState("");
const [businessCategory, setBusinessCategory] = useState("");
const [businessCity, setBusinessCity] = useState("");
const [businessPhone, setBusinessPhone] = useState("");
const [businessAddress, setBusinessAddress] = useState("");

const [myBusiness, setMyBusiness] = useState<any>(() => {
  const saved = localStorage.getItem("bb_business");
  return saved ? JSON.parse(saved) : null;
});

const [applyForm, setApplyForm] = useState({
  name: "",
  mobile: "",
  email: "",
  cover_note: "",
});

const [enquiryBusiness, setEnquiryBusiness] = useState<any | null>(null);
const [enquiryName, setEnquiryName] = useState("");
const [enquiryMobile, setEnquiryMobile] = useState("");
const [enquiryMessage, setEnquiryMessage] = useState("");
const [enquiryLoading, setEnquiryLoading] = useState(false);
const [claimBusiness, setClaimBusiness] = useState<any | null>(null);
const [claimLoading, setClaimLoading] = useState(false);
const [claimForm, setClaimForm] = useState({
  claimant_name: "",
  mobile: "",
  email: "",
  relation_type: "",
  message: "",
});


const [profileTab, setProfileTab] = useState<"businesses" | "leads" | "reviews">("businesses");
const [ownerLeads, setOwnerLeads] = useState<any[]>([]);
const [ownerLeadsLoading, setOwnerLeadsLoading] = useState(false);
const [ownerReviews, setOwnerReviews] = useState<any[]>([]);
const [ownerReviewsLoading, setOwnerReviewsLoading] = useState(false);
const [ownerReviewCount, setOwnerReviewCount] = useState(0);
const [ownerAvgRating, setOwnerAvgRating] = useState(0);

const [adPlans, setAdPlans] = useState<any[]>([]);
const [adPlansLoading, setAdPlansLoading] = useState(false);
const [showAdvertiseScreen, setShowAdvertiseScreen] = useState(false);
const [selectedAdPlan, setSelectedAdPlan] = useState<any | null>(null);
const [paymentLoadingPlan, setPaymentLoadingPlan] = useState<string>("");
const supportPhone = "7217754368";
const supportEmail = "biharbusines@gmail.com";
const [categoryEnquiryName, setCategoryEnquiryName] = useState("");
const [categoryEnquiryMobile, setCategoryEnquiryMobile] = useState("");
const [categoryEnquiryCity, setCategoryEnquiryCity] = useState("");
const [categoryEnquiryRequirement, setCategoryEnquiryRequirement] = useState("");
const [categoryEnquiryCategory, setCategoryEnquiryCategory] = useState("");
const [categoryEnquiryLoading, setCategoryEnquiryLoading] = useState(false);


  // Dynamic reviews states
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Secret Admin Approval Trigger (Offline simulation helper)
  const [showAdminTab, setShowAdminTab] = useState(false);
const [popularSearches, setPopularSearches] = useState<any[]>([]);
const [heroSlideIndex, setHeroSlideIndex] = useState(0);
const [searchSliderIndex, setSearchSliderIndex] = useState(0);


const getCategoryIconName = (cat: any) => {
  const raw = String(cat?.icon || cat?.iconName || cat?.nameEn || cat?.nameHi || cat?.name || cat?.category || "").toLowerCase();
  if (raw.includes("food") || raw.includes("restaurant") || raw.includes("cafe") || raw.includes("hotel food")) return "Utensils";
  if (raw.includes("hotel") || raw.includes("lodge") || raw.includes("stay")) return "Hotel";
  if (raw.includes("doctor") || raw.includes("hospital") || raw.includes("clinic") || raw.includes("health")) return "Hospital";
  if (raw.includes("salon") || raw.includes("beauty") || raw.includes("parlour")) return "Sparkles";
  if (raw.includes("electric")) return "Zap";
  if (raw.includes("water") || raw.includes("plumb")) return "Droplets";
  if (raw.includes("medical") || raw.includes("pharma") || raw.includes("medicine")) return "Pills";
  if (raw.includes("gym") || raw.includes("fitness")) return "Dumbbell";
  if (raw.includes("school") || raw.includes("education") || raw.includes("coaching")) return "GraduationCap";
  if (raw.includes("ac") || raw.includes("repair")) return "Wind";
  if (raw.includes("photo") || raw.includes("camera")) return "Camera";
  if (raw.includes("car") || raw.includes("bike") || raw.includes("auto")) return "Car";
  return cat?.icon || "Grid";
};

const getCategoryCount = (cat: any) => {
  const rawCount = cat?.business_count ?? cat?.count ?? cat?.total ?? cat?.businessCount ?? 0;
  const count = Number(rawCount);
  return Number.isFinite(count) ? count : 0;
};

const getBusinessImage = (business: any) =>
  business?.imageUrl || business?.image_url || business?.image || business?.cover_image || business?.photo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop";

const getBusinessPhone = (business: any) =>
  String(
    business?.phone ||
    business?.mobile ||
    business?.contact ||
    business?.contact_number ||
    business?.mobile_number ||
    business?.whatsapp ||
    business?.whatsapp_number ||
    business?.owner_mobile ||
    business?.business_phone ||
    ""
  ).replace(/[^0-9+]/g, "");


const normalizePermissionValue = (value: any, fallback = false) => {
  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;
  if (typeof value === "string") {
    const v = value.toLowerCase().trim();
    if (["true", "yes", "on"].includes(v)) return true;
    if (["false", "no", "off"].includes(v)) return false;
  }
  return fallback;
};

const getBusinessPermissions = (business: any) => {
  const raw = business?.app_plan?.permissions || business?.permissions || {};
  const enabled = (showKey: string, apiKey: string, fallback = false) =>
    normalizePermissionValue(raw?.[showKey] ?? raw?.[apiKey], fallback);

  return {
    show_phone: enabled("show_phone", "mobile", true),
    show_whatsapp: enabled("show_whatsapp", "whatsapp", false),
    show_hours: enabled("show_hours", "working_hours", false),
    show_offers: enabled("show_offers", "offers", false),
    show_map: enabled("show_map", "map", false),
    show_menu_card: enabled("show_menu_card", "menu_rate_card", false),
    show_website: enabled("show_website", "website", false),
    show_address: enabled("show_address", "address", true),
    show_email: enabled("show_email", "email", false),
    show_social_links: enabled("show_social_links", "social_links", false),
    show_gallery: enabled("show_gallery", "gallery", false),
    show_full_description: normalizePermissionValue(
    raw?.show_full_description ?? business?.show_full_description,
    false
  ),
  };
};

const normalizeStorageUrl = (value: any) => {
  const path = String(value || "").replace(/\\\\\//g, "/").trim();
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiUrl.replace(/\/api\/?$/, "")}/storage/${path.replace(/^storage\//, "")}`;
};


const normalizeAppBannerImage = (banner: any) =>
  banner?.image_url || banner?.imageUrl || banner?.banner_image_url || normalizeStorageUrl(banner?.banner_image || banner?.image || "");

const getAppBannerList = (placement: "home" | "category" | "search" | "jobs") =>
  Array.isArray(appBanners?.[placement]) ? appBanners[placement] : [];

const openAppBanner = (banner: any) => {
  if (!banner) return;
  if (banner.action_type === "business_detail" && banner.business_id) {
    const matched = [...businesses, ...featuredBusinesses, ...latestBusinesses].find((b: any) => String(b?.id) === String(banner.business_id));
    setSelectedBusiness(normalizeBusinessForDetail(matched || { ...banner, id: banner.business_id, name: banner.title, imageUrl: normalizeAppBannerImage(banner) }));
    setActiveScreen("detail");
    return;
  }
  if (banner.link_url) {
    window.open(banner.link_url, "_blank");
  }
};

const normalizeBusinessGallery = (business: any): string[] => {
  let raw = business?.galleryImages ?? business?.gallery_images ?? business?.gallery ?? business?.images ?? [];
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw); } catch { raw = raw ? [raw] : []; }
  }
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw); } catch { raw = raw ? [raw] : []; }
  }
  if (!Array.isArray(raw)) raw = [];
  return raw.map(normalizeStorageUrl).filter(Boolean);
};

const LockedMiniBadge = ({ label = "Locked" }: { label?: string }) => (
  <span className="inline-flex items-center justify-center gap-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-black shadow-sm whitespace-nowrap">
    <Lock className="w-3 h-3" /> {label}
  </span>
);

const normalizeBusinessForDetail = (business: any): Business => ({
  ...business,
  imageUrl: getBusinessImage(business),
  services: Array.isArray(business?.services)
    ? business.services
    : business?.services
    ? String(business.services).split(",").map((s: string) => s.trim()).filter(Boolean)
    : [],
  reviews: Array.isArray(business?.reviews) ? business.reviews : [],
  reviewCount: business?.reviewCount ?? business?.review_count ?? business?.total_reviews ?? 0,
  isVerified: business?.isVerified ?? business?.verified ?? false,
  galleryImages: normalizeBusinessGallery(business),
});
  // App Notifications Simulation
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to Bihar Business! Enlist your shop for free.",
    "Opportunity: Apply to newly listed telecaller jobs in Patna today!"
  ]);
  const [showNotificationList, setShowNotificationList] = useState(false);

  // Static Articles Data
  

  // Dictionary translated values short-hand
  const t = TRANSLATIONS[language];

  const heroSlides = [hero1, hero2, hero3, hero4, hero5, hero6];

  const normalizeText = (value: any) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const getCategoryValue = (cat: any) =>
    cat?.id || cat?.slug || cat?.category || cat?.nameEn || cat?.name || "";

  const isSameCategory = (businessCategory: any, cat: any) => {
    const b = normalizeText(businessCategory);
    const values = [cat?.id, cat?.slug, cat?.category, cat?.nameEn, cat?.nameHi, cat?.name].map(normalizeText);
    return values.includes(b);
  };

  // Splash Screen Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("bb_splash_done", "1");
      setActiveScreen("app");
    }, 2200);
    
    // Check local storage for session
    const storedUser = localStorage.getItem("bihar_biz_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("bihar_biz_user");
      }
    }

    // Load active settings from storage
    const storedApiMode = localStorage.getItem("bihar_biz_api_mode");
    if (storedApiMode === "live") {
      setIsLiveMode(true);
    }
    const storedApiUrl = localStorage.getItem("bihar_biz_api_url");
    if (storedApiUrl) {
      setApiUrl(storedApiUrl);
    }

    return () => clearTimeout(timer);
  }, []);
const showToast = (message: string) => {
  setToastMessage(message);
  setTimeout(() => {
    setToastMessage("");
  }, 2500);
};
  // Fetch Businesses and Jobs on config change or screen refocus
  const refreshAppData = async () => {
    setLoading(true);
    try {
      const bizRes = await ApiService.getBusinesses(apiUrl, isLiveMode);
      setBusinesses(bizRes.data);
      if (bizRes.source === "api") {
        setApiConnectionStatus("connected");
      } else {
        setApiConnectionStatus("disconnected");
      }

    } catch (e) {
      setApiConnectionStatus("disconnected");
    } finally {
      // Small delay for neat UX simmer transitions
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };
const loadCities = async () => {
  try {
    const res = await fetch(`${apiUrl}/cities`);
    const data = await res.json();

    const apiCities = Array.isArray(data.cities) ? data.cities : [];

    setCities(["All Cities", ...apiCities]);
  } catch (error) {
    console.log("Cities API Error:", error);
    setCities(["All Cities"]);
  }
};

const loadCategories = async () => {
  try {
    const res = await fetch(`${apiUrl}/categories`);
    const data = await res.json();

    const apiCategories = Array.isArray(data.categories)
      ? data.categories
      : Array.isArray(data.data)
      ? data.data
      : [];

    setCategories(apiCategories);
  } catch (error) {
    console.log("Categories API Error:", error);
    setCategories(CATEGORIES); // fallback
  }
};
const loadFeaturedBusinesses = async () => {
  try {
    const res = await fetch(`${apiUrl}/featured-businesses`);
    const data = await res.json();

    const apiFeatured = Array.isArray(data.businesses)
      ? data.businesses
      : Array.isArray(data.data)
      ? data.data
      : [];

    setFeaturedBusinesses(apiFeatured);
  } catch (error) {
    console.log("Featured API Error:", error);
    setFeaturedBusinesses([]);
  }
};
const loadLatestBusinesses = async () => {
    //alert("FUNCTION CALLED");
  try {
    const res = await fetch(`${apiUrl}/latest-businesses`);
    const data = await res.json();

    const apiLatest = Array.isArray(data.businesses)
      ? data.businesses
      : Array.isArray(data.data)
      ? data.data
      : [];
//alert("LATEST COUNT = " + apiLatest.length);
    setLatestBusinesses(apiLatest);
  } catch (error) {
    console.log("Latest API Error:", error);
    setLatestBusinesses([]);
  }
};
const loadFilteredBusinesses = async (page = 1, append = false) => {
  try {
    if (append) {
      setBusinessLoadingMore(true);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "20");

    if (selectedCity && selectedCity !== "All Cities") {
      params.append("city", selectedCity);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    const res = await fetch(`${apiUrl}/businesses?${params.toString()}`);
    const data = await res.json();

    const apiBusinesses = Array.isArray(data.businesses)
      ? data.businesses
      : Array.isArray(data.data)
      ? data.data
      : [];

    setBusinesses((prev) => append ? [...prev, ...apiBusinesses] : apiBusinesses);
    setBusinessPage(Number(data.current_page || page));
    setBusinessHasMore(Boolean(data.has_more));
    setBusinessTotal(Number(data.total || apiBusinesses.length || 0));
  } catch (error) {
    console.log("Filtered Businesses API Error:", error);
    if (!append) setBusinesses([]);
  } finally {
    setLoading(false);
    setBusinessLoadingMore(false);
  }
};
const loadMyProfileBusinesses = async () => {
  const loggedUser =
    user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser?.id) {
    setProfileBusinesses([]);
    return;
  }

  try {
    setProfileBusinessesLoading(true);

    const res = await fetch(`${apiUrl}/my-businesses/${encodeURIComponent(loggedUser.id)}`, {
      headers: { Accept: "application/json" },
     // credentials: "include",
    });

    const data = await res.json();

    const apiBusinesses = Array.isArray(data.businesses)
      ? data.businesses
      : Array.isArray(data.data)
      ? data.data
      : [];

    setProfileBusinesses(apiBusinesses);
  } catch (error) {
    console.log("My Businesses API Error:", error);
    setProfileBusinesses([]);
  } finally {
    setProfileBusinessesLoading(false);
  }
};

const loadPopularSearches = async () => {
  try {
    const res = await fetch(`${apiUrl}/popular-searches`);
    const data = await res.json();

    const items = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.popular_searches)
      ? data.popular_searches
      : [];

    setPopularSearches(items);
  } catch (error) {
    console.log("Popular Searches API Error:", error);
    setPopularSearches([]);
  }
};

const loadCategorySections = async () => {
  try {
    const res = await fetch(`${apiUrl}/category-sections`);
    const data = await res.json();

    const sections = Array.isArray(data.sections)
      ? data.sections
      : Array.isArray(data.data)
      ? data.data
      : [];

    setCategorySections(sections);
  } catch (error) {
    console.log("Category Sections API Error:", error);
    setCategorySections([]);
  }
};

const loadAppBanners = async () => {
  try {
    const res = await fetch(`${apiUrl}/app-banners`, { headers: { Accept: "application/json" } });
    const data = await res.json();
    if (data?.success && data?.banners) {
      setAppBanners({
        home: Array.isArray(data.banners.home) ? data.banners.home : [],
        category: Array.isArray(data.banners.category) ? data.banners.category : [],
        search: Array.isArray(data.banners.search) ? data.banners.search : [],
        jobs: Array.isArray(data.banners.jobs) ? data.banners.jobs : [],
      });
    }
  } catch (error) {
    console.log("App Banners API Error:", error);
    setAppBanners({ home: [], category: [], search: [], jobs: [] });
  }
};

const loadCategoryPageBanners = async () => {
  try {
    const res = await fetch(`${apiUrl}/category-page-banners`);
    const data = await res.json();

    const banners = Array.isArray(data.banners)
      ? data.banners
      : Array.isArray(data.data)
      ? data.data
      : [];

    setCategoryPageBanners(banners);
  } catch (error) {
    console.log("Category Page Banners API Error:", error);
    setCategoryPageBanners([]);
  }
};
const loadTouristBlogs = async () => {
  try {
    const res = await fetch(`${apiUrl}/tourist-blogs`);
    const data = await res.json();

    const blogs = Array.isArray(data.data) ? data.data : [];

    setTouristBlogs(blogs);
  } catch (error) {
    console.log("Tourist Blogs API Error:", error);
    setTouristBlogs([]);
  }
};
const loadJobs = async (page = 1, append = false) => {
  if (jobsLoading) return;

  try {
    setJobsLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "50");

    const res = await fetch(`${apiUrl}/jobs?${params.toString()}`);
    const data = await res.json();

    const apiJobs = Array.isArray(data.jobs)
      ? data.jobs
      : Array.isArray(data.data)
      ? data.data
      : [];

    setJobs((prev) => append ? [...prev, ...apiJobs] : apiJobs);
    setJobPage(Number(data.current_page || page));
    setJobHasMore(Boolean(data.has_more));
    setJobTotal(Number(data.total || apiJobs.length || 0));
    setJobsLoaded(true);
  } catch (error) {
    console.log("Jobs API Error:", error);
    if (!append) setJobs([]);
  } finally {
    setJobsLoading(false);
  }
};



const isBusinessUnclaimed = (business: any) => {
  const status = String(business?.claimed_status || business?.claimStatus || "").toLowerCase().trim();
  if (status === "claimed") return false;
  if (status === "unclaimed") return true;

  const claimed = business?.is_claimed ?? business?.isClaimed ?? business?.claimed;
  const ownerId = business?.owner_id ?? business?.ownerId;

  const claimedValue = String(claimed ?? "0").toLowerCase().trim();
  const hasClaimedFlag = claimedValue === "1" || claimedValue === "true" || claimedValue === "yes";
  const hasOwner = ownerId !== undefined && ownerId !== null && String(ownerId).trim() !== "" && String(ownerId).trim() !== "0";

  return !hasClaimedFlag && !hasOwner;
};

const openClaimModal = (business: any) => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");
  setClaimBusiness(business);
  setClaimForm({
    claimant_name: loggedUser?.name || "",
    mobile: loggedUser?.mobile || loggedUser?.phone || "",
    email: loggedUser?.email || "",
    relation_type: "",
    message: "",
  });
};

const submitClaimRequest = async () => {
  if (!claimBusiness?.id) return showToast("Business not found.");
  if (!claimForm.claimant_name.trim() || !claimForm.mobile.trim()) return showToast("Name and mobile required.");

  try {
    setClaimLoading(true);
    const res = await fetch(`${apiUrl}/business/claim`, {
      method: "POST",
      //credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        business_id: claimBusiness.id,
        claimant_name: claimForm.claimant_name.trim(),
        mobile: claimForm.mobile.trim(),
        email: claimForm.email.trim(),
        relation_type: claimForm.relation_type,
        message: claimForm.message.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) return showToast(data.message || "Claim request failed.");
    if (data.user_id) {
      const updatedUser = { id: data.user_id, name: claimForm.claimant_name.trim(), mobile: claimForm.mobile.trim(), email: claimForm.email.trim(), role: "customer" };
      setUser((prev: any) => prev || updatedUser);
      localStorage.setItem("bihar_biz_user", JSON.stringify(user || updatedUser));
    }
    showToast(data.message || "Claim request submitted.");
    setClaimBusiness(null);
  } catch (error) {
    console.log("Claim Submit Error:", error);
    showToast("Something went wrong.");
  } finally {
    setClaimLoading(false);
  }
};

const openEnquiryModal = (business: any) => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");
  setEnquiryBusiness(business);
  setEnquiryName(loggedUser?.name || "");
  setEnquiryMobile(loggedUser?.mobile || loggedUser?.phone || "");
  setEnquiryMessage("");
};

const submitBusinessEnquiry = async () => {
  if (!enquiryBusiness?.id) {
    showToast("Business not found.");
    return;
  }

  if (!enquiryName.trim() || !enquiryMobile.trim()) {
    showToast("Name and mobile required.");
    return;
  }

  try {
    setEnquiryLoading(true);

    const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

    const res = await fetch(`${apiUrl}/business/enquiry`, {
      method: "POST",
     // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        business_id: enquiryBusiness.id,
        user_id: loggedUser?.id || null,
        name: enquiryName.trim(),
        mobile: enquiryMobile.trim(),
        message: enquiryMessage.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      showToast(data.message || "Enquiry submit failed.");
      return;
    }

    showToast(data.message || "Enquiry submitted successfully.");
    setEnquiryBusiness(null);
    setEnquiryName("");
    setEnquiryMobile("");
    setEnquiryMessage("");
  } catch (error) {
    console.log("Enquiry Submit Error:", error);
    showToast("Something went wrong.");
  } finally {
    setEnquiryLoading(false);
  }
};

const loadOwnerLeads = async () => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser?.id) {
    setOwnerLeads([]);
    return;
  }

  try {
    setOwnerLeadsLoading(true);
    const res = await fetch(`${apiUrl}/owner/leads?user_id=${encodeURIComponent(loggedUser.id)}`, {
      headers: { Accept: "application/json" },
     // credentials: "include",
    });

    const data = await res.json();
    const leads = Array.isArray(data.leads)
      ? data.leads
      : Array.isArray(data.data)
      ? data.data
      : [];

    setOwnerLeads(leads);
  } catch (error) {
    console.log("Owner Leads API Error:", error);
    setOwnerLeads([]);
  } finally {
    setOwnerLeadsLoading(false);
  }
};

const loadOwnerReviews = async () => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser?.id) {
    setOwnerReviews([]);
    setOwnerReviewCount(0);
    setOwnerAvgRating(0);
    return;
  }

  try {
    setOwnerReviewsLoading(true);
    const res = await fetch(`${apiUrl}/owner/reviews?user_id=${encodeURIComponent(loggedUser.id)}&limit=20`, {
      headers: { Accept: "application/json" },
     // credentials: "include",
    });

    const data = await res.json();

    const reviews = Array.isArray(data.reviews)
      ? data.reviews
      : Array.isArray(data.data)
      ? data.data
      : [];

    setOwnerReviews(reviews);
    setOwnerReviewCount(Number(data.count || reviews.length || 0));
    setOwnerAvgRating(Number(data.avg_rating || data.avgRating || 0));
  } catch (error) {
    console.log("Owner Reviews API Error:", error);
    setOwnerReviews([]);
    setOwnerReviewCount(0);
    setOwnerAvgRating(0);
  } finally {
    setOwnerReviewsLoading(false);
  }
};


const submitCategoryEnquiry = async () => {
  if (!categoryEnquiryName.trim()) {
    showToast("Name required.");
    return;
  }

  if (!categoryEnquiryMobile.trim()) {
    showToast("Mobile required.");
    return;
  }

  if (!categoryEnquiryCity.trim() || categoryEnquiryCity === "All Cities") {
    showToast("Please select city.");
    return;
  }

  if (!(categoryEnquiryCategory || selectedCategory)) {
    showToast("Please select category.");
    return;
  }

  if (!categoryEnquiryRequirement.trim()) {
    showToast("Requirement required.");
    return;
  }

  try {
    setCategoryEnquiryLoading(true);

    const res = await fetch(`${apiUrl}/category/enquiry`, {
      method: "POST",
     // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: categoryEnquiryName.trim(),
        mobile: categoryEnquiryMobile.trim(),
        city: categoryEnquiryCity.trim(),
        requirement: categoryEnquiryRequirement.trim(),
        category: categoryEnquiryCategory || selectedCategory || "",
      }),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.log("Category Enquiry Non JSON Response:", rawText);
      showToast("Server response error. Please check API.");
      return;
    }

    if (!res.ok || !data.status) {
      showToast(data.message || "Enquiry submit failed.");
      return;
    }

    showToast(data.message || "Enquiry submitted successfully.");
    setCategoryEnquiryName("");
    setCategoryEnquiryMobile("");
    setCategoryEnquiryCity("");
    setCategoryEnquiryRequirement("");
    setCategoryEnquiryCategory("");
  } catch (error) {
    console.log("Category Enquiry Error:", error);
    showToast("Something went wrong.");
  } finally {
    setCategoryEnquiryLoading(false);
  }
};

const loadAdPlans = async () => {
  try {
    setAdPlansLoading(true);
    const res = await fetch(`${apiUrl}/business/plans`, {
      headers: { Accept: "application/json" },
      //credentials: "include",
    });
    const data = await res.json();

    const plans = Array.isArray(data.plans)
      ? data.plans
      : Array.isArray(data.data)
      ? data.data
      : [];

    setAdPlans(plans);
  } catch (error) {
    console.log("Advertisement Plans API Error:", error);
    setAdPlans([]);
  } finally {
    setAdPlansLoading(false);
  }
};

const openAdvertiseScreen = (businessForPayment?: any) => {
  // IMPORTANT: When used directly as onClick={() => openAdvertiseScreen()}, React passes the click event.
  // That event contains circular DOM/React Fiber objects, so never JSON.stringify it.
  const isClickEvent = businessForPayment?.currentTarget || businessForPayment?.target || businessForPayment?.nativeEvent;
  const safeBusiness = isClickEvent ? null : businessForPayment;

  if (safeBusiness?.id) {
    const cleanBusiness = { ...safeBusiness };
    setMyBusiness(cleanBusiness);
    localStorage.setItem("bb_business", JSON.stringify(cleanBusiness));
  }

  setShowAdvertiseScreen(true);
  setSelectedAdPlan(null);
  loadAdPlans();
};

const getPlanFeatures = (plan: any) => {
  if (Array.isArray(plan?.features)) return plan.features;
  if (Array.isArray(plan?.permissions)) return plan.permissions;
  return [];
};

const planComparisonFeatures = [
  { key: "mobile", label: "Mobile Number" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "working_hours", label: "Working Hours" },
  { key: "offers", label: "Offers" },
  { key: "map", label: "Google Map" },
  { key: "menu_rate_card", label: "Menu / Rate Card" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
  { key: "social_links", label: "Social Links" },
  { key: "gallery", label: "Gallery" },
  { key: "show_full_description", label: "Full Description" },
  { key: "services", label: "Services" },
];
const openWhatsAppForPlan = (plan: any) => {
  const message = `Hello BiharBusiness, I want to advertise my business. Plan: ${plan?.label || plan?.name || plan?.type || "Advertisement Plan"} ₹${plan?.price || ""} / ${plan?.duration || ""}`;
  window.open(`https://wa.me/91${supportPhone}?text=${encodeURIComponent(message)}`, "_blank");
};

const openSupportWhatsApp = () => {
  const message = "Hello BiharBusiness, I need support for my business listing/app.";
  window.open(`https://wa.me/91${supportPhone}?text=${encodeURIComponent(message)}`, "_blank");
};

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const startPlanPayment = async (plan: any) => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");
  const selectedBiz = myBusiness;

  if (!loggedUser?.id) {
    showToast("Please login first.");
    setActiveScreen("login");
    return;
  }

  if (!selectedBiz?.id) {
    showToast("Please select your business first.");
    return;
  }

  const planType = plan?.type || plan?.plan || plan?.slug;
  if (!planType) {
    showToast("Invalid plan selected.");
    return;
  }

  try {
    setPaymentLoadingPlan(String(planType));

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      showToast("Razorpay failed to load.");
      return;
    }

    const orderRes = await fetch(`${apiUrl}/payment/create-order`, {
      method: "POST",
     // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        business_id: selectedBiz.id,
        user_id: loggedUser.id,
        plan: planType,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.status) {
      showToast(orderData.message || "Payment order failed.");
      return;
    }

   const options = {
  key: orderData.key,
  amount: orderData.amount,
  currency: orderData.currency || "INR",
webview_intent:true,
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },

  name: "Bihar Business",
  description: `${plan?.label || planType} for ${selectedBiz.name || "Business"}`,
  order_id: orderData.order_id,

  prefill: {
    name: loggedUser.name || "",
    email: loggedUser.email || "",
    contact: loggedUser.mobile || loggedUser.phone ,
  },

  notes: {
    business_id: String(selectedBiz.id),
    owner_id: String(loggedUser.id),
    plan: String(planType),
  },

  theme: {
    color: "#f97316",
  },

  handler: async function (response: any) {
    try {
      const verifyRes = await fetch(`${apiUrl}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          business_id: String(selectedBiz.id),
          user_id: String(loggedUser.id),
          plan: String(planType),
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.status) {
        showToast(verifyData.message || "Payment successful! Plan activated.");
        setShowAdvertiseScreen(false);
        loadMyProfileBusinesses();
        loadAdPlans();
      } else {
        showToast(verifyData.message || "Payment done but verification failed. Contact support.");
      }
    } catch (err) {
      console.log("Verify Error:", err);
      showToast("Payment done but server update failed. Contact support.");
    }
  },

  modal: {
    ondismiss: function () {
      setPaymentLoadingPlan("");
    },
  },
};

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.log("Payment Error:", error);
    showToast("Payment failed.");
  } finally {
    setPaymentLoadingPlan("");
  }
};


const submitJobApplication = async () => {
  if (!selectedJob) return;

  if (!applyForm.name.trim()) {
    showToast("Name required hai");
    return;
  }

  if (!applyForm.mobile.trim()) {
    showToast("Mobile required hai");
    return;
  }

  try {
    setApplyLoading(true);

    const formData = new FormData();
    formData.append("job_id", String(selectedJob.id));
    formData.append("name", applyForm.name.trim());
    formData.append("mobile", applyForm.mobile.trim());
    formData.append("email", applyForm.email.trim());
    formData.append("cover_note", applyForm.cover_note.trim());
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const res = await fetch(`${apiUrl}/jobs/apply`, {
      method: "POST",
     // credentials: "include",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.log("Job Apply Non JSON Response:", rawText);
      showToast("Server response error. Please check API.");
      return;
    }

    if (!res.ok || !data.status) {
      showToast(data.message || "Application submit failed");
      return;
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("bihar_biz_user", JSON.stringify(data.user));
    }

    showToast(data.message || "Application submitted successfully.");

    setApplyMode(false);
    setResumeFile(null);
    setApplyForm({
      name: "",
      mobile: "",
      email: "",
      cover_note: "",
    });
  } catch (error) {
    console.log("Apply Error:", error);
    showToast("Server error. Please try again.");
  } finally {
    setApplyLoading(false);
  }
};

useEffect(() => {
  if (activeScreen !== "app" || activeTab !== "home") return;
  const timer = window.setInterval(() => {
    setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
  }, 3500);
  return () => window.clearInterval(timer);
}, [activeScreen, activeTab, heroSlides.length]);

useEffect(() => {
  if (activeScreen === "app" && activeTab === "home") {
    refreshAppData();
    loadCities();
    loadCategories();
    loadFeaturedBusinesses();
    loadLatestBusinesses();
    loadPopularSearches();
    loadTouristBlogs();
    loadCategorySections();
    loadAppBanners();
  }
}, [activeScreen, activeTab, isLiveMode, apiUrl]);

useEffect(() => {
  if (activeScreen === "app" && activeTab === "category") {
    loadCategories();
    loadCities();
    loadCategoryPageBanners();
    loadAppBanners();
  }
}, [activeScreen, activeTab, apiUrl]);

useEffect(() => {
  if (activeScreen !== "app" || activeTab !== "category" || categoryPageBanners.length <= 1) return;
  const timer = window.setInterval(() => {
    setCategoryBannerIndex((prev) => (prev + 1) % categoryPageBanners.length);
  }, 3500);
  return () => window.clearInterval(timer);
}, [activeScreen, activeTab, categoryPageBanners.length]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "listings") return;

  setBusinessPage(1);
  loadFilteredBusinesses(1, false);
  loadAppBanners();
}, [activeScreen, activeTab, selectedCity, selectedCategory, searchQuery, apiUrl]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "profile") return;
  if (profileTab !== "businesses") return;

  loadMyProfileBusinesses();
}, [activeScreen, activeTab, profileTab, apiUrl, user]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "profile") return;
  if (profileTab !== "leads") return;

  loadOwnerLeads();
}, [activeScreen, activeTab, profileTab, apiUrl, user]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "profile") return;
  if (profileTab !== "reviews") return;

  loadOwnerReviews();
}, [activeScreen, activeTab, profileTab, apiUrl, user]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "jobs") return;

  setJobPage(1);
  setJobSearchQuery("");
  loadJobs(1, false);
  loadAppBanners();
}, [activeScreen, activeTab, apiUrl]);


useEffect(() => {
  if (activeScreen !== "app") return;
  const placement = activeTab === "home" ? "home" : activeTab === "category" ? "category" : activeTab === "listings" ? "search" : activeTab === "jobs" ? "jobs" : "";
  if (!placement) return;
  const list = getAppBannerList(placement as any);
  if (list.length <= 1) return;
  const timer = window.setInterval(() => {
    setAppBannerIndexes((prev: any) => ({ ...prev, [placement]: (Number(prev?.[placement] || 0) + 1) % list.length }));
  }, 3500);
  return () => window.clearInterval(timer);
}, [activeScreen, activeTab, appBanners]);

useEffect(() => {
  if (activeScreen !== "app") return;
  if (activeTab !== "profile") return;

  if (adPlans.length === 0) {
    loadAdPlans();
  }
}, [activeScreen, activeTab]);
  // Handle active filters computation
 const filteredBusinesses = useMemo(() => {
  return businesses;
}, [businesses]);

const filteredJobs = useMemo(() => {
  const q = normalizeText(jobSearchQuery);
  if (!q) return jobs;

  return jobs.filter((job: any) => {
    const text = normalizeText(`${job?.title || ""} ${job?.company || ""} ${job?.city || ""} ${job?.salary || ""} ${job?.type || ""} ${job?.experience || ""} ${job?.description || ""}`);
    return text.includes(q);
  });
}, [jobs, jobSearchQuery]);

  // const featuredBusinesses = useMemo(() => {
  //   return businesses.filter(b => b.isPremium && b.status === "approved");
  // }, [businesses]);

 

const topRatedBusinesses = useMemo(() => {
  return [...businesses]
    .filter(b => b.status === "approved")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
}, [businesses]);


const searchSliderBusinesses = useMemo(() => {
  const q = normalizeText(searchQuery || selectedCategory);
  const city = selectedCity !== "All Cities" ? normalizeText(selectedCity) : "";

  const merged = [...(featuredBusinesses || []), ...(latestBusinesses || []), ...(businesses || [])];
  const uniqueMap = new Map<string, any>();
  merged.forEach((b: any, index: number) => {
    const key = String(b?.id ?? `${b?.name || "business"}-${index}`);
    if (!uniqueMap.has(key)) uniqueMap.set(key, b);
  });

  const source = Array.from(uniqueMap.values()).filter((b: any) => {
    const plan = normalizeText(b?.app_plan?.type || b?.payment_plan || b?.plan || b?.paymentPlan);
    return (
      plan === "featured" ||
      plan === "premium" ||
      b?.featured === 1 ||
      b?.featured === true ||
      b?.isFeatured === true ||
      b?.isPremium === true
    );
  });

  const matched = source.filter((b: any) => {
    const text = normalizeText(`${b?.name || ""} ${b?.category || ""} ${b?.city || ""} ${b?.address || ""} ${b?.services || ""}`);
    const matchQuery = q ? text.includes(q) : true;
    const matchCity = city ? normalizeText(b?.city).includes(city) : true;
    return matchQuery && matchCity;
  });

  const list = matched.length > 0 ? matched : source;
  return list.slice(0, 8);
}, [featuredBusinesses, latestBusinesses, businesses, searchQuery, selectedCategory, selectedCity]);

useEffect(() => {
  setSearchSliderIndex(0);
}, [searchQuery, selectedCategory, selectedCity, searchSliderBusinesses.length]);

useEffect(() => {
  if (activeScreen !== "app" || activeTab !== "listings" || searchSliderBusinesses.length <= 1) return;
  const timer = window.setInterval(() => {
    setSearchSliderIndex((prev) => (prev + 1) % searchSliderBusinesses.length);
  }, 3000);
  return () => window.clearInterval(timer);
}, [activeScreen, activeTab, searchSliderBusinesses.length]);


const myProfileBusinesses = useMemo(() => {
  const loggedUser =
    user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser) return [];

  const mobile = String(loggedUser.mobile || loggedUser.phone || "").trim();
  const userId = String(loggedUser.id || "").trim();

  const sourceList = profileBusinesses.length > 0 ? profileBusinesses : businesses;

  return sourceList.filter((b: any) => {
    const ownerId = String(b.owner_id ?? b.ownerId ?? "").trim();
    const createdUserId = String(b.user_id ?? b.userId ?? "").trim();
    const phone = String(b.phone || "").trim();
    const whatsapp = String(b.whatsapp || "").trim();

    return (
      ownerId === userId ||
      createdUserId === userId ||
      (!!mobile && (phone === mobile || whatsapp === mobile))
    );
  });
}, [businesses, profileBusinesses, user]);
  // Back action implementation from Android status controls
  const handlePhysicalBack = () => {
    if (activeScreen === "detail" || activeScreen === "add-business" || activeScreen === "article-detail" || activeScreen === "login" || activeScreen === "business-contact" || activeScreen === "business-description" || activeScreen === "business-media" || activeScreen === "business-final") {
      setActiveScreen("app");
    } else if (activeTab !== "home") {
      setActiveTab("home");
    } else {
      // Already at top, trigger vibration effect or alert
      const vibrationAlert = "Exit simulation? Tap Home button below.";
     // setNotifications(prev => [vibrationAlert, ...prev]);
    }
  };

  const handlePhysicalHome = () => {
    setActiveScreen("app");
    setActiveTab("home");
    setSelectedBusiness(null);
    setSelectedArticle(null);
  };

 const handleLogout = async () => {
  setLoading(true);

  try {
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
     // credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.log("Logout API Error:", error);
  }

  localStorage.removeItem("bihar_biz_user");
  localStorage.removeItem("bb_business");

  setUser(null);
  setMyBusiness(null);
  setProfileBusinesses([]);
  setOwnerLeads([]);
  setOwnerReviews([]);
  setOwnerReviewCount(0);
  setOwnerAvgRating(0);
  setShowNotificationList(false);

  setLoading(false);
  setActiveScreen("app");
  setActiveTab("home");

  showToast("Logout successful.");
};

  // Submit Business store handler
  const handleAddBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const servicesText = formData.get("services") as string;
    const servicesList = servicesText ? servicesText.split(",").map(s => s.trim()) : [];

    const newBiz: Partial<Business> = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      website: formData.get("website") as string,
      category: formData.get("category") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      services: servicesList,
      description: formData.get("description") as string,
      imageUrl: (formData.get("imageUrl") as string) || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=500&auto=format&fit=crop",
      openingHours: (formData.get("openingHours") as string) || "9:00 AM - 8:00 PM",
      facebook: formData.get("facebook") as string,
      instagram: formData.get("instagram") as string,
      youtube: formData.get("youtube") as string,
      offers: formData.get("offers") as string
    };

    setLoading(true);
    const result = await ApiService.postBusinessStore(apiUrl, isLiveMode, newBiz);
    setLoading(false);

    if (result.success) {
      alert(language === "en" ? "Business registered as PENDING ADMIN APPROVAL! Approve it in profile area." : "व्यवसाय सफलतापूर्वक दर्ज हो गया है! इसे एडमिन से सत्यापित होने के बाद लाइव किया जायेगा।");
      setActiveScreen("app");
      setActiveTab("profile");
      refreshAppData();
    } else {
      alert(result.message);
    }
  };
const handleUpdateBusinessContact = async () => {
  if (!myBusiness || !myBusiness.id) {
    showToast("Business not found.");
    return;
  }

  setLoading(true);

  try {
  const res = await ApiService.updateBusinessContact(apiUrl, isLiveMode, {
    business_id: myBusiness.id,
    email: businessEmail.trim(),
    website: businessWebsite.trim(),
    map_link: businessMapLink.trim(),
  });

  setLoading(false);

  if (res.success) {
    const updatedBusiness = {
      ...myBusiness,
      ...(res.business || {}),
      profile_percentage: Math.max(myBusiness.profile_percentage || 30, 45),
    };

    setMyBusiness(updatedBusiness);
    localStorage.setItem("bb_business", JSON.stringify(updatedBusiness));

    showToast(res.message || "Contact info updated.");
    setActiveScreen("app");
    setActiveTab("profile");
  } else {
    showToast(res.message || "Update failed.");
  }
  } catch (error) {
    console.log("Contact Update Error:", error);
    setLoading(false);
    showToast("Server response error. Please check API.");
  }
};
  // Submit Review Handler
  // Submit Review Handler
const handleAddReview = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedBusiness) {
    showToast("Business not found.");
    return;
  }

  const loggedUser =
    user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser?.id) {
    showToast("Please login to write review.");
    setActiveScreen("login");
    return;
  }

  if (!reviewComment.trim()) {
    showToast("Please write your review.");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${apiUrl}/business-review/store`, {
      method: "POST",
     // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        business_id: selectedBusiness.id,
        user_id: loggedUser.id,
        name: reviewAuthor.trim() || loggedUser.name || "User",
        rating: reviewRating,
        review_text: reviewComment.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      showToast(data.message || "Review submit failed.");
      return;
    }

    const newReview = {
      id: Date.now(),
      user_id: loggedUser.id,
      name: reviewAuthor.trim() || loggedUser.name || "User",
      rating: reviewRating,
      review_text: reviewComment.trim(),
      created_at: new Date().toISOString(),
    };

    const updatedSelectedBusiness = {
      ...selectedBusiness,
      rating: data.rating ?? selectedBusiness.rating,
      reviewCount: data.reviewCount ?? ((selectedBusiness.reviewCount || 0) + 1),
      reviews: [newReview, ...(selectedBusiness.reviews || [])],
    };

    setSelectedBusiness(updatedSelectedBusiness);

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === selectedBusiness.id ? updatedSelectedBusiness : b
      )
    );

    setLatestBusinesses((prev) =>
      prev.map((b) =>
        b.id === selectedBusiness.id ? updatedSelectedBusiness : b
      )
    );

    setFeaturedBusinesses((prev) =>
      prev.map((b) =>
        b.id === selectedBusiness.id ? updatedSelectedBusiness : b
      )
    );

    setReviewAuthor("");
    setReviewComment("");
    setReviewRating(5);

    showToast(data.message || "Review submitted successfully.");
  } catch (error) {
    console.log("Review Submit Error:", error);
    showToast("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  // Test Laravel Server connectivity direct in client
  const handleTestApi = async () => {
    setApiConnectionStatus("testing");
    const reachable = await ApiService.pingCheck(apiUrl);
    if (reachable) {
      setApiConnectionStatus("connected");
      alert(t.apiCheckSuccess);
    } else {
      setApiConnectionStatus("disconnected");
      alert(t.apiCheckFail);
    }
  };

  // Secret Sandbox Helper: Instantly Approve all pending listed businesses
  const approveAllPending = () => {
    const updated = businesses.map(b => {
      if (b.status === "pending") {
        return { ...b, status: "approved" as const };
      }
      return b;
    });
    setBusinesses(updated);
    localStorage.setItem("bihar_biz_businesses", JSON.stringify(updated));
    setNotifications(prev => ["All pending listed shops approved! Dynamic search results updated.", ...prev]);
    alert(language === "en" ? "Sandbox Override active! All pending listings approved!" : "सक्रिय ओवरराइड! सभी लंबित पंजीकृत दुकानें सत्यापित कर दी गयी हैं।");
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!loginMobile.trim() || !loginPassword.trim()) {
    setAuthErrorMessage("Mobile number and password required.");
    return;
  }

  setLoading(true);

  const res = await ApiService.loginUser(apiUrl, isLiveMode, {
    mobile: loginMobile.trim(),
    password: loginPassword.trim(),
  });

  setLoading(false);

  if (res.success && res.user) {
    setUser(res.user);
    localStorage.setItem("bihar_biz_user", JSON.stringify(res.user));

    setAuthErrorMessage("");
    setActiveScreen("app");
    setActiveTab("profile");

    showToast(res.message || "Login successful.");

    setNotifications((prev) => [
      `Logged in as ${res.user?.name || "User"}! Core panels active.`,
      ...prev,
    ]);
  } else {
    setAuthErrorMessage(res.message || "Login failed.");
    showToast(res.message || "Login failed.");
  }
};


const handleSaveBusinessBasic = async () => {
  const loggedUser =
    user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");

  if (!loggedUser?.id) {
    showToast("Please login first.");
    setActiveScreen("login");
    return;
  }

  if (
    !businessName.trim() ||
    !businessCategory.trim() ||
    !businessCity.trim() ||
    !businessPhone.trim() ||
    !businessAddress.trim()
  ) {
    showToast("Please fill all basic details.");
    return;
  }

  setLoading(true);

  const res = await ApiService.saveBusinessBasic(apiUrl, isLiveMode, {
    user_id: loggedUser.id,
    business_name: businessName.trim(),
    category: businessCategory.trim(),
    city: businessCity.trim(),
    phone: businessPhone.trim(),
    whatsapp: businessPhone.trim(),
    address: businessAddress.trim(),
  });

  setLoading(false);

  if (res.success) {
    const updatedUser = res.user || { ...loggedUser, role: "business_owner" };

    setUser(updatedUser);
    localStorage.setItem("bihar_biz_user", JSON.stringify(updatedUser));

    if (res.business) {
      const savedBusiness = {
        ...res.business,
        user_id: res.business.user_id || loggedUser.id,
        phone: res.business.phone || businessPhone.trim(),
        whatsapp: res.business.whatsapp || businessPhone.trim(),
        status: res.business.status || "approved",
        services: Array.isArray(res.business.services)
          ? res.business.services
          : res.business.services
          ? String(res.business.services).split(",").map((s: string) => s.trim())
          : [],
        reviews: res.business.reviews || [],
      };

      setMyBusiness(savedBusiness);
      localStorage.setItem("bb_business", JSON.stringify(savedBusiness));

      setBusinesses((prev: any[]) => {
        const exists = prev.some((b) => String(b.id) === String(savedBusiness.id));
        return exists
          ? prev.map((b) => String(b.id) === String(savedBusiness.id) ? savedBusiness : b)
          : [savedBusiness, ...prev];
      });

      setLatestBusinesses((prev: any[]) => {
        const exists = prev.some((b) => String(b.id) === String(savedBusiness.id));
        return exists
          ? prev.map((b) => String(b.id) === String(savedBusiness.id) ? savedBusiness : b)
          : [savedBusiness, ...prev];
      });
    }

    showToast(res.message || "Business basic info saved.");
    setActiveScreen("app");
    setActiveTab("profile");
  } else {
    showToast(res.message || "Business save failed.");
  }
};

const handleUpdateBusinessDescription = async () => {
  if (!myBusiness || !myBusiness.id) {
    showToast("Business not found.");
    return;
  }

  if (!businessDescription.trim()) {
    showToast("Please write business description.");
    return;
  }

  setLoading(true);

  const res = await ApiService.updateBusinessDescription(apiUrl, isLiveMode, {
    business_id: myBusiness.id,
    description: businessDescription.trim(),
    tags: businessTags.trim(),
  });

  setLoading(false);

  if (res.success) {
    const updatedBusiness = {
      ...myBusiness,
      ...(res.business || {}),
      profile_percentage: Math.max(myBusiness.profile_percentage || 45, 60),
    };

    setMyBusiness(updatedBusiness);
    localStorage.setItem("bb_business", JSON.stringify(updatedBusiness));

    showToast(res.message || "Description updated.");
    setActiveScreen("app");
    setActiveTab("profile");
  } else {
    showToast(res.message || "Update failed.");
  }
};

const handleUpdateBusinessMedia = async () => {
  if (!myBusiness || !myBusiness.id) {
    showToast("Business not found.");
    return;
  }

  const formData = new FormData();
  formData.append("business_id", String(myBusiness.id));
  formData.append("facebook_url", facebookUrl.trim());
  formData.append("instagram_url", instagramUrl.trim());
  formData.append("youtube_url", youtubeUrl.trim());

  if (coverImage) {
    formData.append("cover_image", coverImage);
  }

  if (galleryImages) {
    Array.from(galleryImages).forEach((file) => {
      formData.append("gallery_images[]", file);
    });
  }

  setLoading(true);

  const res = await ApiService.updateBusinessMedia(apiUrl, isLiveMode, formData);

  setLoading(false);

  if (res.success) {
    const updatedBusiness = {
      ...myBusiness,
      ...(res.business || {}),
      profile_percentage: Math.max(myBusiness.profile_percentage || 60, 80),
    };

    setMyBusiness(updatedBusiness);
    localStorage.setItem("bb_business", JSON.stringify(updatedBusiness));

    showToast(res.message || "Social & images updated.");
    setActiveScreen("app");
    setActiveTab("profile");
  } else {
    showToast(res.message || "Update failed.");
  }
};

  // User register handler
  // User register handler
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  setAuthErrorMessage("");

  if (!regName.trim() || !regMobile.trim() || !regPassword.trim()) {
    setAuthErrorMessage("Name, mobile and password required.");
    return;
  }

  setLoading(true);

  const res = await ApiService.registerUser(apiUrl, isLiveMode, {
    name: regName.trim(),
    mobile: regMobile.trim(),
    email: regEmail.trim(),
    password: regPassword.trim(),
  });

  setLoading(false);

  if (res.success && res.user) {
    setUser(res.user);
    localStorage.setItem("bihar_biz_user", JSON.stringify(res.user));

   showToast(res.message || "Registration successful.");


    setRegName("");
    setRegMobile("");
    setRegEmail("");
    setRegPassword("");

    setAuthErrorMessage("");
    setIsRegistering(false);
    setActiveScreen("app");
    setActiveTab("profile");

    setNotifications((prev) => [
      `Welcome to Bihar Business, ${res.user?.name || "User"}!`,
      ...prev,
    ]);
  } else {
    setAuthErrorMessage(res.message || "Registration failed.");
  }
};

  // Apply for job handler
  const handleJobApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert("Name and phone number compulsory.");
      
      return;
    }
    setApplySuccessAlert(true);
    setNotifications(prev => [`Application sent to ${applyJob?.company} for ${applyJob?.title}!`, ...prev]);
    setTimeout(() => {
      setApplySuccessAlert(false);
      setApplyJob(null);
      setApplicantName("");
      setApplicantPhone("");
      setApplicantMessage("");
    }, 2500);
  };

  // Toggle category helper
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(String(catId));
    setActiveTab("listings");
    setActiveScreen("app");
  };
const handleEditMyBusiness = (b: any) => {
  const selected = {
    ...b,
    profile_percentage: b.profile_percentage || b.profilePercentage || 30,
  };

  setMyBusiness(selected);
  localStorage.setItem("bb_business", JSON.stringify(selected));

  setBusinessName(b.name || "");
  setBusinessCategory(b.category || "");
  setBusinessCity(b.city || "");
  setBusinessPhone(b.phone || "");
  setBusinessAddress(b.address || "");

  setBusinessEmail(b.email || "");
  setBusinessWebsite(b.website || "");
  setBusinessMapLink(b.map_link || b.mapLink || "");

  setBusinessDescription(b.description || "");
  setBusinessTags(
    Array.isArray(b.services) ? b.services.join(", ") : b.services || ""
  );

  setFacebookUrl(b.facebook || b.facebook_url || "");
  setInstagramUrl(b.instagram || b.instagram_url || "");
  setYoutubeUrl(b.youtube || b.youtube_url || "");

  setBusinessOffers(b.offers || "");
  setOpeningHours(b.openingHours || b.opening_hours || "");

  setCoverImage(null);
  setGalleryImages(null);
  setMenuCard(null);

  showToast("Edit mode opened.");
  setActiveScreen("app");
  setActiveTab("profile");
};
const openJobApplyForm = () => {
  const loggedUser = user || JSON.parse(localStorage.getItem("bihar_biz_user") || "null");
  setApplyForm({
    name: loggedUser?.name || "",
    mobile: loggedUser?.mobile || loggedUser?.phone || "",
    email: loggedUser?.email || "",
    cover_note: "",
  });
  setResumeFile(null);
  setApplyMode(true);
};

const handleUpdateBusinessFinal = async () => {
  if (!myBusiness || !myBusiness.id) {
    showToast("Business not found.");
    return;
  }

  const formData = new FormData();
  formData.append("business_id", String(myBusiness.id));
  formData.append("offers", businessOffers.trim());
  formData.append("opening_hours", openingHours.trim());

  if (menuCard) {
    formData.append("menu_card", menuCard);
  }

  setLoading(true);
  const res = await ApiService.updateBusinessFinal(apiUrl, isLiveMode, formData);
  setLoading(false);

  if (res.success) {
    const updatedBusiness = {
      ...myBusiness,
      ...(res.business || {}),
      profile_percentage: 100,
    };

    setMyBusiness(updatedBusiness);
    localStorage.setItem("bb_business", JSON.stringify(updatedBusiness));
    showToast(res.message || "Business profile completed.");
    setActiveScreen("app");
    setActiveTab("profile");
  } else {
    showToast(res.message || "Update failed.");
  }
};



const jobBanners = [
  {
    title: "Bihar me Best Local Jobs",
    sub: "Patna, Chapra, Muzaffarpur aur nearby cities me verified openings.",
    tag: "Hiring Now",
    cta: "Apply Today",
    icon: Briefcase,
    bg: "from-[#ff6a00] via-[#ff9f1c] to-[#ffd166]",
  },
  {
    title: "Company Job Ad Promote Karein",
    sub: "Premium banner, highlighted job card aur direct candidate reach.",
    tag: "For Employers",
    cta: "Post Job Ad",
    icon: Megaphone,
    bg: "from-[#071126] via-[#12315f] to-[#3154d4]",
  },
  {
    title: "Freshers Ke Liye New Openings",
    sub: "Sales, Accounts, Office Staff, Delivery, Computer Operator jobs.",
    tag: "Freshers Welcome",
    cta: "Explore Jobs",
    icon: GraduationCap,
    bg: "from-[#00a676] via-[#00b4d8] to-[#90e0ef]",
  },
];

useEffect(() => {
  if (activeScreen !== "app" || activeTab !== "jobs" || jobDetailMode) return;
  const timer = window.setInterval(() => {
    setJobBannerIndex((prev) => (prev + 1) % jobBanners.length);
  }, 3000);
  return () => window.clearInterval(timer);
}, [activeScreen, activeTab, jobDetailMode]);


  const normalizePlanValue = (value: any) => String(value || "").toLowerCase().trim();

  const rawDetailPlan = normalizePlanValue(
    selectedBusiness?.app_plan?.type ||
    selectedBusiness?.payment_plan ||
    selectedBusiness?.plan ||
    selectedBusiness?.paymentPlan
  );

  const isDetailFeatured =
    rawDetailPlan === "featured" ||
    selectedBusiness?.featured === 1 ||
    selectedBusiness?.featured === true ||
    selectedBusiness?.isFeatured === true ||
    selectedBusiness?.app_plan?.type === "featured";

  const isDetailPremium =
    rawDetailPlan === "premium" ||
    selectedBusiness?.isPremium === true ||
    selectedBusiness?.app_plan?.type === "premium";

  const detailPlan = isDetailFeatured ? "featured" : isDetailPremium ? "premium" : "free";
  const isDetailUnlocked = isDetailPremium || isDetailFeatured;

  const detailPermissions = selectedBusiness ? getBusinessPermissions(selectedBusiness) : getBusinessPermissions({});
  const detailGalleryImages = selectedBusiness ? normalizeBusinessGallery(selectedBusiness) : [];

  const LockedFeatureCard = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div title="Ye Premium/Featured feature hai" className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl p-4 text-center cursor-help">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-2">
        <Lock className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-slate-800 text-xs">{title}</h4>
      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
    </div>
  );


  const PremiumLockOverlay = ({ label = "Premium Feature" }: { label?: string }) => (
    <div
      title="Ye Premium/Featured feature hai"
      className="absolute inset-0 z-10 bg-orange-50/45 backdrop-blur-[0.5px] flex flex-col items-center justify-center text-center p-3 rounded-xl border-2 border-dashed border-orange-300 cursor-help pointer-events-none shadow-inner"
    >
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2 shadow-sm border border-orange-200">
        <Lock className="w-5 h-5" />
      </div>
      <p className="text-sm font-black text-slate-900">{label} Locked</p>
      <p className="text-[10px] text-slate-600 mt-1">Hover/tap: ye Premium/Featured feature hai</p>
    </div>
  );

  return (
    <AndroidFrame
      onPhysicalBack={handlePhysicalBack}
      onPhysicalHome={handlePhysicalHome}
      onPhysicalPower={handlePhysicalHome}
      apiConnected={apiConnectionStatus === "connected"}
      isLiveMode={isLiveMode}
      language={language}
      setLanguage={setLanguage}
    >
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden select-none pt-[env(safe-area-inset-top)]">
         
{activeScreen === "business-final" && (
  <div className="absolute inset-0 z-40 flex flex-col overflow-y-auto bg-slate-50 pb-[calc(env(safe-area-inset-bottom)+80px)]">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button
        type="button"
        onClick={() => {
          setActiveScreen("app");
          setActiveTab("profile");
        }}
        className="p-1 hover:bg-slate-800 rounded-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h2 className="text-sm font-bold truncate flex-1">Menu, Offers & Hours</h2>
    </div>

    <div className="p-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-slate-900">Final Business Details</h2>
        <p className="text-xs text-slate-500 mt-1">Add menu card, offers and opening hours.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600">Menu Card / Rate Card</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setMenuCard(e.target.files?.[0] || null)}
              className="mt-2 w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm"
            />
          </div>

          <textarea
            value={businessOffers}
            onChange={(e) => setBusinessOffers(e.target.value)}
            placeholder="Current offers e.g. 20% off, Free consultation..."
            rows={4}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          />

          <input
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="Opening Hours e.g. Mon-Sat 10 AM - 8 PM"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleUpdateBusinessFinal}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Complete Business Profile"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{showAdvertiseScreen && (
  <div className="absolute inset-0 z-[9997] bg-slate-50 flex flex-col">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button
        type="button"
        onClick={() => {
          setShowAdvertiseScreen(false);
          setSelectedAdPlan(null);
        }}
        className="p-1 hover:bg-slate-800 rounded-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-black truncate">Advertise on BiharBusiness</h2>
        <p className="text-[10px] text-slate-300">Choose Featured or Premium plan</p>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 pb-8">
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-lg mb-4">
        <h3 className="text-xl font-black">Grow your local business</h3>
        <p className="text-xs text-slate-800/80 mt-1 leading-relaxed">
          Featured aur Premium plan se listing ko zyada visibility, leads aur trust milega.
        </p>
      </div>

      {adPlansLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-400">Loading plans...</div>
      ) : adPlans.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-400">No plans found.</div>
      ) : (
        <div className="space-y-4">
          {adPlans.map((plan: any, index: number) => (
            <div key={plan.type || plan.id || index} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-full">
                    {plan.badge || plan.type || "Plan"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-3">{plan.label || plan.name || "Business Plan"}</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900">₹{plan.price || 0}</p>
                  <p className="text-[11px] text-slate-500 font-bold">/ {plan.duration || "6 Month"}</p>
                </div>
              </div>

              {plan.description && (
                <p className="text-xs text-slate-500 leading-relaxed mt-3">{plan.description}</p>
              )}

              <div className="mt-4 space-y-2">
                {getPlanFeatures(plan).map((feature: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{String(feature)}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => startPlanPayment(plan)}
                disabled={paymentLoadingPlan === String(plan.type || plan.plan || plan.slug)}
                className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl shadow-sm disabled:opacity-60"
              >
                {paymentLoadingPlan === String(plan.type || plan.plan || plan.slug) ? "Processing..." : `Pay ₹${plan.price || 0}`}
              </button>

              <button
                type="button"
                onClick={() => setSelectedAdPlan(plan)}
                className="mt-2 w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 font-black py-2.5 rounded-2xl text-xs"
              >
                Contact Us
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

{selectedAdPlan && (
  <div className="absolute inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-end justify-center">
    <div className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">Contact for Advertisement</h3>
          <p className="text-xs text-slate-500 mt-1">{selectedAdPlan.label || selectedAdPlan.name} • ₹{selectedAdPlan.price || 0}</p>
        </div>
        <button type="button" onClick={() => setSelectedAdPlan(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black">×</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => openWhatsAppForPlan(selectedAdPlan)} className="bg-emerald-500 text-white rounded-2xl py-3 text-xs font-black flex flex-col items-center gap-1">
          <MessageSquare className="w-5 h-5" /> WhatsApp
        </button>
        <a href={`tel:${supportPhone}`} className="bg-orange-500 text-white rounded-2xl py-3 text-xs font-black flex flex-col items-center gap-1 text-center">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href={`mailto:${supportEmail}?subject=${encodeURIComponent("Advertisement Plan Enquiry")}`} className="bg-blue-500 text-white rounded-2xl py-3 text-xs font-black flex flex-col items-center gap-1 text-center">
          <Mail className="w-5 h-5" /> Email
        </a>
      </div>
    </div>
  </div>
)}

{enquiryBusiness && (
  <div className="absolute inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm flex items-end justify-center">
    <div className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">Get Enquiry</h3>
          <p className="text-xs text-slate-500 mt-1">
            {enquiryBusiness.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnquiryBusiness(null)}
          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black"
        >
          ×
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={enquiryName}
          onChange={(e) => setEnquiryName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none"
        />

        <input
          value={enquiryMobile}
          onChange={(e) => setEnquiryMobile(e.target.value)}
          placeholder="Mobile number"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none"
        />

        <textarea
          value={enquiryMessage}
          onChange={(e) => setEnquiryMessage(e.target.value)}
          placeholder="Message e.g. I want details about your service"
          rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
        />

        <button
          type="button"
          onClick={submitBusinessEnquiry}
          disabled={enquiryLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60"
        >
          {enquiryLoading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </div>
    </div>
  </div>
)}


{claimBusiness && (
  <div className="absolute inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm flex items-end justify-center">
    <div className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">Business Claim Karein</h3>
          <p className="text-xs text-slate-500 mt-1">{claimBusiness.name}</p>
        </div>
        <button type="button" onClick={() => setClaimBusiness(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black">×</button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <input value={claimForm.claimant_name} onChange={(e) => setClaimForm({...claimForm, claimant_name: e.target.value})} placeholder="Your name" className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none" />
        <input value={claimForm.mobile} onChange={(e) => setClaimForm({...claimForm, mobile: e.target.value})} placeholder="Mobile number" className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none" />
        <input value={claimForm.email} onChange={(e) => setClaimForm({...claimForm, email: e.target.value})} placeholder="Email optional" className="col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none" />
        <select value={claimForm.relation_type} onChange={(e) => setClaimForm({...claimForm, relation_type: e.target.value})} className="col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none">
          <option value="">Select Relation</option><option value="owner">Owner</option><option value="manager">Manager</option><option value="staff">Staff</option>
        </select>
        <textarea value={claimForm.message} onChange={(e) => setClaimForm({...claimForm, message: e.target.value})} placeholder="Message optional" rows={3} className="col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none" />
        <button type="button" onClick={submitClaimRequest} disabled={claimLoading} className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60">
          {claimLoading ? "Submitting..." : "Submit Claim Request"}
        </button>
      </div>
    </div>
  </div>
)}

{toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-bold max-w-[85%] text-center">
          {toastMessage}
        </div>
      )}
        {/* APP NOTIFICATION HUD INDICATOR */}
        <div className="absolute top-1.5 right-3 z-50 flex items-center gap-1.5">
          {/* <button 
            onClick={() => setShowNotificationList(!showNotificationList)}
            className="p-1.5 bg-orange-550 hover:bg-orange-600 border border-orange-400 text-white rounded-full shadow-md relative"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-[8px] text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button> */}
        </div>

        {/* NOTIFICATIONS CONTAINER POPUP */}
        {showNotificationList && (
          <div className="absolute top-10 right-4 left-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 z-50 shadow-2xl text-slate-100 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-orange-400" />
                {t.notifyTitle}
              </span>
              {/* <button 
                onClick={() => setShowNotificationList(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Close
              </button> */}
            </div>
            {notifications.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-4">No notifications yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {notifications.map((not, i) => (
                  <div key={i} className="text-[10px] border-b border-slate-800 pb-1 text-slate-200">
                    • {not}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-center text-[9px] text-orange-400 bg-orange-950/40 p-1.5 rounded">
              {t.notifyBanner}
            </div>
          </div>
        )}

        {/* SCREEN 1: SPLASH SCREEN WRAPPER */}
        <AnimatePresence>
          {activeScreen === "splash" && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-[#0F172A] z-50 flex flex-col items-center justify-center p-6 text-center select-none"
            >
              {/* Dynamic Logo Marker */}
              <div className="relative mb-6">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl border-t border-orange-300 overflow-hidden p-2">
              <img
                src={logo}
                alt="Bihar Business"
                className="w-full h-full object-contain"
              />
            </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-[#0F172A]">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {t.appName}
              </h1>
              
              <div className="h-0.5 w-16 bg-gradient-to-r from-orange-500 to-amber-500 my-4 rounded-full"></div>
              
              <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest px-2 leading-relaxed">
                {t.tagline}
              </p>

              <div className="absolute bottom-16 space-y-2">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                  <span className="text-xs text-slate-400 font-medium">Booting Bihar Network...</span>
                </div>
                <p className="text-[10px] text-slate-500">Play Store Verified Applet v3.0</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE SUB SCREEN 2: BUSINESS DETAIL SCREEN */}
        {activeScreen === "detail" && selectedBusiness && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-6 select-none bg-white">
            {/* Nav Header */}
            <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
              <button 
                onClick={() => setActiveScreen("app")} 
                className="p-1 hover:bg-slate-800 rounded-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate">{selectedBusiness.name}</h3>
                <p className="text-[10px] text-slate-300 font-semibold">{selectedBusiness.city}</p>
              </div>
              <div className="flex gap-2">
                {selectedBusiness.isVerified && (
                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {t.verified}
                  </span>
                )}
                {isDetailUnlocked ? (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    ⭐ {selectedBusiness.app_plan?.badge || (detailPlan === "featured" ? "Featured" : "Premium")}
                  </span>
                ) : (
                  <span className="bg-slate-700 text-slate-300 text-[9px] px-2 py-0.5 rounded">
                    Free
                  </span>
                )}
              </div>
            </div>

            {/* Business Hero Image */}
            <div className="h-44 w-full bg-slate-800 relative shrink-0">
              <img 
                src={selectedBusiness.imageUrl} 
                alt={selectedBusiness.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                    {selectedBusiness.category.replace("_", " ")}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5 leading-tight">{selectedBusiness.name}</h2>
                </div>
              </div>
            </div>

            {/* Core Stats Bar */}
            <div className="flex border-b border-slate-100 py-3 bg-slate-50 text-center text-xs text-slate-600">
              <div className="flex-1 border-r border-slate-150">
                <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{selectedBusiness.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400">{selectedBusiness.reviewCount} Reviews</span>
              </div>
              <div className="flex-grow border-r border-slate-150">
                <div className="text-emerald-600 font-bold">{selectedBusiness.status === "approved" ? "Active" : "Pending"}</div>
                <span className="text-[10px] text-slate-400">Status Verified</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-800 font-semibold">{detailPermissions.show_hours ? (selectedBusiness.openingHours || "Open").split(",")[0] : "Hidden"}</div>
                <span className="text-[10px] text-slate-400">Timing</span>
              </div>
            </div>

            {/* Verification Banner if pending */}
            {selectedBusiness.status === "pending" && (
              <div className="m-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs leading-relaxed">
                ⚠️ <strong>Approval Pending:</strong> This business has been added by the user and is waiting for administrator approval on www.biharbusiness.com before it goes 100% live.
              </div>
            )}

            {/* Claim Status Control - only on Detail Page */}
            {isBusinessUnclaimed(selectedBusiness) ? (
              <div className="m-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-amber-800 uppercase">Unclaimed Business</p>
                  <p className="text-xs text-slate-600 mt-1">Agar ye business aapka hai to yahin se claim request bhejein.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openClaimModal(selectedBusiness)}
                  className="shrink-0 bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-2 rounded-xl shadow-sm"
                >
                  Claim Now
                </button>
              </div>
            ) : (
              <div className="m-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-emerald-700 uppercase">Claimed by Owner</p>
                  <p className="text-xs text-slate-600 mt-1">Ye business owner ke control me hai.</p>
                </div>
              </div>
            )}

            {/* Offers/Promotions Section */}
            {detailPermissions.show_offers && selectedBusiness.offers && (
              <div className="m-3 p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg text-xs">
                <h4 className="font-bold text-orange-850 flex items-center gap-1">
                  <Sparkle className="w-4 h-4 text-orange-600" /> Special Deal Active:
                </h4>
                <p className="text-slate-700 mt-1">{selectedBusiness.offers}</p>
              </div>
            )}

            {/* PREMIUM DYNAMIC CONTACT LOCK SYSTEM */}
            <div className="p-4 space-y-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 text-sm uppercase tracking-wide">
                Contact & Address Coordinates
              </h3>

              {false ? (
                /* Free business lock overlay */
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-slate-200/80 rounded-full flex items-center justify-center text-slate-500 mx-auto mb-2">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">{t.freeLockTitle}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {t.freeLockText}
                  </p>
                  
                  {/* Whatsapp Trigger redirecting to Admin */}
                  <a 
                    href={`https://wa.me/917217754368?text=I%20want%2520to%2520unlock%2520or%2520upgrade%2520business%2520${encodeURIComponent(selectedBusiness.name)}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg px-3 py-1.5 mt-3 text-xs font-bold hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {t.freeLockBtn}
                  </a>
                  <p className="text-[10px] text-slate-400 mt-2.5">{t.freeLockOr}</p>
                </div>
              ) : (
                /* Unlocked list of details for Premium */
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold">TELEPHONE CONTACT</p>
                      <a href={`tel:${selectedBusiness.phone}`} className="font-semibold text-slate-800 hover:underline">{selectedBusiness.phone}</a>
                    </div>
                  </div>

                  {detailPermissions.show_whatsapp ? (
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold">WHATSAPP CHAT</p>
                      <a 
                        href={`https://wa.me/${selectedBusiness.whatsapp}?text=Hello%20found%20you%20on%2520Bihar%2520Business%2520app`} 
                        target="_blank" 
                        className="font-semibold text-slate-800 hover:underline"
                      >
                        {selectedBusiness.whatsapp}
                      </a>
                    </div>
                  </div>
                  ) : (
                    <LockedFeatureCard title="WhatsApp Hidden" subtitle="Premium/Featured business me WhatsApp chat show hoga." />
                  )}

                  {detailPermissions.show_email && selectedBusiness.email && (
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold">EMAIL ADDRESS</p>
                        <a href={`mailto:${selectedBusiness.email}`} className="font-semibold text-slate-800 hover:underline">{selectedBusiness.email}</a>
                      </div>
                    </div>
                  )}

                  {detailPermissions.show_website && selectedBusiness.website && (
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-100 text-slate-600 rounded">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold">WEBSITE</p>
                        <a href={selectedBusiness.website} target="_blank" className="font-semibold text-orange-600 hover:underline truncate max-w-[200px] block">{selectedBusiness.website}</a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Address details */}
              <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">SHOP ADDRESS / LANDMARK</p>
                  <p className="font-semibold text-slate-800 leading-relaxed mt-0.5">{selectedBusiness.address}</p>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 bg-white">
              <button
                type="button"
                onClick={() => openEnquiryModal(selectedBusiness)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Get Enquiry
              </button>
            </div>

           {/* Services provided */}
<div className="p-4 bg-slate-50 border-y border-slate-100">
  <h3 className="font-bold text-slate-900 pb-2 text-sm uppercase tracking-wide">
    Services & Products Offered
  </h3>

  <div className="flex flex-wrap gap-1.5">
    {(Array.isArray(selectedBusiness.services)
      ? selectedBusiness.services
      : selectedBusiness.services
      ? String(selectedBusiness.services).split(",").map((s: string) => s.trim()).filter(Boolean)
      : []
    ).map((ser, i) => (
      <span
        key={i}
        className="bg-white border border-slate-150 text-slate-700 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm"
      >
        <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
        {ser}
      </span>
    ))}
  </div>
</div>

{/* Description info */}
<div className="p-4 text-xs text-slate-600 bg-white">
  <h3 className="font-bold text-slate-900 pb-1.5 text-sm uppercase tracking-wide">
    About the Business
  </h3>

  <p className="leading-relaxed font-normal whitespace-pre-line text-slate-600">
    {selectedBusiness.show_full_description || "No description available."}
  </p>
</div>

            {/* Dynamic Simulated Google Map Placeholder with accurate details */}
            {detailPermissions.show_map ? (
            <div className="p-4 bg-white border-t border-slate-100">
              <h3 className="font-bold text-slate-900 pb-2 text-sm uppercase tracking-wide">
                Directions / Google Map Location
              </h3>
              <div className="relative h-40 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Visual grid looking like map */}
                <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                  {/* Map badge details */}
                  <div className="flex justify-between items-start">
                    <span className="bg-white border border-slate-200 shadow p-1 px-2 rounded-md text-[9px] font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> Map GPS Fixed
                    </span>
                    <span className="bg-slate-900 text-white rounded text-[8px] p-1 font-bold">Patna / {selectedBusiness.city}</span>
                  </div>
                  {/* Pin vector mockup */}
                  <div className="self-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-100 border border-orange-500 rounded-full animate-ping opacity-35 absolute"></div>
                    <MapPin className="w-10 h-10 text-orange-600 drop-shadow-lg animate-bounce" />
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium text-center bg-white/90 py-1.5 rounded-lg border border-slate-150">
                    {selectedBusiness.address.split(",")[0]}
                  </div>
                </div>
                
                {/* Active link triggers to native navigator mapping */}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.name + " " + selectedBusiness.city)}`}
                  target="_blank"
                  className="absolute bottom-2 right-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg flex items-center gap-1 z-10"
                >
                  <Globe className="w-3 h-3 text-orange-400" /> Open Map app
                </a>
              </div>
            </div>
            ) : (
              <div className="p-4 bg-white border-t border-slate-100">
                <LockedFeatureCard title="Map Location Hidden" subtitle="Google Map direction Premium/Featured business ke liye available hai." />
              </div>
            )}

            {/* Menu Cards and Image Gallery if available */}
            {selectedBusiness.menuCard && (Array.isArray(selectedBusiness.menuCard) ? selectedBusiness.menuCard.length > 0 : String(selectedBusiness.menuCard).length > 0) && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 pb-2 text-sm uppercase tracking-wide">
                  Menu & Pricing Catalog
                </h3>
                <div className="relative rounded-xl overflow-hidden min-h-[104px]">
                  <div className={`flex gap-2.5 overflow-x-auto pb-1 ${!detailPermissions.show_menu_card ? "blur-[1px] opacity-75 pointer-events-none" : ""}`}>
                    {(Array.isArray(selectedBusiness.menuCard) ? selectedBusiness.menuCard : [selectedBusiness.menuCard]).map((menuImg, idx) => (
                      <div key={idx} className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-150 cursor-pointer shadow-sm">
                        <img src={menuImg} alt="menu" className="w-full h-full object-cover hover:scale-115 transition-transform" />
                      </div>
                    ))}
                  </div>
                  {!detailPermissions.show_menu_card && <PremiumLockOverlay label="Menu & Pricing" />}
                </div>
              </div>
            )}


            {/* Business Gallery */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  Business Gallery
                </h3>
                <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">
                  {detailGalleryImages.length > 0 ? `${detailGalleryImages.length} Photos` : "Gallery 🔒"}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden min-h-[110px]">
                <div className={`grid grid-cols-3 gap-2 ${!detailPermissions.show_gallery ? "blur-[0.5px] opacity-90 pointer-events-none" : ""}`}>
                  {detailGalleryImages.length > 0 ? (
                    detailGalleryImages.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-150 shadow-sm"
                      >
                        <img
                          src={img}
                          alt={`Business gallery ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3].map((idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-orange-50 border border-orange-100 shadow-sm flex items-center justify-center text-orange-200">
                        <Camera className="w-7 h-7" />
                      </div>
                    ))
                  )}
                </div>
                {(!detailPermissions.show_gallery || detailGalleryImages.length === 0) && <PremiumLockOverlay label="Gallery" />}
              </div>
            </div>


            {/* Social Channels section */}
            {(selectedBusiness.facebook || selectedBusiness.instagram || selectedBusiness.youtube) && (
              <div className="relative p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Follow Shop:</span>
                <div className={`relative flex gap-3 text-slate-600 ${!detailPermissions.show_social_links ? "blur-[1px] opacity-75 pointer-events-none" : ""}`}>
                  {selectedBusiness.facebook && (
                    <a href={selectedBusiness.facebook} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                      <Facebook className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                  {selectedBusiness.instagram && (
                    <a href={selectedBusiness.instagram} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </a>
                  )}
                  {selectedBusiness.youtube && (
                    <a href={selectedBusiness.youtube} target="_blank" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                      <Youtube className="w-4 h-4 text-red-650" />
                    </a>
                  )}
                </div>
                {!detailPermissions.show_social_links && <PremiumLockOverlay label="Social Links" />}
              </div>
            )}

            {/* Add Review & Experience Rating forms */}
            <div className="p-4 bg-white border-t border-slate-100">
              <h3 className="font-bold text-slate-900 pb-3 text-sm uppercase tracking-wide flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                Submit Your Review
              </h3>
              <form onSubmit={handleAddReview} className="space-y-3.5 text-xs text-slate-700 bg-slate-50 border border-slate-150 p-3.5 rounded-xl">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">YOUR FULL NAME</label>
                  <input 
                    type="text" 
                    value={reviewAuthor} 
                    onChange={(e) => setReviewAuthor(e.target.value)} 
                    placeholder="Enter your name" 
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">RATING (1-5 STARS)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button 
                        key={stars} 
                        type="button" 
                        onClick={() => setReviewRating(stars)}
                        className={`p-1.5 rounded-md ${reviewRating >= stars ? 'text-amber-500' : 'text-slate-350'}`}
                      >
                        <Star className={`w-6 h-6 ${reviewRating >= stars ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">YOUR MESSAGE OR COMPLAINT</label>
                  <textarea 
                    rows={2} 
                    value={reviewComment} 
                    onChange={(e) => setReviewComment(e.target.value)} 
                    placeholder="How was your service experience with this provider?" 
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg resize-none"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold p-2.5 rounded-lg border border-slate-900"
                >
                  Write Review
                </button>
              </form>
            </div>
{selectedBusiness.reviews && selectedBusiness.reviews.length > 0 && (
  <div className="mt-5">
    <h3 className="text-lg font-black text-slate-900 mb-3">
      USER REVIEWS ({selectedBusiness.reviews.length})
    </h3>

    <div className="space-y-3">
      {selectedBusiness.reviews.map((review: any, index: number) => (
        <div
          key={review.id || index}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {review.name && review.name.trim() !== "" ? review.name : "Anonymous User"}
              </h4>

              <p className="text-xs text-slate-400 mt-0.5">
                {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
              </p>
            </div>

            <div className="flex items-center gap-1 text-orange-500 font-black text-sm">
              <Star className="w-4 h-4 fill-orange-500" />
              {review.rating}
            </div>
          </div>

          <p className="text-sm text-slate-700 mt-3 leading-relaxed">
            {review.review_text || review.comment || review.text || ""}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
            

            {/* SIMILAR BUSINESSES GRID */}
            <div className="p-4 bg-white border-t border-slate-100">
              <h3 className="font-bold text-slate-950 pb-3 text-sm uppercase tracking-wide">
                Similar Businesses Nearby
              </h3>
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {businesses
                  .filter(b => b.category === selectedBusiness.category && b.id !== selectedBusiness.id)
                  .map((b) => (
                    <div 
                      key={b.id} 
                      onClick={() => setSelectedBusiness(b)}
                      className="min-w-[150px] w-[150px] bg-slate-55 rounded-xl border border-slate-150 p-2 space-y-1.5 cursor-pointer shadow-sm flex flex-col shrink-0 text-xs overflow-hidden"
                    >
                      <img src={b.imageUrl} alt="img" className="w-full h-20 object-cover rounded-lg shrink-0" />
                      <h4 className="font-bold text-slate-850 truncate">{b.name}</h4>
                      <div className="flex items-center text-amber-500 font-bold gap-0.5"><Star className="w-3 h-3 fill-amber-500" />{b.rating}</div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* ACTIVE SUB SCREEN 3: ARTICLE DETAIL VIEW (SCHEMES) */}
        {activeScreen === "article-detail" && selectedArticle && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-6 bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
              <button onClick={() => setActiveScreen("app")} className="p-1 hover:bg-slate-800 rounded-lg">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h3 className="text-xs font-bold truncate flex-1">{selectedArticle.category}</h3>
              <span className="bg-orange-550 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedArticle.type}
              </span>
            </div>

            {/* Image banner */}
            <div className="h-40 bg-slate-800">
              <img src={selectedArticle.imageUrl} alt="banner" className="w-full h-full object-cover" />
            </div>

            {/* Content body */}
            <div className="p-4 space-y-3">
              <span className="text-[11px] text-slate-400 font-medium block">{selectedArticle.date}</span>
              <h2 className="text-lg font-black text-slate-900 leading-snug">{selectedArticle.title}</h2>
              <p className="text-xs text-orange-550 bg-orange-50 font-semibold p-3.5 rounded-lg border border-orange-100">
                {selectedArticle.summary}
              </p>
              
              <div className="h-px bg-slate-100 my-4"></div>
              
              {/* Splitting formatted text blocks */}
              <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {selectedArticle.sourceUrl && (
                <div className="pt-4 text-center">
                  <a 
                    href={selectedArticle.sourceUrl} 
                    target="_blank" 
                    className="inline-block bg-slate-900 hover:bg-slate-850 text-white text-[11px] font-bold p-2.5 px-4 rounded-lg shadow"
                  >
                    🚀 Visit Policy Portal Page
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NATIVE APP MULTI-TAB CONTROLLER */}
        {activeScreen === "app" && (
          <>
            {/* Standard Status Logo Title Header inside App (Except during active scroll view) */}
            <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between shadow-md shrink-0 select-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
              <img
                src={logo}
                alt="Bihar Business"
                className="w-full h-full object-contain"
              />
            </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight">{t.appName}</h1>
                  <p className="text-[9px] text-orange-400 font-bold uppercase tracking-wider -mt-0.5">
                    {language === "hi" ? "बिहार का अपना मंच" : "Bihar Ka Apna Platform"}
                  </p>
                </div>
              </div>

              {/* Lang switcher directly in top header for super easy access */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-600 rounded bg-gradient-to-r text-[10px] font-bold px-2 py-1 text-orange-400 capitalize cursor-pointer transition-all"
                >
                  {language === "en" ? "हिन्दी" : "English"}
                </button>
              </div>
            </div>

            {/* TAB PANES */}
            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* TAB 1: HOME PANEL */}
              {activeTab === "home" && (
                <div className="space-y-4 select-none">
                  
                  {/* PREMIUM COMPACT HOME SEARCH - logo duplicate nahi, search me logo nahi */}
                  <div className="bg-[#071225] text-white px-4 pt-3 pb-4 rounded-b-[26px] shadow-lg relative">
                    <div className="flex items-center justify-between gap-3">
                      {/* <div className="min-w-0">
                        <h2 className="text-[18px] font-black leading-tight truncate">{t.appName}</h2>
                        <p className="text-[10px] text-orange-400 font-black uppercase tracking-wider mt-0.5">
                          {language === "hi" ? "बिहार का अपना प्लेटफॉर्म" : "Bihar Ka Apna Platform"}
                        </p>
                      </div> */}
                      {/* <button
                        type="button"
                        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                        className="shrink-0 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-orange-400 font-black text-xs"
                      >
                        {language === "en" ? "हिन्दी" : "English"}
                      </button> */}
                    </div>

                    {/* Integrated Quick Search Input */}
                    <div className="mt-3 h-12 relative max-w-sm mx-auto shadow-lg rounded-2xl overflow-hidden bg-white text-slate-800 flex items-center px-3 border border-white/10">
                      <SearchIcon className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setActiveTab("listings")}
                        className="w-full text-xs px-2.5 py-2 focus:outline-none font-semibold bg-transparent"
                      />
                      <Settings className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    </div>

                    {/* Quick City selector capsules */}
                    <div className="flex gap-1.4 mt-3 overflow-x-auto scrollbar-hide pb-0.5">
                      {cities.slice(0, 7).map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setActiveTab("listings");
                          }}
                          className={`shrink-0 text-[9px] font-black py-1.5 px-3 rounded-full transition-all cursor-pointer border ${
                            selectedCity === city 
                              ? "bg-orange-500 text-white border-orange-500 shadow" 
                              : "bg-white/5 text-slate-200 border-white/15"
                          }`}
                        >
                          {city === "All Cities" ? t.allCities : city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MODERN HERO SLIDER */}
                  <div className="mx-4 mt-3">
                    <div className="relative h-[148px] rounded-[28px] overflow-hidden bg-slate-900 shadow-lg border border-orange-100">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={getAppBannerList("home").length ? `home-api-${appBannerIndexes.home}` : heroSlideIndex}
                          src={getAppBannerList("home").length ? normalizeAppBannerImage(getAppBannerList("home")[Number(appBannerIndexes.home || 0) % getAppBannerList("home").length]) : heroSlides[heroSlideIndex]}
                          alt="Bihar Business Promotion"
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/55 to-transparent pointer-events-none" />

                      <button
                        type="button"
                        onClick={() => {
                          setMyBusiness(null);
                          localStorage.removeItem("bb_business");
                          setBusinessName("");
                          setBusinessCategory("");
                          setBusinessCity("");
                          setBusinessPhone("");
                          setBusinessAddress("");
                          setBusinessEmail("");
                          setBusinessWebsite("");
                          setBusinessMapLink("");
                          setBusinessDescription("");
                          setBusinessTags("");
                          setFacebookUrl("");
                          setInstagramUrl("");
                          setYoutubeUrl("");
                          setBusinessOffers("");
                          setOpeningHours("");
                          setCoverImage(null);
                          setGalleryImages(null);
                          setMenuCard(null);
                          setActiveScreen("add-business");
                        }}
                        className="absolute left-3 bottom-3 bg-slate-950/95 hover:bg-slate-900 text-white font-black text-[10px] py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/10"
                      >
                        <Plus className="w-3.5 h-3.5 text-orange-400" />
                        {t.listNowBtn}
                      </button>

                      <div className="absolute right-3 bottom-4 flex items-center gap-1.5">
                        {heroSlides.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setHeroSlideIndex(i)}
                            className={`h-1.5 rounded-full transition-all ${i === heroSlideIndex ? "w-5 bg-orange-500" : "w-1.5 bg-white/70"}`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>


                  {/* LOADING SIMMER OR COMPLETED LOAD SLIDER FOR FEATURED BUSINESSES */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-4">
                      <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase">
                        ⭐ {t.featuredListings}
                      </h3>
                      <button onClick={() => { setSelectedCategory(""); setActiveTab("listings"); }} className="text-[10px] font-bold text-orange-600 hover:underline">
                        View All
                      </button>
                    </div>

                    {loading ? (
                      <ShimmerFeaturedSlider />
                    ) : featuredBusinesses.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic px-4">No premium listings active today.</p>
                    ) : (
                      <div className="flex gap-4 overflow-x-auto px-4 pb-1.5 scrollbar-hide">
                        {featuredBusinesses.map((b) => (
                          <div 
                            key={b.id}
                            onClick={() => { setSelectedBusiness(b); setActiveScreen("detail"); }}
                            className="min-w-[31%] w-[31%] bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0 cursor-pointer transform hover:scale-101 active:scale-99 transition-all"
                          >
                            <div className="h-20 bg-slate-100 relative shrink-0">
                              <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-slate-900/95 text-[8px] font-black text-orange-400 tracking-wider p-0.5 px-2 rounded-full flex items-center justify-center gap-0.5 shadow border border-slate-700">
                                <Sparkles className="w-2 h-2 text-orange-400" /> Premium
                              </div>
                              <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Verified
                              </div>
                            </div>
                            <div className="p-2 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-extrabold text-slate-850 truncate text-[11px]">{b.name}</h4>
                                <p className="text-[10px] text-slate-450 font-semibold flex items-center gap-0.5 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {b.address.split(",")[0]}, {b.city}
                                </p>
                              </div>
                              <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 text-[10px]">
                                <span className="text-orange-600 font-bold capitalize">{b.category.replace("_", " ")}</span>
                                <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-transparent" /> {b.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                    )}
                    
                  </div>

                  {/* PREMIUM CATEGORY UNIVERSE - CREATIVE DISCOVERY PANEL */}
                  <div className="px-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                          <Grid className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-black tracking-[0.12em] text-slate-900 uppercase leading-none">
                            {t.categories}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 truncate">
                            Find shops, doctors, salons & services near you
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("category")}
                        className="px-3 py-1.5 rounded-full border border-orange-200 bg-white text-orange-600 text-[10px] font-black shadow-sm"
                      >
                        View All ›
                      </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-white via-white to-orange-50/80 shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-3.5">
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-200/30 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-12 -left-10 w-28 h-28 bg-amber-200/25 rounded-full blur-2xl"></div>

                      <div className="relative grid grid-cols-2 gap-2.5 mb-3">
                        {categories.slice(0, 2).map((cat, index) => {
                          const catValue = String(getCategoryValue(cat));
                          const catCount = getCategoryCount(cat);
                          return (
                            <button
                              key={catValue}
                              type="button"
                              onClick={() => handleCategorySelect(catValue)}
                              className={`text-left rounded-3xl p-3 min-h-[92px] overflow-hidden relative shadow-sm border transition-all active:scale-[0.98] ${
                                index === 0
                                  ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700"
                                  : "bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-300"
                              }`}
                            >
                              <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-white/10"></div>
                              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-2">
                                <CategoryIcon iconName={getCategoryIconName(cat)} className="w-5 h-5 text-white" />
                              </div>
                              <h4 className="font-black text-sm leading-tight truncate">
                                {language === "en" ? cat.nameEn : cat.nameHi}
                              </h4>
                              <p className="text-[10px] font-bold text-white/75 mt-1">
                                {catCount} {language === "en" ? "listings" : "लिस्टिंग"} • Explore →
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative grid grid-cols-4 gap-2">
                        {categories.slice(2, 10).map((cat) => {
                          const catValue = String(getCategoryValue(cat));
                          const catCount = getCategoryCount(cat);
                          return (
                            <button
                              key={catValue}
                              type="button"
                              onClick={() => handleCategorySelect(catValue)}
                              className="group bg-white/85 border border-slate-100 rounded-2xl p-2 text-center shadow-sm hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-[0.97]"
                            >
                              <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-50 group-hover:bg-white text-slate-900 group-hover:text-orange-600 flex items-center justify-center shadow-inner border border-slate-100">
                                <CategoryIcon iconName={getCategoryIconName(cat)} className="w-5 h-5" />
                              </div>
                              <span className="block text-[9px] font-black text-slate-700 leading-tight mt-1.5 truncate">
                                {language === "en" ? cat.nameEn : cat.nameHi}
                              </span>
                              <span className="inline-block mt-1 text-[8px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">
                                {catCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* LISTINGS PANEL 2: NEWLY ENLISTED SHOPS - PREMIUM COMPACT UI */}
                  <div className="px-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-black tracking-[0.12em] text-slate-900 uppercase leading-none">
                            {t.latestListings}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">Discover latest businesses in your city</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("");
                          setActiveTab("listings");
                        }}
                        className="px-3 py-1.5 rounded-full border border-orange-200 bg-white text-orange-600 text-[10px] font-black shadow-sm"
                      >
                        View All ›
                      </button>
                    </div>

                    {loading ? (
                      <div className="space-y-2">
                        <ShimmerBusinessCard />
                        <ShimmerBusinessCard />
                      </div>
                    ) : latestBusinesses.length === 0 ? (
                      <p className="text-xs text-slate-400 bg-white rounded-2xl border border-slate-100 p-4 text-center">No stores listed yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {latestBusinesses.slice(0, 4).map((b) => {
                          const ratingValue = Number(b.rating || 0);
                          const reviewCount = b.review_count || b.reviewCount || b.total_reviews || 0;
                          const isVerifiedBusiness = b.isVerified || b.verified === 1 || b.verified === true || b.status === "active" || b.status === "approved";
                          const categoryLabel = String(b.category || "Other").replace("_", " ");
                          const cityLabel = b.city || "Bihar";
                          const bPerms = getBusinessPermissions(b);
                          const phone = getBusinessPhone(b);

                          return (
                            <div
                              key={b.id}
                              onClick={() => { setSelectedBusiness(b); setActiveScreen("detail"); }}
                              className="group bg-white border border-slate-100 rounded-[22px] p-2.5 flex gap-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)] transition-all cursor-pointer"
                            >
                              <div className="relative w-[92px] h-[78px] shrink-0 overflow-hidden rounded-[16px] bg-slate-100">
                                <img
                                  src={b.imageUrl}
                                  alt={b.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm">
                                  NEW
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h4 className="font-black text-slate-950 truncate text-[15px] leading-tight">{b.name}</h4>
                                    <p className="text-[11px] text-slate-500 font-semibold truncate mt-1 flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      {b.address}
                                    </p>
                                  </div>

                                  <span className="shrink-0 max-w-[92px] truncate text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full capitalize">
                                    {categoryLabel}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="flex items-center gap-1 text-orange-600 font-black text-[12px]">
                                      <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                                      {ratingValue.toFixed(1)}
                                    </span>
                                    <span className="w-px h-3 bg-slate-200"></span>
                                    <span className="text-[10px] text-slate-500 font-bold truncate">{reviewCount} reviews</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isVerifiedBusiness && (
                                      <span className="hidden min-[390px]:inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                                      </span>
                                    )}
                                    <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" /> {cityLabel}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                                {bPerms.show_phone && phone ? (
                                  <a
                                    href={`tel:${phone}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm"
                                    title="Call"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSelectedBusiness(normalizeBusinessForDetail(b)); setActiveScreen("detail"); }}
                                    className="w-8 h-8 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center shadow-sm"
                                    title="Call Locked"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-orange-600 flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                  ›
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {latestBusinesses.length > 4 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory("");
                              setActiveTab("listings");
                            }}
                            className="w-full mt-1 bg-white border border-orange-200 text-orange-600 rounded-2xl py-3 text-xs font-black shadow-sm"
                          >
                            Explore More Businesses ›
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* PREMIUM POPULAR SEARCHES */}
                  <section className="px-4 py-5 bg-slate-50">
                    <div className="flex items-end justify-between gap-3 mb-3">
                      <div>
                        <p className="text-orange-500 text-[10px] font-black tracking-[0.22em] uppercase mb-1">
                          Popular Searches
                        </p>
                        <h2 className="text-xl font-black text-slate-950 leading-tight">
                          Explore What People Search Most
                        </h2>
                      </div>
                      {popularSearches.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory("");
                            setSearchQuery("");
                            setActiveTab("listings");
                          }}
                          className="text-[11px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-2 rounded-full shrink-0"
                        >
                          View All ›
                        </button>
                      )}
                    </div>

                    {popularSearches.length === 0 ? (
                      <div className="bg-white rounded-3xl p-5 text-center border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-xs font-bold">No popular searches found.</p>
                      </div>
                    ) : (
                      <div className="bg-slate-950 rounded-[28px] p-4 shadow-xl shadow-slate-200 overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/25 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-8 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl" />

                        <div className="relative flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white text-sm font-black flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-orange-400" /> Trending in Bihar
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Quickly find high-demand services</p>
                          </div>
                          <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-orange-300">
                            <SearchIcon className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="relative grid grid-cols-2 gap-3">
                          {popularSearches.slice(0, 2).map((item, index) => (
                            <button
                              type="button"
                              key={item.id || item.title || index}
                              onClick={() => {
                                setSelectedCategory(item.category || item.title);
                                setSearchQuery("");
                                setSelectedCity("All Cities");
                                setActiveTab("listings");
                              }}
                              className="text-left rounded-3xl bg-white p-3 shadow-sm active:scale-[0.98] transition overflow-hidden"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-orange-200">
                                  <CategoryIcon iconName={item.icon || "Grid"} className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Top {index + 1}</span>
                              </div>
                              <h3 className="text-sm font-black text-slate-950 mt-3 leading-tight line-clamp-1">{item.title}</h3>
                              <p className="text-[10px] text-slate-500 font-bold mt-1">Explore trusted listings</p>
                              <p className="text-[11px] text-orange-600 font-black mt-3">Explore →</p>
                            </button>
                          ))}
                        </div>

                        {popularSearches.length > 2 && (
                          <div className="relative flex gap-2 overflow-x-auto scrollbar-hide pt-3 mt-1">
                            {popularSearches.slice(2, 8).map((item, index) => (
                              <button
                                type="button"
                                key={item.id || item.title || index}
                                onClick={() => {
                                  setSelectedCategory(item.category || item.title);
                                  setSearchQuery("");
                                  setSelectedCity("All Cities");
                                  setActiveTab("listings");
                                }}
                                className="shrink-0 bg-white/10 border border-white/10 text-white rounded-full px-3 py-2 text-[11px] font-black active:scale-[0.98] transition flex items-center gap-1.5"
                              >
                                <CategoryIcon iconName={item.icon || "Grid"} className="w-3.5 h-3.5 text-orange-300" />
                                {item.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </section>


                  {/* CATEGORY BUSINESS SECTIONS */}
                  {categorySections.length > 0 && (
                    <section className="px-4 py-4 bg-slate-50 space-y-5">
                      {categorySections.map((section: any, sectionIndex: number) => {
                        const items = Array.isArray(section.items) ? section.items.slice(0, 8) : [];
                        if (items.length === 0) return null;

                        return (
                          <div key={section.slug || section.title || sectionIndex}>
                            <div className="flex items-center justify-between mb-3">
                              <h2 className="text-lg font-black text-slate-950 tracking-tight">
                                {section.title || "Popular Category"}
                              </h2>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(section.slug || section.title || "");
                                  setSearchQuery("");
                                  setSelectedCity("All Cities");
                                  setActiveTab("listings");
                                }}
                                className="text-slate-500 font-black text-xl leading-none px-2"
                              >
                                ›
                              </button>
                            </div>

                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
                              {items.map((item: any, index: number) => {
                                const img = item.imageUrl || item.image || item.photo || item.cover_image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500&auto=format&fit=crop";

                                return (
                                  <button
                                    type="button"
                                    key={item.id || item.slug || item.name || index}
                                    onClick={() => {
                                      setSelectedBusiness({
                                        ...item,
                                        imageUrl: img,
                                        services: Array.isArray(item.services)
                                          ? item.services
                                          : item.services
                                          ? String(item.services).split(",").map((s: string) => s.trim()).filter(Boolean)
                                          : [],
                                        reviews: Array.isArray(item.reviews) ? item.reviews : [],
                                        status: item.status || "approved",
                                        rating: Number(item.rating || 0),
                                        reviewCount: Number(item.review_count || item.reviewCount || item.total_reviews || 0),
                                        isVerified: item.isVerified ?? item.verified ?? false,
                                      });
                                      setActiveScreen("detail");
                                    }}
                                    className="shrink-0 w-[112px] text-left active:scale-[0.98] transition"
                                  >
                                    <div className="w-[112px] h-[112px] rounded-2xl overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
                                      <img
                                        src={img}
                                        alt={item.name || section.title}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <h3 className="mt-2 text-[12px] font-black text-slate-900 leading-snug line-clamp-2">
                                      {item.name || item.title || section.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold line-clamp-1">
                                      {item.city || item.category || "Bihar"}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  )}

                  {/* OWNERSHIP CLAIM BANNER - BELOW CATEGORY SECTION */}
 <div className="px-4 pb-3 bg-slate-50">
  <button
    type="button"
    onClick={() => showToast("Business detail page par Unclaimed tag se claim karein.")}
    className="w-full rounded-[18px] overflow-hidden bg-white border border-green-100 shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
  >
    <img
      src={ownershipBanner}
      alt="Claim your listed business"
      className="w-full h-auto block"
    />
  </button>
</div>

                  {/* PREMIUM BIHAR TOURISM */}
                  {activeTab === "home" && (
                    <section className="px-4 py-5 bg-slate-50 pb-24">
                      <div className="flex items-end justify-between gap-3 mb-3">
                        <div>
                          <p className="text-orange-500 text-[10px] font-black tracking-[0.22em] uppercase mb-1">
                            Bihar Tourism
                          </p>
                          <h2 className="text-xl font-black text-slate-950 leading-tight">
                            Explore Tourist Places
                          </h2>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            Famous places, history aur travel guide.
                          </p>
                        </div>
                      </div>

                      {touristBlogs.length === 0 ? (
                        <div className="bg-white rounded-3xl p-5 text-center border border-slate-100 shadow-sm">
                          <p className="text-slate-500 text-xs font-bold">No tourist blogs found.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {touristBlogs[0] && (
                            <button
                              type="button"
                              onClick={() => window.open(touristBlogs[0].url, "_blank")}
                              className="w-full text-left bg-white rounded-[28px] overflow-hidden shadow-lg shadow-slate-200 border border-white active:scale-[0.99] transition"
                            >
                              <div className="h-40 bg-slate-200 relative overflow-hidden">
                                <img src={touristBlogs[0].imageUrl} alt={touristBlogs[0].title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-orange-600 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> Featured Guide
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="text-white text-lg font-black leading-tight line-clamp-2">{touristBlogs[0].title}</h3>
                                  <p className="text-white/80 text-[11px] mt-1 line-clamp-1">{touristBlogs[0].description}</p>
                                </div>
                              </div>
                              <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                                  <BookOpen className="w-4 h-4 text-orange-500" /> Bihar Travel Guide
                                </div>
                                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-[11px] font-black">Read Blog →</span>
                              </div>
                            </button>
                          )}

                          {touristBlogs.length > 1 && (
                            <div className="grid grid-cols-2 gap-3">
                              {touristBlogs.slice(1, 5).map((blog, index) => (
                                <button
                                  type="button"
                                  key={blog.id || blog.title || index}
                                  onClick={() => window.open(blog.url, "_blank")}
                                  className="text-left bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition"
                                >
                                  <div className="h-24 bg-slate-100 overflow-hidden">
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="p-3">
                                    <h3 className="text-xs font-black text-slate-950 leading-snug line-clamp-2 min-h-[32px]">{blog.title}</h3>
                                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed min-h-[28px]">{blog.description}</p>
                                    <p className="text-[10px] text-orange-600 font-black mt-2">Read →</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  )}



                </div>
              )}

              {/* TAB 2: PREMIUM CATEGORY DISCOVERY PAGE */}
              {activeTab === "category" && (
                <div className="px-4 space-y-4 pb-4">
                  <div className="relative overflow-hidden rounded-[28px] bg-slate-950 text-white p-4 mt-2 shadow-xl border border-slate-800">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/25 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -left-8 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black text-orange-300 uppercase tracking-[0.18em]">Discover Bihar</p>
                          <h2 className="text-2xl font-black leading-tight mt-1">{t.categories}</h2>
                          <p className="text-[11px] text-slate-300 mt-1">Find trusted shops, doctors, hotels & services faster.</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                          <Grid className="w-6 h-6 text-orange-300" />
                        </div>
                      </div>

                      <div className="mt-4 bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 flex items-center gap-2">
                        <SearchIcon className="w-4 h-4 text-slate-300" />
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setActiveTab("listings")}
                          placeholder="Search category or service..."
                          className="flex-1 bg-transparent outline-none text-xs font-bold placeholder:text-slate-400 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {(getAppBannerList("category").length > 0 || categoryPageBanners.length > 0) && (() => {
                    const apiList = getAppBannerList("category");
                    const banner = apiList.length ? apiList[Number(appBannerIndexes.category || 0) % apiList.length] : categoryPageBanners[categoryBannerIndex % categoryPageBanners.length];
                    const bannerImage = apiList.length ? normalizeAppBannerImage(banner) : getBusinessImage(banner);
                    return (
                      <div
                        onClick={() => {
                          if (getAppBannerList("category").length) {
                            openAppBanner(banner);
                          } else {
                            setSelectedBusiness(normalizeBusinessForDetail(banner));
                            setActiveScreen("detail");
                          }
                        }}
                        className="relative h-40 rounded-[28px] overflow-hidden shadow-lg border border-orange-100 cursor-pointer bg-slate-900"
                      >
                        <img src={bannerImage} alt={banner?.title || banner?.name || "Premium Business"} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase shadow">Premium Banner</div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white text-lg font-black leading-tight truncate">{banner?.title || banner?.name}</h3>
                          <p className="text-[11px] text-slate-200 font-semibold truncate">{banner?.subtitle || `${banner?.category || ""} • ${banner?.city || ""}`}</p>
                          <div className="mt-2 inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/15 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                            View Details →
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {["Popular", "Health", "Food", "Travel", "Home Repair", "Beauty"].map((chip) => (
                      <button key={chip} type="button" className="shrink-0 bg-white border border-slate-200 shadow-sm px-3 py-2 rounded-full text-[10px] font-black text-slate-700">
                        {chip}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Popular Categories</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">Most searched services</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {categories.slice(0, 4).map((cat) => {
                        const catValue = String(getCategoryValue(cat));
                        const catCount = getCategoryCount(cat);
                        return (
                          <button
                            key={`popular-${catValue}`}
                            type="button"
                            onClick={() => handleCategorySelect(catValue)}
                            className="text-left bg-gradient-to-br from-white to-orange-50 border border-orange-100 p-3.5 rounded-3xl shadow-sm active:scale-[0.98] transition"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-orange-300 flex items-center justify-center shadow-sm">
                              <CategoryIcon iconName={getCategoryIconName(cat)} className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-slate-900 text-xs mt-3 truncate">{language === "en" ? cat.nameEn : cat.nameHi}</h4>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">{catCount} listings</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-2">All Categories</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {categories.map((cat) => {
                        const catValue = String(getCategoryValue(cat));
                        const catCount = getCategoryCount(cat);
                        return (
                          <button
                            key={catValue}
                            type="button"
                            onClick={() => handleCategorySelect(catValue)}
                            className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-left flex items-center gap-2.5 cursor-pointer hover:border-orange-300 hover:bg-orange-50/60 transition-colors"
                          >
                            <div className="w-10 h-10 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0">
                              <CategoryIcon iconName={getCategoryIconName(cat)} className="w-5 h-5 text-[#0F172A]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-black text-slate-900 text-[11px] truncate">{language === "en" ? cat.nameEn : cat.nameHi}</h4>
                              <span className="text-[9px] font-bold text-slate-400">{catCount} Listed</span>
                            </div>
                            <span className="text-orange-500 font-black text-sm">→</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bb-business-faq-card bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                    <h2 className="text-base font-black text-slate-900">Frequently Asked Questions</h2>
                    {[
                      ["How do I find trusted businesses in Bihar?", "Use BiharBusiness to browse verified, claimed and premium listings by category and city."],
                      ["Can I list my business on BiharBusiness?", "Yes, you can add your business or claim an existing listing if it already exists on the platform."],
                      ["What is the benefit of Premium or Featured listing?", "Premium and Featured listings get more visibility, better contact options and stronger trust signals."],
                    ].map(([q, a]) => (
                      <div key={q} className="bb-faq-item bg-slate-50 border border-slate-100 rounded-2xl p-3">
                        <h3 className="text-xs font-black text-slate-900">{q}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-4 shadow-lg text-white space-y-3">
                    <div>
                      <h2 className="text-base font-black">Send Your Requirement</h2>
                      <p className="text-[11px] text-slate-300 mt-1">Name, mobile, city aur requirement bhejein.</p>
                    </div>
                    <input value={categoryEnquiryName} onChange={(e) => setCategoryEnquiryName(e.target.value)} placeholder="Name" className="w-full bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none placeholder:text-slate-400" />
                    <input value={categoryEnquiryMobile} onChange={(e) => setCategoryEnquiryMobile(e.target.value)} placeholder="Mobile" className="w-full bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none placeholder:text-slate-400" />
                    <select value={categoryEnquiryCity} onChange={(e) => setCategoryEnquiryCity(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none text-white">
                      <option value="" className="text-slate-900">Select City</option>
                      {cities.filter((city: string) => city && city !== "All Cities").map((city: string, index: number) => (
                        <option key={`${city}-${index}`} value={city} className="text-slate-900">{city}</option>
                      ))}
                    </select>
                    <select value={categoryEnquiryCategory} onChange={(e) => setCategoryEnquiryCategory(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none text-white">
                      <option value="" className="text-slate-900">Select Category</option>
                      {categories.map((cat: any, index: number) => {
                        const value = String(getCategoryValue(cat) || cat?.name || cat?.nameEn || index);
                        const label = cat?.nameEn || cat?.name || cat?.category || cat?.nameHi || value;
                        return <option key={`${value}-${index}`} value={value} className="text-slate-900">{label}</option>;
                      })}
                    </select>
                    <textarea value={categoryEnquiryRequirement} onChange={(e) => setCategoryEnquiryRequirement(e.target.value)} placeholder="Requirement" rows={3} className="w-full bg-white/10 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none resize-none placeholder:text-slate-400" />
                    <button type="button" onClick={submitCategoryEnquiry} disabled={categoryEnquiryLoading} className="w-full bg-orange-500 text-white font-black text-xs py-3 rounded-2xl disabled:opacity-60">{categoryEnquiryLoading ? "Submitting..." : "Submit Enquiry"}</button>
                  </div>

                  <div className="rounded-3xl overflow-hidden border border-orange-100 bg-white shadow-sm">
                    <img src={yojnaAd} alt="Bihar Yojna Portal" className="w-full h-auto object-cover" />
                  </div>
                </div>
              )}

              {/* TAB 3: SEARCH & BUSINESS LISTINGS PANEL */}
              {activeTab === "listings" && (
                <div className="px-4 space-y-3">
                  {/* Dynamic Filtering Panel */}
                  <div className="bg-white border border-slate-220 rounded-2xl p-3 shadow-sm space-y-2 mt-2">
                    <div className="flex gap-1.5">
                      {/* Search bar inside listing tab */}
                      <div className="relative flex-1 bg-slate-50 rounded-lg flex items-center p-1.5 px-3.5 border border-slate-200">
                        <SearchIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder={t.searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs ml-1 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* City list selection */}
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wide">{t.citySelect}</label>
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 p-2 rounded-lg font-semibold text-slate-750 text-[11px]"
                        >
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city === "All Cities" ? t.allCities : city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category Selection dropdown */}
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wide">{t.formCategory}</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 p-2 rounded-lg font-semibold text-slate-750 text-[11px] capitalize"
                        >
                          <option value="">{language === "en" ? "All Categories" : "सभी श्रेणियां"}</option>
                          {categories.map((cat) => (
                            <option key={String(getCategoryValue(cat))} value={String(getCategoryValue(cat))}>
                              {language === "en" ? cat.nameEn : cat.nameHi}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {(selectedCategory || selectedCity !== "All Cities" || searchQuery) && (
                      <div className="text-right">
                        <button
                          onClick={() => {
                            setSelectedCategory("");
                            setSelectedCity("All Cities");
                            setSearchQuery("");
                          }}
                          className="text-[9px] text-red-500 font-bold hover:underline"
                        >
                          [Reset Filters]
                        </button>
                      </div>
                    )}
                  </div>

                  {(getAppBannerList("search").length > 0 || searchSliderBusinesses.length > 0) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Sponsored Listings</h3>
                        <span className="text-[9px] font-bold text-orange-500">Premium / Featured</span>
                      </div>
                      <div className="overflow-hidden pb-1">
                        <div
                          className="flex gap-3 transition-transform duration-500 ease-out"
                          style={{ transform: `translateX(-${(getAppBannerList("search").length ? Number(appBannerIndexes.search || 0) : searchSliderIndex) * 89}%)` }}
                        >
                        {(getAppBannerList("search").length ? getAppBannerList("search") : searchSliderBusinesses).map((b: any) => {
                          const isApiBanner = !!getAppBannerList("search").length;
                          const img = isApiBanner ? normalizeAppBannerImage(b) : getBusinessImage(b);
                          const phone = getBusinessPhone(b);
                          const bPerms = getBusinessPermissions(b);
                          return (
                            <div
                              key={`search-banner-${b.id || b.business_id || b.title}`}
                              onClick={() => { isApiBanner ? openAppBanner(b) : (setSelectedBusiness(normalizeBusinessForDetail(b)), setActiveScreen("detail")); }}
                              className="min-w-[86%] h-[118px] rounded-3xl overflow-hidden relative bg-slate-900 shadow-md border border-white cursor-pointer"
                            >
                              <img src={img} alt={b.title || b.name || "Sponsored"} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
                              <div className="absolute left-4 top-4 right-24 text-white">
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">Sponsored</p>
                                <h3 className="text-[15px] font-black leading-tight truncate mt-1">{b.title || b.name}</h3>
                                <p className="text-[10px] opacity-90 truncate mt-1">{b.subtitle || `${b.category || ""} • ${b.city || ""}`}</p>
                              </div>
                              <a
                                href={!isApiBanner && bPerms.show_phone && phone ? `tel:${phone}` : "#"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isApiBanner) { e.preventDefault(); openAppBanner(b); return; }
                                  if (!bPerms.show_phone || !phone) {
                                    e.preventDefault();
                                    setSelectedBusiness(normalizeBusinessForDetail(b));
                                    setActiveScreen("detail");
                                  }
                                }}
                                className={`absolute right-3 bottom-3 rounded-full px-4 py-2 text-[10px] font-black shadow flex items-center gap-1 ${!isApiBanner && bPerms.show_phone && phone ? "bg-white text-slate-900" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
                              >
                                {!isApiBanner && bPerms.show_phone && phone ? <Phone className="w-3 h-3" /> : <Lock className="w-3 h-3" />} {isApiBanner ? (b.button_text || "View") : "Call"}
                              </a>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Search results found: {filteredBusinesses.length} shops
                    </span>
                  </div>

                  {/* Listings Grid */}
                  {loading ? (
                    <div className="space-y-2">
                      <ShimmerBusinessCard />
                      <ShimmerBusinessCard />
                      <ShimmerBusinessCard />
                    </div>
                  ) : filteredBusinesses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500 font-medium">{t.findNoResults}</p>
                      <button 
                        onClick={() => { setSelectedCategory(""); setSelectedCity("All Cities"); setSearchQuery(""); }}
                        className="mt-2 text-xs text-orange-600 font-black hover:underline"
                      >
                        Reset filters to see all listing.
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBusinesses.map((b) => (
                        <div 
                          key={b.id} 
                          className={`bg-white border rounded-2xl p-3.5 space-y-3 shadow-sm hover:shadow relative ${
                            b.isPremium ? "border-amber-200 bg-amber-50/10" : "border-slate-150"
                          }`}
                        >
                          <div 
                            onClick={() => { setSelectedBusiness(b); setActiveScreen("detail"); }}
                            className="flex gap-3 cursor-pointer"
                          >
                            <img src={b.imageUrl} alt={b.name} className="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0" />
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-extrabold text-slate-850 truncate text-[14px] leading-tight flex-1">{b.name}</h3>
                                {b.isVerified && (
                                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 border border-emerald-200 uppercase leading-none">
                                    {t.verified}
                                  </span>
                                )}
                                {isBusinessUnclaimed(b) && (
                                  <span className="bg-red-50 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 border border-red-200 uppercase leading-none">

            <div className="sticky bottom-0 left-0 right-0 min-h-[64px] pb-[max(env(safe-area-inset-bottom),10px)] bg-white border-t border-slate-200 flex items-center justify-around select-none z-50 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]">
              
              <button 
                onClick={() => { setActiveTab("home"); refreshAppData(); }}
                className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                  activeTab === "home" ? "text-orange-600" : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <Home className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-black tracking-wide shrink-0 block mt-0.5">{t.home}</span>
              </button>

              <button 
                onClick={() => setActiveTab("category")}
                className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                  activeTab === "category" ? "text-orange-600" : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <Grid className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-black tracking-wide shrink-0 block mt-0.5">{t.category}</span>
              </button>

              <button 
                onClick={() => setActiveTab("listings")}
                className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                  activeTab === "listings" ? "text-orange-600" : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <Search className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-black tracking-wide shrink-0 block mt-0.5">{t.listings}</span>
              </button>

              <button 
                onClick={() => setActiveTab("jobs")}
                className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                  activeTab === "jobs" ? "text-orange-600" : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <Briefcase className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-black tracking-wide shrink-0 block mt-0.5">{t.jobs}</span>
              </button>

              

              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                  activeTab === "profile" ? "text-orange-600" : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <User className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-black tracking-wide shrink-0 block mt-0.5">{t.profile}</span>
              </button>

            </div>
          </>
        )}

        {/* SCREEN 5: ADD BUSINESS FORM SCREEN */}
       {activeScreen === "add-business" && (
  <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button
        onClick={() => setActiveScreen("app")}
        className="p-1 hover:bg-slate-800 rounded-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h2 className="text-sm font-bold truncate flex-1">
        List Your Business
      </h2>
    </div>

    <div className="p-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-slate-900">
          Basic Business Details
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Sirf basic details fill karo. Baaki profile baad me complete kar sakte ho.
        </p>

        <div className="mt-5 space-y-4">
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Business Name"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <select
            value={businessCategory}
            onChange={(e) => setBusinessCategory(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          >
           <option value="">Select Category</option>

{categories.map((cat: any, index: number) => (
  <option key={cat.id || index} value={cat.nameEn || cat.name || cat}>
    {language === "hi"
      ? cat.nameHi || cat.nameEn || cat.name || cat
      : cat.nameEn || cat.name || cat}
  </option>
))}
          </select>

          <select
            value={businessCity}
            onChange={(e) => setBusinessCity(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          >
            <option value="">Select City</option>
            {cities.map((city: any, index: number) => (
              <option key={index} value={city.name || city}>
                {city.name || city}
              </option>
            ))}
          </select>

          <input
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value)}
            placeholder="Phone / WhatsApp"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <textarea
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder="Business Address"
            rows={3}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          />

          <button
            type="button"
            onClick={handleSaveBusinessBasic}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Basic Info"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{activeScreen === "business-contact" && (
  <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button
        onClick={() => setActiveScreen("app")}
        className="p-1 hover:bg-slate-800 rounded-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h2 className="text-sm font-bold truncate flex-1">
        Contact Info
      </h2>
    </div>

    <div className="p-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-slate-900">
          Update Contact Info
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Add email, website and Google map link.
        </p>

        <div className="mt-5 space-y-4">
          <input
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            placeholder="Business Email"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <input
            value={businessWebsite}
            onChange={(e) => setBusinessWebsite(e.target.value)}
            placeholder="Website URL"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <textarea
            value={businessMapLink}
            onChange={(e) => setBusinessMapLink(e.target.value)}
            placeholder="Google Map Link"
            rows={3}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          />

          <button
            type="button"
            onClick={handleUpdateBusinessContact}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{activeScreen === "business-description" && (
  <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button
        type="button"
        onClick={() => {
          setActiveScreen("app");
          setActiveTab("profile");
        }}
        className="p-1 hover:bg-slate-800 rounded-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h2 className="text-sm font-bold truncate flex-1">
        Business Description
      </h2>
    </div>

    <div className="p-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-slate-900">
          About Your Business
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Tell customers about your services.
        </p>

        <div className="mt-5 space-y-4">
          <textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder="Write about your business, services, speciality..."
            rows={5}
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          />

          <input
            value={businessTags}
            onChange={(e) => setBusinessTags(e.target.value)}
            placeholder="Tags e.g. salon, doctor, restaurant"
            className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
          />

          <button
            type="button"
            onClick={handleUpdateBusinessDescription}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Description"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}




{activeScreen === "business-media" && (
  <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
    <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow-md">
      <button type="button" onClick={() => { setActiveScreen("app"); setActiveTab("profile"); }} className="p-1 hover:bg-slate-800 rounded-lg">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h2 className="text-sm font-bold truncate flex-1">Social & Images</h2>
    </div>
    <div className="p-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-extrabold text-slate-900">Add Social Links & Photos</h2>
        <p className="text-xs text-slate-500 mt-1">Add social links and business photos.</p>
        <div className="mt-5 space-y-4">
          <input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="Facebook URL" className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none" />
          <input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="Instagram URL" className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none" />
          <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="YouTube URL" className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none" />
          <div>
            <label className="text-xs font-bold text-slate-600">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="mt-2 w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Gallery Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)} className="mt-2 w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
          </div>
          <button type="button" onClick={handleUpdateBusinessMedia} disabled={loading} className="w-full bg-orange-500 text-white font-extrabold py-3 rounded-2xl shadow-sm disabled:opacity-60">
            {loading ? "Saving..." : "Save Social & Images"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* SCREEN 6: ACCESS / SIGNIN & SIGNUP FORM SCREEN */}
        {activeScreen === "login" && (
          <div className="flex-1 flex flex-col justify-between bg-white text-xs select-none">
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-slate-900 text-white px-3 py-2.5 flex items-center gap-2.5 z-30 shadow">
                <button onClick={() => setActiveScreen("app")} className="p-1 hover:bg-slate-800 rounded-lg">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-sm font-bold truncate flex-1">
                  {isRegistering ? t.registerTitle : t.loginTitle}
                </h2>
              </div>

              {/* Form container info */}
              <div className="bg-slate-900 text-slate-100 p-6 text-center space-y-2 relative shadow-lg">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md bg-white p-2">
  <img
    src={logo}
    alt="Bihar Business"
    className="w-full h-full object-contain"
  />
</div>
                <h3 className="font-extrabold text-orange-400 uppercase tracking-widest">{t.appName}</h3>
                <p className="text-[10px] text-slate-350">{isRegistering ? t.registerSub : t.loginSub}</p>
              </div>

              {authErrorMessage && (
                <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-bold text-center">
                  ⚠️ {authErrorMessage}
                </div>
              )}

              {/* Login Form */}
              {!isRegistering ? (
                <form onSubmit={handleLogin} className="p-4 space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.mobilePhone}</label>
                    <input 
                      type="tel" 
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value)}
                      placeholder="Enter mobile number" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.passWord}</label>
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 text-white font-extrabold p-3 rounded-lg text-xs mt-3 cursor-pointer text-center"
                  >
                    {t.loginBtn}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => { setIsRegistering(true); setAuthErrorMessage(""); }}
                    className="w-full text-slate-500 text-center text-[11px] font-semibold hover:underline block pt-2"
                  >
                    {t.noAccount}
                  </button>
                  <div className="text-center mt-3">
  <a
    href="https://www.biharbusiness.com/forgot-password"
    target="_blank"
    rel="noopener noreferrer"
    className="text-orange-500 font-semibold text-xs"
  >
    Forgot Password?
  </a>
</div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="p-4 space-y-3.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.fullName}</label>
                    <input 
                      type="text" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.mobilePhone}</label>
                    <input 
                      type="tel" 
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="9988776655" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.formEmail}</label>
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@email.com (Optional)" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{t.passWord}</label>
                    <input 
                      type="password" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create secret code" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 text-white font-extrabold p-3 rounded-lg text-xs mt-3 cursor-pointer text-center"
                  >
                    {t.registerBtn}
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setIsRegistering(false); setAuthErrorMessage(""); }}
                    className="w-full text-slate-505 text-center text-[11px] font-semibold hover:underline block pt-2"
                  >
                    {t.hasAccount}
                  </button>
                </form>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 text-center p-3 border-t border-slate-100 bg-slate-50">
              Secured Connection • Bihar Business Auth Engine
            </p>
          </div>
        )}
        

        {/* REUSABLE ABSOLUTE MODAL: JOB APPLICATION DRAWER DETAILS */}
        {applyJob && (
          <div className="absolute inset-x-0 bottom-0 top-0 bg-slate-900/60 z-50 flex items-end select-none">
            <div className="bg-white rounded-t-[23px] p-5 w-full space-y-4 max-h-[80%] overflow-y-auto text-xs text-slate-700 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[10px] text-orange-550 font-black uppercase tracking-widest">{t.applyModalTitle}</span>
                <button 
                  onClick={() => setApplyJob(null)}
                  className="bg-slate-100 hover:bg-slate-200 font-bold text-slate-650 p-1.5 px-3 rounded-full"
                >
                  Close
                </button>
              </div>

              {applySuccessAlert ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-8 h-8 font-black animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0D9488] text-sm">Application Sent Successfully!</h3>
                    <p className="text-[10px] text-slate-502 mt-1">
                      {applyJob.company} coordinator has received your credentials. Wait for call instructions!
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleJobApplyForm} className="space-y-3 text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <h4 className="font-bold text-slate-850 truncate">{applyJob.title}</h4>
                    <p className="text-[10.5px] text-slate-450 mt-0.5">{applyJob.company} • 📍 {applyJob.city}</p>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">YOUR FULL NAME *</label>
                    <input 
                      type="text" 
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Niraj Singh" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-lg" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">YOUR MOBILE CONTACT *</label>
                    <input 
                      type="tel" 
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="9988776655" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-lg" 
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">BRIEF MOTIVATION/MESSAGE</label>
                    <textarea 
                      rows={2} 
                      value={applicantMessage}
                      onChange={(e) => setApplicantMessage(e.target.value)}
                      placeholder="Introduce your experience briefly..." 
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-lg resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold p-3 rounded-xl border border-slate-900 tracking-wide text-xs text-center"
                  >
                    Send Applications File
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </AndroidFrame>
  );
}
