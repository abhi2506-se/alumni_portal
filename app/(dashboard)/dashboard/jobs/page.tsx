'use client';
// app/(dashboard)/dashboard/jobs/page.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Search, MapPin, Clock, ExternalLink, Plus, Filter,
  Building, ChevronDown, Bookmark, Eye, Star, X, SlidersHorizontal,
} from 'lucide-react';
import { cn, jobTypeBadge, formatDate } from '@/lib/utils/helpers';

type JobType = 'ALL' | 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE';

const MOCK_JOBS = [
  {
    id: 'j1', title: 'Software Engineer II', company: 'Google', location: 'Bangalore, India',
    type: 'FULL_TIME', salary: '₹30–45 LPA', skills: ['Python', 'Go', 'Kubernetes', 'GCP'],
    description: 'Join Google\'s core infrastructure team to build planet-scale distributed systems. You will work on challenges that impact billions of users.',
    applyUrl: 'https://careers.google.com', deadline: '2025-01-31',
    poster: { name: 'Arjun Mehta', batch: 2019, company: 'Google', avatar: null },
    views: 342, saved: false, isNew: true,
  },
  {
    id: 'j2', title: 'Product Management Intern', company: 'Microsoft', location: 'Hyderabad, India',
    type: 'INTERNSHIP', salary: '₹80,000/month', skills: ['Product Strategy', 'SQL', 'Data Analysis'],
    description: 'Work alongside senior PMs on Microsoft\'s Azure ecosystem. This 6-month internship often converts to a full-time role.',
    applyUrl: 'https://careers.microsoft.com', deadline: '2024-12-31',
    poster: { name: 'Rohan Patel', batch: 2020, company: 'Microsoft', avatar: null },
    views: 218, saved: true, isNew: true,
  },
  {
    id: 'j3', title: 'Machine Learning Engineer', company: 'Flipkart', location: 'Bangalore, India',
    type: 'FULL_TIME', salary: '₹20–35 LPA', skills: ['PyTorch', 'MLOps', 'Python', 'Spark'],
    description: 'Build recommendation systems and search ranking models serving 100M+ users on Flipkart.',
    applyUrl: 'https://careers.flipkart.com', deadline: '2025-02-15',
    poster: { name: 'Ananya Singh', batch: 2018, company: 'Flipkart', avatar: null },
    views: 189, saved: false, isNew: false,
  },
  {
    id: 'j4', title: 'UI/UX Designer', company: 'Razorpay', location: 'Remote',
    type: 'FULL_TIME', salary: '₹12–22 LPA', skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    description: 'Design beautiful and intuitive experiences for India\'s leading payments platform.',
    applyUrl: 'https://razorpay.com/jobs', deadline: '2025-01-15',
    poster: { name: 'Kavya Reddy', batch: 2021, company: 'Razorpay', avatar: null },
    views: 94, saved: false, isNew: false,
  },
  {
    id: 'j5', title: 'DevOps / SRE Intern', company: 'Zomato', location: 'Gurgaon, India',
    type: 'INTERNSHIP', salary: '₹60,000/month', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    description: 'Join Zomato\'s SRE team to ensure 99.99% uptime for food delivery at scale across India.',
    applyUrl: 'https://www.zomato.com/careers', deadline: '2024-12-25',
    poster: { name: 'Vikram Shah', batch: 2019, company: 'Zomato', avatar: null },
    views: 156, saved: false, isNew: true,
  },
];

function JobCard({ job, onSave }: { job: typeof MOCK_JOBS[0]; onSave: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const badge = jobTypeBadge(job.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start gap-4">
        {/* Company logo placeholder */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-700 dark:to-navy-600 flex items-center justify-center flex-shrink-0 text-navy-600 dark:text-navy-300 font-bold text-sm">
          {job.company.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-navy-900 dark:text-white text-base">{job.title}</h3>
                {job.isNew && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">NEW</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                {job.deadline && (
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Due {formatDate(job.deadline)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onSave(job.id)}
                className={cn('p-2 rounded-xl transition-colors', job.saved ? 'text-navy-700 dark:text-gold-400 bg-navy-100 dark:bg-navy-700' : 'text-muted-foreground hover:bg-navy-50 dark:hover:bg-navy-700')}
              >
                <Bookmark className={cn('w-4 h-4', job.saved && 'fill-current')} />
              </button>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', badge.color)}>{badge.label}</span>
            {job.salary && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium">
                {job.salary}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5" /> {job.views}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.map(skill => (
              <span key={skill} className="text-xs px-2 py-0.5 rounded-lg bg-navy-50 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                {skill}
              </span>
            ))}
          </div>

          {/* Description expandable */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  Posted by <strong className="text-navy-900 dark:text-white ml-1">{job.poster.name}</strong>
                  , Batch {job.poster.batch} · {job.poster.company}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs py-2 px-4 rounded-xl flex items-center gap-1"
            >
              Apply Now <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setExpanded(p => !p)}
              className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-1"
            >
              {expanded ? 'Less' : 'Details'} <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const { data: session } = useSession();
  const isAlumni = (session?.user as any)?.role === 'ALUMNI';

  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<JobType>('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = filter === 'ALL' || j.type === filter;
    const matchLoc = !locationFilter || j.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchType && matchLoc;
  });

  function toggleSave(id: string) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Job Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Exclusive opportunities posted by alumni</p>
        </div>
        {isAlumni && (
          <Link href="/dashboard/jobs/new" className="btn-gold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => setShowFilters(p => !p)}
          className={cn('btn-outline flex items-center gap-2 text-sm py-3 px-4 rounded-xl', showFilters && 'bg-navy-50 dark:bg-navy-700')}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {(filter !== 'ALL' || locationFilter) && (
            <span className="w-5 h-5 rounded-full bg-navy-700 text-white text-[10px] font-bold flex items-center justify-center">
              {[filter !== 'ALL', !!locationFilter].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4"
          >
            <div className="flex flex-wrap gap-3 items-end">
              {/* Type filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE'] as JobType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
                        filter === t
                          ? 'bg-navy-700 text-white'
                          : 'bg-navy-50 dark:bg-navy-700 text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-600',
                      )}
                    >
                      {t === 'ALL' ? 'All Types' : t.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
              {/* Location filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    placeholder="City or Remote"
                    className="pl-8 pr-4 py-2 rounded-xl bg-navy-50 dark:bg-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-300"
                  />
                </div>
              </div>
              {(filter !== 'ALL' || locationFilter) && (
                <button
                  onClick={() => { setFilter('ALL'); setLocationFilter(''); }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 pb-0.5"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </span>
        <span className="text-xs text-muted-foreground">Updated daily</span>
      </div>

      {/* Job list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-2xl border border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium text-navy-900 dark:text-white">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <JobCard job={job} onSave={toggleSave} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
