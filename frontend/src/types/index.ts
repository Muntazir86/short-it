export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Url {
  id: string;
  userId?: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  isPrivate: boolean;
  clicks: number;
}

export interface Click {
  id: string;
  urlId: string;
  clickedAt: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  referrer?: string;
  browser?: string;
  deviceType?: string;
  os?: string;
}

export interface UrlAnalytics {
  totalClicks: number;
  clicksByDate: {
    date: string;
    count: number;
  }[];
  clicksByCountry: {
    country: string;
    count: number;
  }[];
  clicksByBrowser: {
    browser: string;
    count: number;
  }[];
  clicksByDevice: {
    deviceType: string;
    count: number;
  }[];
  clicksByReferrer: {
    referrer: string;
    count: number;
  }[];
}

export interface DashboardData {
  totalUrls: number;
  totalClicks: number;
  topUrls: {
    url: Url;
    clicks: number;
  }[];
  recentUrls: Url[];
  clicksOverTime: {
    date: string;
    count: number;
  }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
