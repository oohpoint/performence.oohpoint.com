import { z } from "zod";

export const LocationSchema = z.object({
  location_name: z.string().min(1, "Location name is required"),
  location_type: z.string().min(1, "Location type is required"),
  
  // College conditional fields
  college_type: z.string().optional(),
  college_tags: z.array(z.string()).optional(),
  
  // Food & Beverage conditional fields
  sub_location_type: z.string().optional(),
  cafe_sub_categories: z.array(z.string()).optional(),
  
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  pincode: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  
  latitude: z.coerce.number().refine(
    (val) => val >= -90 && val <= 90,
    "Latitude must be between -90 and 90"
  ),
  longitude: z.coerce.number().refine(
    (val) => val >= -180 && val <= 180,
    "Longitude must be between -180 and 180"
  ),
  
  primary_audience: z.string().min(1, "Primary audience is required"),
  age_band: z.string().min(1, "Age band is required"),
  gender_skew: z.string().optional(),
  education_level: z.string().optional(),
  campus_type: z.string().optional(),
  
  footfall_level: z.string().min(1, "Footfall level is required"),
  peak_windows: z.array(z.string()).optional(),
  low_windows: z.array(z.string()).optional(),
  
  avg_dwell_bucket: z.string().optional(),
  nearby_vendors_type_landmark: z.string().optional(),
  restricted_categories: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.location_type === "College") {
      return data.college_type && data.college_type.length > 0;
    }
    return true;
  },
  {
    message: "College type is required for College locations",
    path: ["college_type"],
  }
).refine(
  (data) => {
    if (data.location_type === "Food & Beverage") {
      return data.sub_location_type && data.sub_location_type.length > 0;
    }
    return true;
  },
  {
    message: "Sub location type is required for Food & Beverage locations",
    path: ["sub_location_type"],
  }
);