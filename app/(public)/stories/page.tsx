'use client';
// app/(public)/stories/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Quote, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

const STORIES = [
  {
    id: 's1', name: 'Arjun Mehta', batch: 2019, company: 'Google',
    role: 'Senior Software Engineer', dept: 'Computer Engineering',
    title: 'From GEC to Google: My Journey',
    content: `When I graduated from GEC Rajkot in 2019, I had no idea I'd be at Google within two years. The Alumni Portal was instrumental in that journey. I connected with a senior alumni who was already at Google, and through weekly mentorship sessions on this platform, I prepared for the infamous Google interview process.\n\nThe mentorship sessions were intense but incredibly valuable. My mentor shared not just technical guidance but also insights into Google's culture, the interview loops, and how to present myself. I cracked all 5 rounds on my first attempt.\n\nNow I'm on the other side — I've conducted 40+ mentorship sessions through this portal, helping GEC students navigate their own paths to top tech companies. The cycle continues.`,
    videoUrl: null, hasVideo: false, rating: 5,
    highlight: 'Cracked Google in first attempt after 6 months of mentorship',
    color: 'from-blue-600 to-violet-600',
  },
  {
    id: 's2', name: 'Priya Sharma', batch: 2017, company: 'EduStart (Founder)',
    role: 'CEO & Founder', dept: 'Information Technology',
    title: 'Building India\'s Largest EdTech Platform',
    content: `I didn't take the conventional route. While my peers were placing at MNCs, I had a burning desire to build something. But entrepreneurship is lonely — until you have a network behind you.\n\nThe Alumni Portal connected me with 3 senior alumni who became my first advisors. One introduced me to an angel investor, another became my CTO, and the third helped me navigate GTU curriculum design for our course offerings.\n\nWe launched EduStart in 2020 during the pandemic when the need for online education exploded. Today, we're a $5M ARR company serving 2 lakh students across India. None of this would have been possible without the connections I made through this portal.\n\nMy advice to current students: your network is your net worth. Start building it now.`,
    videoUrl: null, hasVideo: true, rating: 5,
    highlight: 'Built $5M ARR startup using alumni network connections',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 's3', name: 'Rohan Patel', batch: 2020, company: 'Microsoft',
    role: 'Product Manager', dept: 'Computer Engineering',
    title: 'Engineer to PM: Making the Leap',
    content: `Transitioning from a software engineering role to product management is notoriously difficult. Companies rarely hire engineers straight into PM roles without prior product experience.\n\nI found my path through the Alumni Portal's mentorship feature. I booked sessions with two alumni who were PMs at top companies. Over 4 months, they guided me through building a product portfolio, crafting my narrative, and preparing for PM interview frameworks like CIRCLES and STAR.\n\nI applied to Microsoft's APM program and converted. I started as an APM and got promoted to full PM within 18 months — one of the fastest in my cohort.\n\nThe key insight from my mentors: "You're not changing careers, you're extending your skills." That framing changed everything.`,
    videoUrl: null, hasVideo: false, rating: 5,
    highlight: 'Transitioned from SWE to PM at Microsoft via mentorship',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 's4', name: 'Ananya Singh', batch: 2018, company: 'DeepMind',
    role: 'ML Research Scientist', dept: 'Electronics',
    title: 'From Electronics to AI Research at DeepMind',
    content: `Electronics engineering to AI research at one of the world's most prestigious AI labs — it sounds improbable, but it happened. And this portal played a key role.\n\nI discovered my passion for machine learning in my third year. But with an Electronics background, breaking into ML felt impossible. The Alumni Portal helped me find Kiran, a senior alumni doing his PhD at IIT who later joined an AI lab in London.\n\nKiran became my research mentor. He guided me through reading papers, replicating experiments, and eventually co-authoring my first paper. That publication opened doors I couldn't have imagined — including my DeepMind application.\n\nI'm now working on AI safety research. The journey from EC department at GEC to DeepMind took 4 years, countless late nights, and the unwavering support of my alumni mentor.`,
    videoUrl: null, hasVideo: true, rating: 5,
    highlight: 'EC graduate to ML Research Scientist at DeepMind',
    color: 'from-orange-500 to-red-600',
  },
];

function StoryCard({ story, onClick }: { story: typeof STORIES[0]; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        {/* Gradient banner */}
        <div className={cn('h-32 bg-gradient-to-br relative overflow-hidden', story.color)}>
          <div className="absolute inset-0 dot-pattern opacity-20" />
          {story.hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-4">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm font-medium">
              Batch {story.batch}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', generateAvatarColor(story.name))}>
              {getInitials(story.name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-navy-900 dark:text-white text-sm">{story.name}</p>
              <p className="text-xs text-muted-foreground truncate">{story.role}</p>
              <p className="text-xs text-gold-600 font-medium">{story.company}</p>
            </div>
          </div>

          <h3 className="font-display font-semibold text-base text-navy-900 dark:text-white mb-2 leading-tight">
            {story.title}
          </h3>

          <div className="flex items-start gap-2 mb-4 flex-1">
            <Quote className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {story.content.split('\n')[0]}
            </p>
          </div>

          {/* Highlight */}
          <div className="bg-gold-50 dark:bg-gold-900/20 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs text-gold-700 dark:text-gold-400 font-medium">⭐ {story.highlight}</p>
          </div>

          {/* Stars */}
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              {[...Array(story.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-xs text-navy-500 dark:text-navy-400 font-medium group-hover:text-navy-700 dark:group-hover:text-navy-200 flex items-center gap-1 transition-colors">
              Read story <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StoryModal({ story, onClose }: { story: typeof STORIES[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Banner */}
        <div className={cn('h-40 bg-gradient-to-br relative overflow-hidden flex-shrink-0', story.color)}>
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className={cn('w-14 h-14 rounded-2xl border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg', generateAvatarColor(story.name))}>
              {getInitials(story.name)}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{story.name}</p>
              <p className="text-white/80 text-sm">{story.role} · {story.company}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white">{story.title}</h2>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 font-medium">
              Batch {story.batch}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 font-medium">
              {story.dept}
            </span>
            <div className="flex gap-0.5">
              {[...Array(story.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
          </div>

          {/* Highlight box */}
          <div className="bg-gradient-to-r from-gold-50 to-orange-50 dark:from-gold-900/20 dark:to-orange-900/20 border border-gold-200 dark:border-gold-700 rounded-2xl px-4 py-3">
            <p className="text-sm text-gold-800 dark:text-gold-300 font-semibold">⭐ {story.highlight}</p>
          </div>

          {/* Full story */}
          <div className="space-y-4">
            {story.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-navy-700 dark:text-navy-200 leading-relaxed">{para}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Verified alumni story</p>
          <Link
            href="/register"
            className="btn-gold text-sm py-2 px-5 rounded-xl flex items-center gap-2"
          >
            Join the Network <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SuccessStoriesPage() {
  const [selected, setSelected] = useState<typeof STORIES[0] | null>(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-50 dark:bg-navy-950 pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3"
            >
              Alumni Success Stories
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl font-bold text-navy-900 dark:text-white mb-4"
            >
              Stories That Inspire
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Real journeys, real achievements. See how GEC Rajkot alumni are making their mark worldwide.
            </motion.p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-14">
            {[
              { value: '5,200+', label: 'Alumni Stories'    },
              { value: '₹45 LPA', label: 'Top Package'      },
              { value: '25+',    label: 'Countries'         },
              { value: '50+',    label: 'Startups Founded'  },
            ].map(({ value, label }) => (
              <div key={label} className="text-center px-6 py-4 bg-white dark:bg-navy-800 rounded-2xl border border-border">
                <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Stories grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {STORIES.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StoryCard story={story} onClick={() => setSelected(story)} />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-navy-700 to-navy-600 rounded-3xl px-10 py-8 text-white">
              <h2 className="font-display text-2xl font-bold mb-2">Have a Story to Share?</h2>
              <p className="text-navy-300 mb-6 max-w-md mx-auto text-sm">
                Log in and submit your success story to inspire the next generation of GEC engineers.
              </p>
              <Link href="/login" className="btn-gold px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                Share Your Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story modal */}
      <AnimatePresence>
        {selected && <StoryModal story={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </>
  );
}
