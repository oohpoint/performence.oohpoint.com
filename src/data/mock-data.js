

// ---------- BRANDS ----------
export const mockBrands = [
    { id: "B001", name: "Zomato", category: "Food & Delivery", city: "Mumbai", status: "active", totalBudget: 500000, spent: 312000, activeCampaigns: 4, gst: "27AABCZ1234A1Z5", website: "zomato.com", pocName: "Rahul Mehta", pocEmail: "rahul@zomato.com", creditRisk: "low", createdAt: "2025-01-15" },
    { id: "B002", name: "Swiggy", category: "Food & Delivery", city: "Bangalore", status: "active", totalBudget: 450000, spent: 198000, activeCampaigns: 3, gst: "29AABCS5678B1Z3", website: "swiggy.com", pocName: "Priya Sharma", pocEmail: "priya@swiggy.com", creditRisk: "low", createdAt: "2025-02-01" },
    { id: "B003", name: "PhonePe", category: "Fintech", city: "Pune", status: "active", totalBudget: 800000, spent: 645000, activeCampaigns: 6, gst: "27AABCP9012C1Z1", website: "phonepe.com", pocName: "Amit Patel", pocEmail: "amit@phonepe.com", creditRisk: "medium", createdAt: "2025-01-20" },
    { id: "B004", name: "Myntra", category: "Fashion", city: "Bangalore", status: "pilot", totalBudget: 200000, spent: 45000, activeCampaigns: 1, gst: "29AABCM3456D1Z7", website: "myntra.com", pocName: "Sneha Rao", pocEmail: "sneha@myntra.com", creditRisk: "low", createdAt: "2025-03-10" },
    { id: "B005", name: "Cure.fit", category: "Health & Fitness", city: "Hyderabad", status: "suspended", totalBudget: 300000, spent: 290000, activeCampaigns: 0, gst: "36AABCC7890E1Z9", website: "cult.fit", pocName: "Vikram Singh", pocEmail: "vikram@curefit.com", creditRisk: "high", createdAt: "2024-11-05" },
    { id: "B006", name: "Urban Company", category: "Services", city: "Delhi", status: "active", totalBudget: 350000, spent: 120000, activeCampaigns: 2, gst: "07AABCU1234F1Z2", website: "urbancompany.com", pocName: "Neha Gupta", pocEmail: "neha@urbancompany.com", creditRisk: "low", createdAt: "2025-04-01" },
];

// ---------- CAMPAIGNS ----------
export const mockCampaigns = [
    { id: "C001", name: "Summer Food Fest", brandId: "B001", brandName: "Zomato", objective: "Brand Awareness", status: "active", totalBudget: 150000, spent: 98000, cpve: 15, engagementTarget: 10000, engagementsDelivered: 6533, startDate: "2026-01-15", endDate: "2026-03-15", locations: 12, riskScore: 18 },
    { id: "C002", name: "Dine Out Promo", brandId: "B001", brandName: "Zomato", objective: "Engagement", status: "active", totalBudget: 100000, spent: 72000, cpve: 12, engagementTarget: 8333, engagementsDelivered: 6000, startDate: "2026-02-01", endDate: "2026-03-01", locations: 8, riskScore: 22 },
    { id: "C003", name: "Quick Delivery Push", brandId: "B002", brandName: "Swiggy", objective: "App Install", status: "scheduled", totalBudget: 200000, spent: 0, cpve: 18, engagementTarget: 11111, engagementsDelivered: 0, startDate: "2026-03-01", endDate: "2026-04-30", locations: 15, riskScore: 5 },
    { id: "C004", name: "UPI Rewards Wave", brandId: "B003", brandName: "PhonePe", objective: "Transaction", status: "active", totalBudget: 250000, spent: 195000, cpve: 20, engagementTarget: 12500, engagementsDelivered: 9750, startDate: "2026-01-01", endDate: "2026-02-28", locations: 20, riskScore: 35 },
    { id: "C005", name: "Fashion Week Teaser", brandId: "B004", brandName: "Myntra", objective: "Brand Awareness", status: "draft", totalBudget: 80000, spent: 0, cpve: 10, engagementTarget: 8000, engagementsDelivered: 0, startDate: "2026-04-01", endDate: "2026-04-30", locations: 5, riskScore: 0 },
    { id: "C006", name: "Fitness Challenge", brandId: "B005", brandName: "Cure.fit", objective: "Engagement", status: "paused", totalBudget: 120000, spent: 115000, cpve: 14, engagementTarget: 8571, engagementsDelivered: 8214, startDate: "2025-12-01", endDate: "2026-02-28", locations: 10, riskScore: 72 },
    { id: "C007", name: "Home Services Blitz", brandId: "B006", brandName: "Urban Company", objective: "Lead Gen", status: "active", totalBudget: 180000, spent: 65000, cpve: 16, engagementTarget: 11250, engagementsDelivered: 4062, startDate: "2026-02-01", endDate: "2026-04-30", locations: 14, riskScore: 12 },
    { id: "C008", name: "Cashback Carnival", brandId: "B003", brandName: "PhonePe", objective: "Transaction", status: "completed", totalBudget: 300000, spent: 298500, cpve: 22, engagementTarget: 13636, engagementsDelivered: 13568, startDate: "2025-10-01", endDate: "2025-12-31", locations: 25, riskScore: 8 },
];

// ---------- LOCATIONS ----------
export const mockLocations = [
    { id: "L001", name: "Phoenix Marketcity", type: "mall", city: "Mumbai", dailyReach: 12000, engagementRate: 4.2, activeCampaigns: 5, capacity: 8, riskScore: 12, vendor: "MallConnect Pvt Ltd" },
    { id: "L002", name: "IIT Bombay Campus", type: "campus", city: "Mumbai", dailyReach: 8000, engagementRate: 7.8, activeCampaigns: 3, capacity: 6, riskScore: 5, vendor: "CampusReach Inc" },
    { id: "L003", name: "Koramangala Third Wave", type: "cafe", city: "Bangalore", dailyReach: 1500, engagementRate: 6.1, activeCampaigns: 2, capacity: 4, riskScore: 8, vendor: "CafeAds Solutions" },
    { id: "L004", name: "Cult.fit HSR Layout", type: "gym", city: "Bangalore", dailyReach: 2000, engagementRate: 9.2, activeCampaigns: 4, capacity: 5, riskScore: 15, vendor: "FitSpace Media" },
    { id: "L005", name: "WeWork Cyber Hub", type: "coworking", city: "Gurugram", dailyReach: 3500, engagementRate: 5.5, activeCampaigns: 3, capacity: 6, riskScore: 10, vendor: "CoWork Ads" },
    { id: "L006", name: "Connaught Place Hub", type: "restaurant", city: "Delhi", dailyReach: 9500, engagementRate: 3.8, activeCampaigns: 6, capacity: 7, riskScore: 28, vendor: "DineMedia" },
    { id: "L007", name: "BITS Pilani Campus", type: "campus", city: "Pilani", dailyReach: 5000, engagementRate: 8.5, activeCampaigns: 2, capacity: 5, riskScore: 3, vendor: "CampusReach Inc" },
    { id: "L008", name: "Inorbit Mall", type: "mall", city: "Hyderabad", dailyReach: 10000, engagementRate: 4.8, activeCampaigns: 4, capacity: 7, riskScore: 18, vendor: "MallConnect Pvt Ltd" },
];

// ---------- ALERTS ----------
export const mockAlerts = [
    { id: "A001", type: "fraud", severity: "critical", message: "Anomalous engagement spike detected at Phoenix Marketcity — 340% above baseline", timestamp: "2026-02-16T09:12:00Z", resolved: false },
    { id: "A002", type: "budget", severity: "high", message: "PhonePe UPI Rewards Wave at 92% budget utilization — auto-pause threshold approaching", timestamp: "2026-02-16T08:45:00Z", resolved: false },
    { id: "A003", type: "overload", severity: "medium", message: "Connaught Place Hub at 86% campaign capacity — slot conflict risk", timestamp: "2026-02-16T07:30:00Z", resolved: false },
    { id: "A004", type: "anomaly", severity: "high", message: "Impossible travel detected: User U4521 engaged at Mumbai & Delhi within 12 minutes", timestamp: "2026-02-16T06:18:00Z", resolved: true },
    { id: "A005", type: "fraud", severity: "medium", message: "Mock location signature detected on 8 devices at IIT Bombay Campus", timestamp: "2026-02-15T22:40:00Z", resolved: false },
    { id: "A006", type: "budget", severity: "low", message: "Cure.fit Fitness Challenge exceeded daily budget cap — sessions completing under grace buffer", timestamp: "2026-02-15T20:10:00Z", resolved: true },
];

// ---------- ENGAGEMENT METRICS (last 14 days) ----------
export const mockEngagementMetrics = [
    { date: "Feb 03", engagements: 1850, spend: 28200, fraudBlocked: 32 },
    { date: "Feb 04", engagements: 2100, spend: 31500, fraudBlocked: 18 },
    { date: "Feb 05", engagements: 1920, spend: 29400, fraudBlocked: 45 },
    { date: "Feb 06", engagements: 2450, spend: 37800, fraudBlocked: 22 },
    { date: "Feb 07", engagements: 2680, spend: 41200, fraudBlocked: 12 },
    { date: "Feb 08", engagements: 2200, spend: 33600, fraudBlocked: 28 },
    { date: "Feb 09", engagements: 1950, spend: 30100, fraudBlocked: 55 },
    { date: "Feb 10", engagements: 2780, spend: 42500, fraudBlocked: 15 },
    { date: "Feb 11", engagements: 3100, spend: 47800, fraudBlocked: 8 },
    { date: "Feb 12", engagements: 2900, spend: 44200, fraudBlocked: 38 },
    { date: "Feb 13", engagements: 3250, spend: 49800, fraudBlocked: 20 },
    { date: "Feb 14", engagements: 3500, spend: 53200, fraudBlocked: 42 },
    { date: "Feb 15", engagements: 3100, spend: 47500, fraudBlocked: 65 },
    { date: "Feb 16", engagements: 1800, spend: 27600, fraudBlocked: 30 },
];



export const mockRewardTiers = [
    { id: "RT1", tier: 1, label: "Bronze", probability: 50, creditValue: 5, maxWinners: 5000, winnersSoFar: 3420, totalCost: 17100 },
    { id: "RT2", tier: 2, label: "Silver", probability: 30, creditValue: 15, maxWinners: 3000, winnersSoFar: 1890, totalCost: 28350 },
    { id: "RT3", tier: 3, label: "Gold", probability: 15, creditValue: 50, maxWinners: 1500, winnersSoFar: 812, totalCost: 40600 },
    { id: "RT4", tier: 4, label: "Platinum", probability: 5, creditValue: 200, maxWinners: 500, winnersSoFar: 148, totalCost: 29600 },
];

export const mockRewardPool = {
    totalPool: 150000,
    distributed: 115650,
    remaining: 34350,
    avgReward: 18.42,
    burnRate: 77.1,
    dailyCap: 8500,
    graceBufferPct: 5,
    engagementTarget: 10000,
    cpve: 15,
};

export const mockRewardLedger = [
    { id: "RL001", userId: "U1001", userName: "Arjun Verma", tier: 1, creditAwarded: 5, couponCode: "BRZ-8A12", location: "Phoenix Marketcity", timestamp: "2026-02-16T09:45:00Z", redeemed: true, fraudScore: 4, status: "redeemed" },
    { id: "RL002", userId: "U1002", userName: "Priya Nair", tier: 2, creditAwarded: 15, couponCode: "SLV-3K89", location: "IIT Bombay Campus", timestamp: "2026-02-16T09:32:00Z", redeemed: false, fraudScore: 8, status: "awarded" },
    { id: "RL003", userId: "U1003", userName: "Rahul Desai", tier: 3, creditAwarded: 50, couponCode: "GLD-7F21", location: "Koramangala Third Wave", timestamp: "2026-02-16T09:18:00Z", redeemed: true, fraudScore: 2, status: "redeemed" },
    { id: "RL004", userId: "U1004", userName: "Sneha Kapoor", tier: 1, creditAwarded: 5, couponCode: "BRZ-2D45", location: "WeWork Cyber Hub", timestamp: "2026-02-16T08:55:00Z", redeemed: false, fraudScore: 62, status: "blocked" },
    { id: "RL005", userId: "U1005", userName: "Vikram Joshi", tier: 4, creditAwarded: 200, couponCode: "PLT-1A03", location: "Cult.fit HSR Layout", timestamp: "2026-02-16T08:40:00Z", redeemed: false, fraudScore: 5, status: "awarded" },
    { id: "RL006", userId: "U1006", userName: "Meera Shah", tier: 2, creditAwarded: 15, couponCode: "SLV-9B77", location: "Connaught Place Hub", timestamp: "2026-02-16T08:22:00Z", redeemed: true, fraudScore: 3, status: "redeemed" },
    { id: "RL007", userId: "U1007", userName: "Aditya Rao", tier: 1, creditAwarded: 5, couponCode: null, location: "Inorbit Mall", timestamp: "2026-02-16T08:10:00Z", redeemed: false, fraudScore: 15, status: "expired" },
    { id: "RL008", userId: "U1008", userName: "Kavitha S", tier: 3, creditAwarded: 50, couponCode: "GLD-4E56", location: "BITS Pilani Campus", timestamp: "2026-02-15T22:30:00Z", redeemed: true, fraudScore: 1, status: "redeemed" },
    { id: "RL009", userId: "U1009", userName: "Rohit Malhotra", tier: 1, creditAwarded: 5, couponCode: "BRZ-6C33", location: "Phoenix Marketcity", timestamp: "2026-02-15T21:15:00Z", redeemed: false, fraudScore: 7, status: "awarded" },
    { id: "RL010", userId: "U1010", userName: "Ananya Gupta", tier: 2, creditAwarded: 15, couponCode: "SLV-5H91", location: "IIT Bombay Campus", timestamp: "2026-02-15T20:45:00Z", redeemed: false, fraudScore: 45, status: "blocked" },
];

export const mockCouponInventory = [
    { id: "CP001", couponCode: "BRZ-8A12", tier: 1, expiry: "2026-04-30", status: "redeemed", assignedTo: "U1001", assignedAt: "2026-02-16T09:45:00Z" },
    { id: "CP002", couponCode: "SLV-3K89", tier: 2, expiry: "2026-04-30", status: "assigned", assignedTo: "U1002", assignedAt: "2026-02-16T09:32:00Z" },
    { id: "CP003", couponCode: "GLD-7F21", tier: 3, expiry: "2026-04-30", status: "redeemed", assignedTo: "U1003", assignedAt: "2026-02-16T09:18:00Z" },
    { id: "CP004", couponCode: "BRZ-2D45", tier: 1, expiry: "2026-04-30", status: "assigned", assignedTo: "U1004", assignedAt: "2026-02-16T08:55:00Z" },
    { id: "CP005", couponCode: "PLT-1A03", tier: 4, expiry: "2026-04-30", status: "assigned", assignedTo: "U1005", assignedAt: "2026-02-16T08:40:00Z" },
    { id: "CP006", couponCode: "SLV-9B77", tier: 2, expiry: "2026-04-30", status: "redeemed", assignedTo: "U1006", assignedAt: "2026-02-16T08:22:00Z" },
    { id: "CP007", couponCode: "BRZ-1X99", tier: 1, expiry: "2026-04-30", status: "unused", assignedTo: null, assignedAt: null },
    { id: "CP008", couponCode: "BRZ-3Y22", tier: 1, expiry: "2026-04-30", status: "unused", assignedTo: null, assignedAt: null },
    { id: "CP009", couponCode: "SLV-4Z55", tier: 2, expiry: "2026-04-30", status: "unused", assignedTo: null, assignedAt: null },
    { id: "CP010", couponCode: "GLD-4E56", tier: 3, expiry: "2026-04-30", status: "redeemed", assignedTo: "U1008", assignedAt: "2026-02-15T22:30:00Z" },
    { id: "CP011", couponCode: "PLT-2B44", tier: 4, expiry: "2026-03-31", status: "expired", assignedTo: null, assignedAt: null },
    { id: "CP012", couponCode: "GLD-8G12", tier: 3, expiry: "2026-04-30", status: "unused", assignedTo: null, assignedAt: null },
    { id: "CP013", couponCode: "BRZ-6C33", tier: 1, expiry: "2026-04-30", status: "assigned", assignedTo: "U1009", assignedAt: "2026-02-15T21:15:00Z" },
    { id: "CP014", couponCode: "SLV-5H91", tier: 2, expiry: "2026-04-30", status: "assigned", assignedTo: "U1010", assignedAt: "2026-02-15T20:45:00Z" },
    { id: "CP015", couponCode: "PLT-9D88", tier: 4, expiry: "2026-04-30", status: "unused", assignedTo: null, assignedAt: null },
];

// ---------- FRAUD CENTER ----------

export const mockFraudEvents = [
    { id: "FE001", userId: "U4521", userName: "Suresh K", eventType: "impossible_travel", riskScore: 95, device: "Samsung S24", ip: "103.21.58.12", location: "Mumbai → Delhi", timestamp: "2026-02-16T06:18:00Z", action: "blocked", details: "Engaged at Mumbai & Delhi within 12 min" },
    { id: "FE002", userId: "U3312", userName: "Ravi M", eventType: "mock_location", riskScore: 88, device: "OnePlus 12", ip: "49.36.112.8", location: "IIT Bombay Campus", timestamp: "2026-02-15T22:40:00Z", action: "blocked", details: "Mock location API detected via GPS drift signature" },
    { id: "FE003", userId: "U2201", userName: "Ankit S", eventType: "velocity", riskScore: 72, device: "iPhone 15", ip: "59.94.33.101", location: "Phoenix Marketcity", timestamp: "2026-02-16T09:12:00Z", action: "flagged", details: "18 engagements in 5 minutes — exceeds 6/5min velocity cap" },
    { id: "FE004", userId: "U1155", userName: "Deepa R", eventType: "device_spoof", riskScore: 81, device: "Xiaomi 14 (emulated)", ip: "223.186.5.44", location: "Connaught Place Hub", timestamp: "2026-02-16T07:45:00Z", action: "blocked", details: "Device fingerprint matches known emulator signature" },
    { id: "FE005", userId: "U6643", userName: "Kiran P", eventType: "bot_pattern", riskScore: 92, device: "Pixel 8", ip: "117.200.19.22", location: "Inorbit Mall", timestamp: "2026-02-16T08:30:00Z", action: "blocked", details: "Engagement timing pattern matches bot cadence (σ < 0.02s)" },
    { id: "FE006", userId: "U7781", userName: "Neha T", eventType: "geo_mismatch", riskScore: 55, device: "Samsung A54", ip: "182.73.44.91", location: "WeWork Cyber Hub", timestamp: "2026-02-16T10:05:00Z", action: "flagged", details: "IP geolocates to Chennai but GPS reports Gurugram" },
    { id: "FE007", userId: "U8892", userName: "Pooja V", eventType: "velocity", riskScore: 65, device: "iPhone 14", ip: "106.51.78.33", location: "Koramangala Third Wave", timestamp: "2026-02-16T11:22:00Z", action: "flagged", details: "12 engagements across 3 campaigns in 8 minutes" },
    { id: "FE008", userId: "U9903", userName: "Manoj D", eventType: "mock_location", riskScore: 78, device: "Realme GT", ip: "203.122.56.11", location: "BITS Pilani Campus", timestamp: "2026-02-15T19:30:00Z", action: "blocked", details: "GPS altitude 0m with no sensor data — spoofing confirmed" },
];

export const mockFraudUsers = [
    { id: "U4521", name: "Suresh K", email: "suresh.k@mail.com", phone: "+91 98765 43210", totalEngagements: 342, flaggedEngagements: 28, riskScore: 95, status: "blocked", lastSeen: "2026-02-16T06:18:00Z", deviceCount: 4, city: "Mumbai" },
    { id: "U3312", name: "Ravi M", email: "ravi.m@mail.com", phone: "+91 87654 32109", totalEngagements: 156, flaggedEngagements: 12, riskScore: 88, status: "blocked", lastSeen: "2026-02-15T22:40:00Z", deviceCount: 3, city: "Mumbai" },
    { id: "U2201", name: "Ankit S", email: "ankit.s@mail.com", phone: "+91 76543 21098", totalEngagements: 89, flaggedEngagements: 18, riskScore: 72, status: "flagged", lastSeen: "2026-02-16T09:12:00Z", deviceCount: 1, city: "Mumbai" },
    { id: "U1155", name: "Deepa R", email: "deepa.r@mail.com", phone: "+91 65432 10987", totalEngagements: 210, flaggedEngagements: 5, riskScore: 81, status: "blocked", lastSeen: "2026-02-16T07:45:00Z", deviceCount: 2, city: "Delhi" },
    { id: "U6643", name: "Kiran P", email: "kiran.p@mail.com", phone: "+91 54321 09876", totalEngagements: 512, flaggedEngagements: 45, riskScore: 92, status: "blocked", lastSeen: "2026-02-16T08:30:00Z", deviceCount: 6, city: "Hyderabad" },
    { id: "U7781", name: "Neha T", email: "neha.t@mail.com", phone: "+91 43210 98765", totalEngagements: 78, flaggedEngagements: 3, riskScore: 55, status: "flagged", lastSeen: "2026-02-16T10:05:00Z", deviceCount: 1, city: "Gurugram" },
    { id: "U8892", name: "Pooja V", email: "pooja.v@mail.com", phone: "+91 32109 87654", totalEngagements: 134, flaggedEngagements: 7, riskScore: 65, status: "flagged", lastSeen: "2026-02-16T11:22:00Z", deviceCount: 2, city: "Bangalore" },
    { id: "U9903", name: "Manoj D", email: "manoj.d@mail.com", phone: "+91 21098 76543", totalEngagements: 267, flaggedEngagements: 15, riskScore: 78, status: "blocked", lastSeen: "2026-02-15T19:30:00Z", deviceCount: 3, city: "Pilani" },
    { id: "U1234", name: "Aisha B", email: "aisha.b@mail.com", phone: "+91 11223 34455", totalEngagements: 445, flaggedEngagements: 0, riskScore: 8, status: "whitelisted", lastSeen: "2026-02-16T12:00:00Z", deviceCount: 1, city: "Bangalore" },
    { id: "U5678", name: "Rajesh G", email: "rajesh.g@mail.com", phone: "+91 99887 76655", totalEngagements: 320, flaggedEngagements: 1, riskScore: 12, status: "active", lastSeen: "2026-02-16T11:45:00Z", deviceCount: 1, city: "Delhi" },
];

export const mockFraudRules = [
    { id: "FR001", name: "Impossible Travel", description: "Block if user engages from 2 cities within 30 min travel distance", enabled: true, threshold: 30, action: "block", severity: "critical", triggeredToday: 4 },
    { id: "FR002", name: "Mock Location Detection", description: "Flag GPS spoofing via altitude/drift/sensor analysis", enabled: true, threshold: 70, action: "block", severity: "critical", triggeredToday: 12 },
    { id: "FR003", name: "Velocity Cap", description: "Max engagements per user per 5-minute window", enabled: true, threshold: 6, action: "flag", severity: "high", triggeredToday: 23 },
    { id: "FR004", name: "Device Fingerprint Spoof", description: "Detect emulated or cloned device signatures", enabled: true, threshold: 75, action: "block", severity: "critical", triggeredToday: 3 },
    { id: "FR005", name: "Bot Pattern Detection", description: "Flag engagement timing with σ < 0.05s variance", enabled: true, threshold: 80, action: "block", severity: "critical", triggeredToday: 2 },
    { id: "FR006", name: "IP-GPS Geomismatch", description: "Flag when IP geolocation differs >100km from GPS", enabled: true, threshold: 100, action: "flag", severity: "medium", triggeredToday: 8 },
    { id: "FR007", name: "Multi-Device Limit", description: "Alert if user uses more than 3 devices in 24h", enabled: false, threshold: 3, action: "alert", severity: "low", triggeredToday: 0 },
    { id: "FR008", name: "Daily Engagement Cap", description: "Block user after exceeding daily engagement limit", enabled: true, threshold: 50, action: "block", severity: "high", triggeredToday: 5 },
];

// ---------- AGGREGATE STATS ----------
export const dashboardStats = {
    activeCampaigns: 5,
    totalBrands: 6,
    totalLocations: 8,
    todayEngagements: 1800,
    todaySpend: 27600,
    budgetBurnRate: 78,
    fraudBlockedToday: 30,
    revenueProjection: 2450000,
    highRiskAlerts: 3,
    locationLoad: 72,
    avgCpve: 16.14,
    totalEngagements: 48130,
};
