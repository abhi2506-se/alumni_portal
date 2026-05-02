// ─── Shared TypeScript Types ──────────────────────────────────────────────────

export type Role = 'STUDENT' | 'ALUMNI' | 'ADMIN';
export type AccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE';
export type MentorshipStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type NotificationType = 'MESSAGE' | 'MENTOR_REQUEST' | 'CONNECTION_REQUEST' | 'JOB_POSTED' | 'EVENT_CREATED' | 'APPROVAL' | 'SYSTEM';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  status: AccountStatus;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    batchYear?: number;
    department?: string;
    degree?: string;
    currentCompany?: string;
    currentRole?: string;
    skills: string[];
    achievements: string[];
    city?: string;
    country?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    resumeUrl?: string;
    openToMentor: boolean;
    profileComplete: boolean;
  } | null;
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: JobType;
  salary?: string;
  applyUrl: string;
  deadline?: Date;
  isActive: boolean;
  isApproved: boolean;
  views: number;
  createdAt: Date;
  poster: {
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
      currentRole?: string;
    } | null;
  };
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isVirtual: boolean;
  meetLink?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  capacity?: number;
  tags: string[];
  _count?: { rsvps: number };
}

export interface MentorshipSession {
  id: string;
  topic: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  status: MentorshipStatus;
  rating?: number;
  feedback?: string;
  mentor: UserProfile;
  mentee: UserProfile;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  totalScore: number;
  mentorScore: number;
  jobPostScore: number;
  eventScore: number;
  rank: number;
  user: {
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
      currentCompany?: string;
      batchYear?: number;
    } | null;
  };
}

export interface AnalyticsData {
  totalUsers: number;
  pendingApprovals: number;
  totalJobs: number;
  activeEvents: number;
  totalMentorships: number;
  usersByRole: { role: string; count: number }[];
  monthlySignups: { month: string; count: number }[];
  jobsByType: { type: string; count: number }[];
  topMentors: LeaderboardEntry[];
}

export interface ChatMessage {
  id: string;
  content: string; // decrypted
  senderId: string;
  createdAt: Date;
  status: MessageStatus;
}

export interface ConnectionWithChat {
  id: string;
  status: RequestStatus;
  requester: UserProfile;
  receiver: UserProfile;
  chatRoom?: { id: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchFilters {
  query?: string;
  batchYear?: number;
  department?: string;
  company?: string;
  skills?: string[];
  city?: string;
  country?: string;
  role?: Role;
  openToMentor?: boolean;
}
