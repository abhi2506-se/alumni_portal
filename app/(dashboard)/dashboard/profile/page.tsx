'use client';
// app/(dashboard)/dashboard/profile/page.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  User, Briefcase, BookOpen, Globe, Upload, Plus, X,
  Linkedin, Github, Link, Save, Edit3, Camera, Star,
  ChevronDown, Check,
} from 'lucide-react';
import { profileSchema, type ProfileInput } from '@/lib/validators';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

const SECTIONS = ['Personal', 'Professional', 'Skills', 'Social'];
const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Java', 'C++', 'Go', 'Rust', 'AWS', 'GCP', 'Azure', 'Docker',
  'Kubernetes', 'Machine Learning', 'Deep Learning', 'SQL', 'PostgreSQL',
  'MongoDB', 'Redis', 'System Design', 'DSA', 'DevOps', 'CI/CD',
];
const DEPARTMENTS = [
  'Computer Engineering', 'Information Technology', 'Electronics',
  'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Instrumentation',
];

function InputField({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-navy-700 dark:text-navy-200">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Inp({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-navy-800',
        'text-navy-900 dark:text-white placeholder:text-muted-foreground text-sm',
        'focus:outline-none focus:ring-2 focus:ring-navy-300 transition-all',
        className,
      )}
      {...props}
    />
  );
}

function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-navy-800',
        'text-navy-900 dark:text-white placeholder:text-muted-foreground text-sm resize-none',
        'focus:outline-none focus:ring-2 focus:ring-navy-300 transition-all',
        className,
      )}
      {...props}
    />
  );
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [activeSection, setActiveSection] = useState('Personal');
  const [skills, setSkills] = useState<string[]>(['React', 'Python', 'System Design']);
  const [achievements, setAchievements] = useState<string[]>(['Dean\'s List 2023', 'Hackathon Winner']);
  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [openToMentor, setOpenToMentor] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      bio: 'Final year Computer Engineering student passionate about distributed systems and open source.',
      batchYear: 2024,
      department: 'Computer Engineering',
      degree: 'B.E.',
      currentCompany: '',
      currentRole: '',
      city: 'Rajkot',
      country: 'India',
      openToMentor: false,
    },
  });

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && !skills.includes(s) && skills.length < 20) {
      setSkills(prev => [...prev, s]);
      setSkillInput('');
      setShowSkillSuggestions(false);
    }
  }

  function removeSkill(s: string) {
    setSkills(prev => prev.filter(x => x !== s));
  }

  function addAchievement() {
    const a = achievementInput.trim();
    if (a && !achievements.includes(a)) {
      setAchievements(prev => [...prev, a]);
      setAchievementInput('');
    }
  }

  async function onSubmit(data: ProfileInput) {
    setSaving(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, skills, achievements, openToMentor }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Profile saved successfully!');
      await update();
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s),
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your public profile and settings</p>
      </div>

      {/* Profile header card */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-navy-700 via-navy-600 to-gold-500 relative">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <button className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 -mt-10 mb-4">
            <div className={cn(
              'w-20 h-20 rounded-2xl border-4 border-white dark:border-navy-800 flex items-center justify-center text-white text-xl font-bold',
              generateAvatarColor(user?.name ?? 'User'),
            )}>
              {user?.image
                ? <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl" />
                : getInitials(user?.name ?? 'User')}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-xl bg-navy-700 text-white flex items-center justify-center hover:bg-navy-600 transition-colors border-2 border-white dark:border-navy-800">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  user?.role === 'ALUMNI' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700',
                )}>
                  {user?.role}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>

            {/* Mentor toggle */}
            <div className="flex items-center gap-3 bg-navy-50 dark:bg-navy-700 rounded-xl px-4 py-3">
              <Star className="w-4 h-4 text-gold-500" />
              <div>
                <p className="text-xs font-medium text-navy-900 dark:text-white">Open to Mentor</p>
                <p className="text-xs text-muted-foreground">Accept mentorship requests</p>
              </div>
              <button
                onClick={() => setOpenToMentor(p => !p)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative ml-2',
                  openToMentor ? 'bg-navy-700' : 'bg-navy-200 dark:bg-navy-600',
                )}
              >
                <div className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                  openToMentor ? 'left-6' : 'left-1',
                )} />
              </button>
            </div>
          </div>

          {/* Profile completion */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-medium text-navy-900 dark:text-white">60%</span>
            </div>
            <div className="h-2 bg-navy-100 dark:bg-navy-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-2 bg-gradient-to-r from-navy-600 to-gold-400 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Add skills and bio to reach 100%</p>
          </div>
        </div>
      </div>

      {/* Form sections */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section tabs */}
        <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-2xl p-1 mb-6 overflow-x-auto">
          {SECTIONS.map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeSection === sec
                  ? 'bg-navy-700 text-white'
                  : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
              )}
            >
              {sec}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 space-y-5"
          >
            {activeSection === 'Personal' && (
              <>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-navy-500" /> Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="First Name" error={errors.firstName?.message}>
                    <Inp {...register('firstName')} placeholder="Arjun" />
                  </InputField>
                  <InputField label="Last Name" error={errors.lastName?.message}>
                    <Inp {...register('lastName')} placeholder="Mehta" />
                  </InputField>
                </div>
                <InputField label="Bio" hint="Tell the community about yourself (max 500 chars)">
                  <TextArea {...register('bio')} rows={3} placeholder="I am a passionate engineer who loves…" maxLength={500} />
                </InputField>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="City">
                    <Inp {...register('city')} placeholder="Rajkot" />
                  </InputField>
                  <InputField label="Country">
                    <Inp {...register('country')} placeholder="India" />
                  </InputField>
                </div>
                <InputField label="Phone">
                  <Inp {...register('phone')} type="tel" placeholder="+91 99999 00000" />
                </InputField>
              </>
            )}

            {activeSection === 'Professional' && (
              <>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-navy-500" /> Professional Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Current Company">
                    <Inp {...register('currentCompany')} placeholder="Google" />
                  </InputField>
                  <InputField label="Current Role">
                    <Inp {...register('currentRole')} placeholder="Software Engineer" />
                  </InputField>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <InputField label="Batch Year">
                    <Inp {...register('batchYear')} type="number" placeholder="2024" />
                  </InputField>
                  <InputField label="Degree">
                    <select {...register('degree')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300">
                      <option value="">Select degree</option>
                      {['B.E.', 'B.Tech', 'M.E.', 'M.Tech', 'MBA', 'PhD'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </InputField>
                  <InputField label="Department">
                    <select {...register('department')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300">
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </InputField>
                </div>

                {/* Achievements */}
                <InputField label="Achievements">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {achievements.map(a => (
                        <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 text-xs rounded-lg font-medium">
                          ⭐ {a}
                          <button type="button" onClick={() => setAchievements(p => p.filter(x => x !== a))} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Inp
                        value={achievementInput}
                        onChange={e => setAchievementInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAchievement(); } }}
                        placeholder="e.g. Dean's List, Hackathon Winner"
                      />
                      <button type="button" onClick={addAchievement} className="btn-outline px-4 py-2 rounded-xl text-sm">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </InputField>
              </>
            )}

            {activeSection === 'Skills' && (
              <>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-navy-500" /> Skills & Expertise
                </h3>
                <p className="text-sm text-muted-foreground">Add up to 20 skills that represent your expertise</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <motion.span
                      key={skill}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-sm rounded-xl font-medium"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                </div>

                {/* Skill input */}
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Inp
                        value={skillInput}
                        onChange={e => { setSkillInput(e.target.value); setShowSkillSuggestions(true); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                        onFocus={() => setShowSkillSuggestions(true)}
                        placeholder="Type a skill and press Enter…"
                      />
                      {showSkillSuggestions && skillInput && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-navy-800 border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                          {filteredSuggestions.slice(0, 6).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => addSkill(s)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-navy-50 dark:hover:bg-navy-700 text-navy-900 dark:text-white transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-4 py-2 rounded-xl text-sm">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Suggestion chips */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Popular skills — click to add:</p>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-dashed border-border text-muted-foreground hover:border-navy-400 hover:text-navy-700 dark:hover:text-navy-200 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSection === 'Social' && (
              <>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-navy-500" /> Social Links
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'LinkedIn', field: 'linkedinUrl', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourname', color: 'text-blue-600' },
                    { label: 'GitHub', field: 'githubUrl', icon: Github, placeholder: 'https://github.com/yourname', color: 'text-gray-700 dark:text-gray-300' },
                    { label: 'Portfolio', field: 'portfolioUrl', icon: Link, placeholder: 'https://yourportfolio.com', color: 'text-purple-600' },
                  ].map(({ label, field, icon: Icon, placeholder, color }) => (
                    <InputField key={field} label={label}>
                      <div className="relative">
                        <Icon className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4', color)} />
                        <Inp
                          {...register(field as keyof ProfileInput)}
                          placeholder={placeholder}
                          className="pl-10"
                        />
                      </div>
                    </InputField>
                  ))}

                  <InputField label="Resume URL" hint="Link to your resume (Google Drive, Notion, etc.)">
                    <div className="relative">
                      <Upload className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Inp {...register('resumeUrl' as any)} placeholder="https://drive.google.com/…" className="pl-10" />
                    </div>
                  </InputField>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save button */}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" className="btn-outline py-2.5 px-6 rounded-xl text-sm">
            Discard
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold py-2.5 px-6 rounded-xl text-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save Profile</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
