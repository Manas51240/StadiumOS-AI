export interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  role: 'spectator' | 'volunteer' | 'security' | 'organizer';
  is_active: boolean;
  created_at: string;
}

export interface NavigationNodeDTO {
  id: number;
  name: string;
  type: string;
  accessibility_friendly: boolean;
  lat: number;
  lng: number;
  sector: string;
  details: string | null;
}

export interface WaypointDTO {
  name: string;
  lat: number;
  lng: number;
  type: string;
}

export interface RouteDTO {
  start: string;
  end: string;
  accessibility_mode: boolean;
  total_distance_meters: number;
  estimated_time_seconds: number;
  waypoints: WaypointDTO[];
  warnings: string[];
  navigation_assistance_instructions: string;
}

export interface CrowdAlertDTO {
  id: number;
  sector: string;
  congestion_level: string;
  spectator_count: number;
  capacity: number;
  message: string | null;
  created_at: string;
}

export interface SectorPredictionDTO {
  sector: string;
  spectator_count: number;
  capacity: number;
  occupancy_rate: string;
  congestion_level: string;
  recommendation: string;
}

export interface CrowdPredictionDTO {
  timestamp: string;
  overall_stadium_load: string;
  predictions: SectorPredictionDTO[];
}

export interface IncidentDTO {
  id: number;
  category: string;
  severity: string;
  description: string;
  location: string;
  reported_by_id: number;
  status: string;
  response_instructions: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface VolunteerTaskDTO {
  id: number;
  title: string;
  description: string;
  assigned_to_id: number | null;
  status: string;
  priority: string;
  sector: string;
  shift_start: string;
  shift_end: string;
}

export interface SustainabilityMetricDTO {
  id: number;
  sector: string;
  power_kwh: number;
  water_liters: number;
  waste_kg: number;
  recycling_rate: number;
  timestamp: string;
}

export interface SustainabilitySummaryDTO {
  total_power_kwh: number;
  total_water_liters: number;
  total_waste_kg: number;
  average_recycling_rate: string;
  carbon_offset_kg: number;
  sustainability_status: string;
  highlights: string[];
}

export interface OperationReportDTO {
  id: number;
  title: string;
  created_by_id: number;
  report_type: string;
  content: string;
  confidence_score: number;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_role?: string;
  language?: string;
}

export interface ChatResponse {
  reply: string;
  language: string;
  confidence_score: number;
  flagged: boolean;
  flag_reason?: string;
  suggested_actions?: string[];
}
