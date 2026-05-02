'use client';
// app/(admin)/admin/courses/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen, Plus, Edit3, Trash2, Search, Video,
  Clock, Users, Star, ChevronDown, X, Save,
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

const INIT_COURSES = [
  {
    id: 'c1', title: 'System Design Masterclass', instructor: 'Arjun Mehta (Google)',
    category: 'Engineering', duration: '8 hours', enrolled: 234, rating: 4.9,
    level: 'Advanced', status: 'PUBLISHED', thumbnail: null,
    desc: 'Master system design for top tech interviews. Covers distributed systems, databases, caching, and real-world case studies.',
  },
  {
    id: 'c2', title: 'Product Management 101', instructor: 'Rohan Patel (Microsoft)',
    category: 'Product', duration: '6 hours', enrolled: 189, rating: 4.8,
    level: 'Beginner', status: 'PUBLISHED', thumbnail: null,
    desc: 'Complete guide to product management for engineers. Frameworks, user research, roadmapping, and stakeholder management.',
  },
  {
    id: 'c3', title: 'Full-Stack Development with Next.js', instructor: 'Priya Sharma (EduStart)',
    category: 'Development', duration: '12 hours', enrolled: 312, rating: 4.7,
    level: 'Intermediate', status: 'PUBLISHED', thumbnail: null,
    desc: 'Build production-ready web apps with Next.js 14, Tailwind CSS, Prisma, and PostgreSQL.',
  },
  {
    id: 'c4', title: 'Machine Learning Fundamentals', instructor: 'Ananya Singh (DeepMind)',
    category: 'AI/ML', duration: '10 hours', enrolled: 156, rating: 5.0,
    level: 'Intermediate', status: 'DRAFT', thumbnail: null,
    desc: 'Comprehensive ML course covering supervised learning, neural networks, and hands-on projects with PyTorch.',
  },
  {
    id: 'c5', title: 'DevOps & Cloud with AWS', instructor: 'Vikram Shah (Zomato)',
    category: 'DevOps', duration: '9 hours', enrolled: 98, rating: 4.6,
    level: 'Advanced', status: 'PUBLISHED', thumbnail: null,
    desc: 'Production DevOps practices: CI/CD, Docker, Kubernetes, AWS services, and infrastructure as code.',
  },
];

const CATEGORIES = ['All', 'Engineering', 'Product', 'Development', 'AI/ML', 'DevOps', 'Career'];
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced'];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced:     'bg-purple-100 text-purple-700',
};

function CourseForm({ course, onSave, onClose }: {
  course?: typeof INIT_COURSES[0] | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title:       course?.title       ?? '',
    instructor:  course?.instructor  ?? '',
    category:    course?.category    ?? 'Engineering',
    duration:    course?.duration    ?? '',
    level:       course?.level       ?? 'Beginner',
    desc:        course?.desc        ?? '',
    status:      course?.status      ?? 'DRAFT',
  });

  function change(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-display font-bold text-navy-900 dark:text-white">{course ? 'Edit Course' : 'Add New Course'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[
            { key: 'title', label: 'Course Title', placeholder: 'e.g. System Design Masterclass' },
            { key: 'instructor', label: 'Instructor', placeholder: 'e.g. Arjun Mehta (Google)' },
            { key: 'duration', label: 'Duration', placeholder: 'e.g. 8 hours' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={e => change(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Category</label>
              <select value={form.category} onChange={e => change('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Level</label>
              <select value={form.level} onChange={e => change('level', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none">
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Description</label>
            <textarea value={form.desc} onChange={e => change('desc', e.target.value)} rows={3} placeholder="What will students learn?" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Status</label>
            <div className="flex gap-2">
              {['DRAFT', 'PUBLISHED'].map(s => (
                <button key={s} type="button" onClick={() => change('status', s)} className={cn('flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all', form.status === s ? 'bg-navy-700 text-white border-navy-700' : 'border-border text-muted-foreground hover:border-navy-400')}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-navy-50 dark:hover:bg-navy-700">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {course ? 'Save Changes' : 'Add Course'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(INIT_COURSES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<typeof INIT_COURSES[0] | null>(null);

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  function handleSave(data: any) {
    if (editing) {
      setCourses(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c));
      toast.success('Course updated!');
    } else {
      setCourses(prev => [...prev, { id: `c${Date.now()}`, ...data, enrolled: 0, rating: 0, thumbnail: null }]);
      toast.success('Course created!');
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Course Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage alumni-taught courses for students</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-gold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses',   value: courses.length,                                         color: 'bg-navy-600'  },
          { label: 'Published',       value: courses.filter(c => c.status === 'PUBLISHED').length,    color: 'bg-green-500' },
          { label: 'Total Enrolled',  value: courses.reduce((s, c) => s + c.enrolled, 0),            color: 'bg-blue-500'  },
          { label: 'Avg Rating',      value: (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1), color: 'bg-gold-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-navy-900 dark:text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all', category === cat ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white')}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-28 bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center relative">
                <BookOpen className="w-10 h-10 text-white/40" />
                <div className="absolute top-3 left-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', LEVEL_COLORS[course.level] ?? 'bg-gray-100 text-gray-700')}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                    {course.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-navy-900 dark:text-white text-sm leading-tight mb-1">{course.title}</h3>
                <p className="text-xs text-gold-600 font-medium mb-2">{course.instructor}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.desc}</p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrolled}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />{course.rating}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { setEditing(course); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => { setCourses(prev => prev.filter(c => c.id !== course.id)); toast.success('Course removed'); }} className="p-2 rounded-xl border border-border hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-2xl border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-navy-900 dark:text-white">No courses found</p>
        </div>
      )}

      <AnimatePresence>
        {showForm && <CourseForm course={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      </AnimatePresence>
    </div>
  );
}
