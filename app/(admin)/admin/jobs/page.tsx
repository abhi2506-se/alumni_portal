'use client';
// app/(admin)/admin/jobs/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Search, CheckCircle, XCircle, Eye, ExternalLink,
  Clock, Building, MapPin, Tag, Filter,
} from 'lucide-react';
import { cn, formatDate, jobTypeBadge } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

const INIT_JOBS = [
  {
    id: 'j1', title: 'Software Engineer II', company: 'Google', location: 'Bangalore',
    type: 'FULL_TIME', salary: '₹30–45 LPA', skills: ['Go', 'Python', 'Kubernetes'],
    poster: 'Arjun Mehta', postedAt: '2024-12-10', applyUrl: 'https://careers.google.com',
    status: 'PENDING', applications: 0,
  },
  {
    id: 'j2', title: 'Product Manager Intern', company: 'Microsoft', location: 'Hyderabad',
    type: 'INTERNSHIP', salary: '₹80k/month', skills: ['Product Strategy', 'SQL'],
    poster: 'Rohan Patel', postedAt: '2024-12-09', applyUrl: 'https://careers.microsoft.com',
    status: 'APPROVED', applications: 34,
  },
  {
    id: 'j3', title: 'ML Engineer', company: 'Flipkart', location: 'Bangalore',
    type: 'FULL_TIME', salary: '₹20–35 LPA', skills: ['PyTorch', 'MLOps'],
    poster: 'Ananya Singh', postedAt: '2024-12-08', applyUrl: 'https://flipkart.com/careers',
    status: 'APPROVED', applications: 28,
  },
  {
    id: 'j4', title: 'UI/UX Designer', company: 'Razorpay', location: 'Remote',
    type: 'FULL_TIME', salary: '₹12–22 LPA', skills: ['Figma', 'Prototyping'],
    poster: 'Kavya Reddy', postedAt: '2024-12-07', applyUrl: 'https://razorpay.com/jobs',
    status: 'PENDING', applications: 0,
  },
  {
    id: 'j5', title: 'Spammy Job Post', company: 'FakeCompany', location: 'Unknown',
    type: 'FULL_TIME', salary: '₹1 Crore/month', skills: ['None'],
    poster: 'Unknown User', postedAt: '2024-12-06', applyUrl: 'https://spam.com',
    status: 'REJECTED', applications: 0,
  },
];

type JobStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(INIT_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.poster.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    toast.success(status === 'APPROVED' ? '✅ Job approved and published' : '❌ Job rejected');
  }

  const pendingCount = jobs.filter(j => j.status === 'PENDING').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Job Moderation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and approve job postings from alumni</p>
        </div>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl">
          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>{pendingCount} job{pendingCount !== 1 ? 's' : ''}</strong> pending review
          </p>
          <button onClick={() => setStatusFilter('PENDING')} className="ml-auto text-xs text-yellow-700 dark:text-yellow-400 font-medium hover:underline">
            Review now →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: jobs.filter(j => j.status === 'PENDING').length,  color: 'bg-yellow-500' },
          { label: 'Published',      value: jobs.filter(j => j.status === 'APPROVED').length,  color: 'bg-green-500'  },
          { label: 'Rejected',       value: jobs.filter(j => j.status === 'REJECTED').length,  color: 'bg-red-500'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs by title, company, poster…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white"
          />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as JobStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                statusFilter === s ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
              )}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((job, i) => {
            const badge = jobTypeBadge(job.type);
            const isExpanded = expanded === job.id;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Company logo placeholder */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-700 dark:to-navy-600 flex items-center justify-center text-navy-600 dark:text-navy-300 font-bold text-sm flex-shrink-0">
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-navy-900 dark:text-white text-sm">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Building className="w-3 h-3" />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          <span className="text-gold-600">Posted by {job.poster}</span>
                          <span>{formatDate(job.postedAt)}</span>
                        </div>
                      </div>
                      <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0',
                        job.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        job.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700',
                      )}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', badge.color)}>{badge.label}</span>
                      {job.salary && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700">{job.salary}</span>
                      )}
                      {job.skills.slice(0, 3).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-navy-50 dark:bg-navy-700 text-navy-600 dark:text-navy-300">{s}</span>
                      ))}
                      {job.status === 'APPROVED' && (
                        <span className="text-xs text-muted-foreground ml-auto">{job.applications} applications</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {job.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStatus(job.id, 'APPROVED')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                          </button>
                          <button
                            onClick={() => updateStatus(job.id, 'REJECTED')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : job.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> {isExpanded ? 'Hide' : 'Preview'}
                      </button>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Apply Link
                      </a>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <p className="text-sm text-muted-foreground">
                            This job posting from <strong className="text-navy-900 dark:text-white">{job.poster}</strong> is requesting to post a <strong>{badge.label}</strong> position at <strong>{job.company}</strong> based in <strong>{job.location}</strong>.
                            Salary: <strong>{job.salary || 'Not specified'}</strong>. Apply via: <code className="text-xs bg-navy-100 dark:bg-navy-700 px-1 py-0.5 rounded">{job.applyUrl}</code>
                          </p>
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Required Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.map(s => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">{s}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-2xl border border-border">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-navy-900 dark:text-white">No jobs found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
