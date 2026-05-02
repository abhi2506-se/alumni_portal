'use client';
// app/(dashboard)/dashboard/alumni/[id]/page.tsx
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, GraduationCap, Star, MessageSquare,
  Linkedin, Github, Globe, Calendar, Award, UserPlus, Check, ExternalLink,
  BookOpen, Clock,
} from 'lucide-react';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

// Mock alumni data — in production fetch from /api/users/[id]
const ALUMNI_DETAIL = {
  id: 'a1',
  name: 'Arjun Mehta',
  batch: 2019,
  dept: 'Computer Engineering',
  degree: 'B.E.',
  role: 'Senior Software Engineer',
  company: 'Google',
  city: 'Bangalore',
  country: 'India',
  bio: 'I build distributed systems at scale at Google. Previously at Amazon. Passionate about open-source, system design, and mentoring the next generation of engineers from GEC Rajkot. I\'ve cracked interviews at 5 FAANG companies and love sharing what I know.',
  skills: ['Go', 'Python', 'Kubernetes', 'GCP', 'System Design', 'Distributed Systems', 'PostgreSQL', 'Redis', 'gRPC', 'Kafka'],
  achievements: ['Google L5 (Senior SWE)', 'Amazon Bar Raiser Certified', 'Open Source Contributor – 2k+ GitHub Stars', 'Dean\'s List 2019'],
  openToMentor: true,
  mentorSessions: 48,
  mentorRating: 4.9,
  linkedinUrl: '#',
  githubUrl: '#',
  portfolioUrl: '#',
  isConnected: false,
  connectionStatus: null as null | 'PENDING' | 'ACCEPTED',
  availability: { Mon: ['10:00', '14:00'], Wed: ['10:00', '16:00'], Fri: ['11:00', '15:00'] },
  recentPosts: [
    { title: 'My Google Interview Prep Strategy (6 months)', date: '2024-11-20', views: 2341 },
    { title: 'System Design: Designing WhatsApp at Scale', date: '2024-10-15', views: 1892 },
  ],
};

export default function AlumniProfilePage() {
  const params = useParams();
  const router = useRouter();
  const alumni = ALUMNI_DETAIL; // In production: fetch by params.id

  const [connectionStatus, setConnectionStatus] = useState(alumni.connectionStatus);
  const [connecting, setConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'mentorship' | 'posts'>('about');

  async function sendConnectionRequest() {
    setConnecting(true);
    try {
      const res = await fetch('/api/users/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: alumni.id, message: 'Hi! I\'d love to connect.' }),
      });
      if (res.ok) {
        setConnectionStatus('PENDING');
        toast.success('Connection request sent!');
      } else {
        const json = await res.json();
        toast.error(json.error ?? 'Failed to send request');
      }
    } catch {
      // Demo mode
      setConnectionStatus('PENDING');
      toast.success('Connection request sent!');
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-navy-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Profile header */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-r from-navy-700 via-navy-600 to-gold-500 relative">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          {alumni.openToMentor && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-400/90 text-navy-950 text-xs font-semibold backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-current" /> Open to Mentor
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
            <div className={cn(
              'w-20 h-20 rounded-2xl border-4 border-white dark:border-navy-800 flex items-center justify-center text-white text-xl font-bold shadow-xl',
              generateAvatarColor(alumni.name),
            )}>
              {getInitials(alumni.name)}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              {connectionStatus === null && (
                <button
                  onClick={sendConnectionRequest}
                  disabled={connecting}
                  className="btn-primary text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 disabled:opacity-60"
                >
                  <UserPlus className="w-4 h-4" />
                  {connecting ? 'Sending…' : 'Connect'}
                </button>
              )}
              {connectionStatus === 'PENDING' && (
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> Request Pending
                </span>
              )}
              {connectionStatus === 'ACCEPTED' && (
                <>
                  <Link
                    href="/dashboard/messages"
                    className="btn-primary text-sm py-2.5 px-5 rounded-xl flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </Link>
                  <span className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-green-200 text-green-700 text-sm">
                    <Check className="w-4 h-4" /> Connected
                  </span>
                </>
              )}
              {alumni.openToMentor && (
                <Link
                  href={`/dashboard/mentorship?mentor=${alumni.id}`}
                  className="btn-gold text-sm py-2.5 px-5 rounded-xl flex items-center gap-2"
                >
                  <Star className="w-4 h-4" /> Book Mentorship
                </Link>
              )}
            </div>
          </div>

          {/* Name & role */}
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">{alumni.name}</h1>
            <p className="text-navy-600 dark:text-navy-300 font-medium mt-0.5">{alumni.role} at {alumni.company}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {alumni.city}, {alumni.country}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Batch {alumni.batch} · {alumni.degree} {alumni.dept}</span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-2 mt-4">
            {alumni.linkedinUrl && (
              <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border hover:bg-blue-50 dark:hover:bg-blue-900/20 text-muted-foreground hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {alumni.githubUrl && (
              <a href={alumni.githubUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border hover:bg-navy-50 dark:hover:bg-navy-700 text-muted-foreground hover:text-navy-900 dark:hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {alumni.portfolioUrl && (
              <a href={alumni.portfolioUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border hover:bg-navy-50 dark:hover:bg-navy-700 text-muted-foreground hover:text-navy-900 dark:hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mentor stats */}
          {alumni.openToMentor && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{alumni.mentorRating}</p>
                  <p className="text-xs text-muted-foreground">Mentor rating</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{alumni.mentorSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions completed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-2xl p-1 w-fit">
        {(['about', 'mentorship', 'posts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all',
              activeTab === tab ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'about' && (
        <div className="space-y-5">
          {/* Bio */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-3">About</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{alumni.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map(skill => (
                <motion.span
                  key={skill}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1.5 bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-sm rounded-xl font-medium"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-3">Achievements</h2>
            <div className="space-y-2">
              {alumni.achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-gold-600" />
                  </div>
                  <p className="text-sm text-navy-700 dark:text-navy-200">{ach}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mentorship' && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-5">
          <div>
            <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Mentorship Availability</h2>
            <p className="text-sm text-muted-foreground">Book a 1:1 session with {alumni.name.split(' ')[0]}</p>
          </div>

          <div className="grid gap-3">
            {Object.entries(alumni.availability).map(([day, slots]) => (
              <div key={day} className="flex items-center gap-4 p-4 bg-navy-50 dark:bg-navy-700/50 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-navy-200 dark:bg-navy-600 flex items-center justify-center">
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{day}</p>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {(slots as string[]).map(slot => (
                      <span key={slot} className="text-xs px-3 py-1.5 bg-white dark:bg-navy-800 border border-border rounded-lg font-medium text-navy-700 dark:text-navy-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/dashboard/mentorship?mentor=${alumni.id}`}
            className="btn-gold w-full justify-center py-3.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book a Session with {alumni.name.split(' ')[0]}
          </Link>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-3">
          {alumni.recentPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-navy-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy-900 dark:text-white text-sm">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{post.date} · {post.views.toLocaleString()} views</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </motion.div>
          ))}
          {alumni.recentPosts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-2xl border border-border">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No posts yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
