'use client';
// app/(dashboard)/dashboard/jobs/new/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Briefcase, MapPin, DollarSign, Link, Plus, X,
  ArrowLeft, Send, Calendar, Tag,
} from 'lucide-react';
import { jobSchema, type JobInput } from '@/lib/validators';
import { cn } from '@/lib/utils/helpers';
import Link2 from 'next/link';

const JOB_TYPES = [
  { value: 'FULL_TIME',  label: 'Full Time'  },
  { value: 'PART_TIME',  label: 'Part Time'  },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'CONTRACT',   label: 'Contract'   },
  { value: 'FREELANCE',  label: 'Freelance'  },
];

const SKILL_CHIPS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'Go', 'Rust', 'AWS', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'Machine Learning', 'System Design',
];

function Inp({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800',
        'text-navy-900 dark:text-white placeholder:text-muted-foreground text-sm',
        'focus:outline-none focus:ring-2 focus:ring-navy-300 transition-all',
        className,
      )}
      {...props}
    />
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function NewJobPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>(['B.E./B.Tech in relevant field']);
  const [skillInput, setSkillInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: 'FULL_TIME',
      location: 'Bangalore, India',
    },
  });

  const jobType = watch('type');

  function addSkill(s: string) {
    const trimmed = s.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 15) {
      setSkills(p => [...p, trimmed]);
      setSkillInput('');
    }
  }

  function addReq() {
    const trimmed = reqInput.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements(p => [...p, trimmed]);
      setReqInput('');
    }
  }

  async function onSubmit(data: JobInput) {
    if (skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, skills, requirements }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to post job');
      toast.success('Job posted! Awaiting admin approval.');
      router.push('/dashboard/jobs');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Redirect non-alumni
  if (user?.role === 'STUDENT') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-2">Alumni Only</h2>
        <p className="text-muted-foreground mb-6">Only alumni can post jobs on the portal.</p>
        <Link2 href="/dashboard/jobs" className="btn-primary text-sm py-2.5 px-5 rounded-xl">
          Browse Jobs
        </Link2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link2 href="/dashboard/jobs" className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link2>
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Post a Job</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Share an opportunity with students and alumni</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl text-sm text-blue-800 dark:text-blue-300">
        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">i</div>
        Jobs are reviewed by admin before being published. Typically approved within 24 hours.
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">

          {/* Basic Info */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-navy-500" /> Basic Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Job Title</Label>
                <Inp {...register('title')} placeholder="e.g. Software Engineer II" />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label required>Company</Label>
                <Inp {...register('company')} placeholder="e.g. Google" />
                {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
              </div>
            </div>

            <div>
              <Label required>Description</Label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe the role, responsibilities, and what makes this opportunity special…"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-navy-900 dark:text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            {/* Job type */}
            <div>
              <Label required>Job Type</Label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setValue('type', t.value as any)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                      jobType === t.value
                        ? 'bg-navy-700 text-white border-navy-700'
                        : 'bg-white dark:bg-navy-700 text-navy-600 dark:text-navy-300 border-border hover:border-navy-400',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-navy-500" /> Location & Compensation
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Inp {...register('location')} placeholder="Bangalore, India or Remote" className="pl-10" />
                </div>
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <Label>Salary / Stipend</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Inp {...register('salary')} placeholder="e.g. ₹20–35 LPA" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Apply Link</Label>
                <div className="relative">
                  <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Inp {...register('applyUrl')} placeholder="https://company.com/careers/…" className="pl-10" />
                </div>
                {errors.applyUrl && <p className="text-xs text-red-500 mt-1">{errors.applyUrl.message}</p>}
              </div>
              <div>
                <Label>Application Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Inp {...register('deadline')} type="date" className="pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-navy-500" /> Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <motion.span
                  key={s}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-sm rounded-xl font-medium"
                >
                  {s}
                  <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} className="hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="flex gap-2">
              <Inp
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                placeholder="Type a skill and press Enter"
              />
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-outline px-4 rounded-xl text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <p className="text-xs text-muted-foreground w-full mb-1">Quick add:</p>
              {SKILL_CHIPS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-navy-400 hover:text-navy-700 dark:hover:text-navy-200 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white">Requirements</h2>
            <div className="space-y-2">
              {requirements.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 bg-navy-50 dark:bg-navy-700 px-4 py-2.5 rounded-xl"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-navy-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-navy-700 dark:text-navy-200">{r}</span>
                  <button type="button" onClick={() => setRequirements(p => p.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <Inp
                value={reqInput}
                onChange={e => setReqInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReq(); } }}
                placeholder="e.g. 2+ years experience, Strong DSA skills"
              />
              <button type="button" onClick={addReq} className="btn-outline px-4 rounded-xl text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Link2 href="/dashboard/jobs" className="btn-outline py-3 px-6 rounded-xl text-sm">
              Cancel
            </Link2>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold py-3 px-8 rounded-xl text-sm disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Posting…</>
              ) : (
                <><Send className="w-4 h-4" /> Post Job</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
