export interface ReadingSessionRecord {
  id?: string;
  article_id: string;
  session_id: string;
  scroll_depth: number; // 0, 25, 50, 75, 100
  reading_duration_seconds: number;
  is_completed: boolean;
  user_agent?: string | null;
  referrer?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReadingBeaconPayload {
  articleId: string;
  sessionId: string;
  scrollDepth: number; // 25, 50, 75, 100
  durationSeconds: number;
  isCompleted: boolean;
  referrer?: string;
}

export interface ReadingFunnelStage {
  milestone: number; // 0, 25, 50, 75, 100
  label: string;
  description: string;
  count: number;
  percentage: number; // % dari total awal (100% di awal)
  dropoffRate: number; // % pembaca yang gugur di tahap ini dibandingkan tahap sebelumnya
}

export interface ArticleReadingPerformance {
  articleId: string;
  title: string;
  slug: string;
  categoryName: string;
  authorName: string;
  authorAvatar?: string | null;
  estimatedTimeMinutes: number;
  actualDurationSeconds: number;
  actualDurationFormatted: string;
  totalSessions: number;
  completionRate: number; // persentase 0-100%
  completedSessions: number;
  topDropoffMilestone: number; // 25, 50, 75, atau 100 (tuntas)
  dropoffLabel: string;
  funnel: ReadingFunnelStage[];
  status: "excellent" | "good" | "needs_attention";
}

export interface ReadingAnalyticsSummary {
  totalSessions: number;
  completedSessions: number;
  averageCompletionRate: number; // %
  averageActualDurationSeconds: number;
  averageActualDurationFormatted: string;
  averageEstimatedMinutes: number;
  readingPaceRatio: number; // aktual vs estimasi (misal 0.9x atau 1.1x)
  topDropoffPoint: {
    milestone: number;
    label: string;
    dropPercentage: number;
    description: string;
  };
  globalFunnel: ReadingFunnelStage[];
  articles: ArticleReadingPerformance[];
  timeRange: "7d" | "30d" | "all";
}

