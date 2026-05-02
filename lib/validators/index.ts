// lib/validators/index.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  role:      z.enum(['STUDENT', 'ALUMNI']),
  firstName: z.string().min(2, 'First name required'),
  lastName:  z.string().min(2, 'Last name required'),
  batchYear: z.coerce.number().min(2000).max(new Date().getFullYear() + 4),
  department: z.string().min(2, 'Department required'),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
  otp:      z.string().length(6).optional(),
});

export const profileSchema = z.object({
  firstName:      z.string().min(2),
  lastName:       z.string().min(2),
  bio:            z.string().max(500).optional(),
  phone:          z.string().optional(),
  batchYear:      z.coerce.number().optional(),
  department:     z.string().optional(),
  degree:         z.string().optional(),
  currentCompany: z.string().optional(),
  currentRole:    z.string().optional(),
  skills:         z.array(z.string()).optional(),
  achievements:   z.array(z.string()).optional(),
  city:           z.string().optional(),
  country:        z.string().optional(),
  linkedinUrl:    z.string().url().optional().or(z.literal('')),
  githubUrl:      z.string().url().optional().or(z.literal('')),
  portfolioUrl:   z.string().url().optional().or(z.literal('')),
  openToMentor:   z.boolean().optional(),
});

export const jobSchema = z.object({
  title:       z.string().min(3),
  company:     z.string().min(2),
  description: z.string().min(50),
  requirements: z.array(z.string()),
  skills:      z.array(z.string()),
  location:    z.string().min(2),
  type:        z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE']),
  salary:      z.string().optional(),
  applyUrl:    z.string().url(),
  deadline:    z.string().optional(),
});

export const eventSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(20),
  startDate:   z.string(),
  endDate:     z.string(),
  location:    z.string().min(2),
  isVirtual:   z.boolean().default(false),
  meetLink:    z.string().url().optional().or(z.literal('')),
  capacity:    z.coerce.number().optional(),
  tags:        z.array(z.string()).optional(),
});

export const mentorshipSchema = z.object({
  mentorId:    z.string(),
  topic:       z.string().min(5),
  description: z.string().optional(),
  scheduledAt: z.string(),
  duration:    z.coerce.number().min(30).max(120).default(60),
});

export const connectionSchema = z.object({
  receiverId: z.string(),
  message:    z.string().max(300).optional(),
});

export const messageSchema = z.object({
  chatRoomId:  z.string(),
  content:     z.string().min(1).max(2000),
  ciphertext:  z.string(),
  iv:          z.string(),
});

export type RegisterInput     = z.infer<typeof registerSchema>;
export type LoginInput        = z.infer<typeof loginSchema>;
export type ProfileInput      = z.infer<typeof profileSchema>;
export type JobInput          = z.infer<typeof jobSchema>;
export type EventInput        = z.infer<typeof eventSchema>;
export type MentorshipInput   = z.infer<typeof mentorshipSchema>;
export type ConnectionInput   = z.infer<typeof connectionSchema>;
export type MessageInput      = z.infer<typeof messageSchema>;
