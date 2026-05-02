// components/layout/Footer.tsx
import Link from 'next/link';
import { GraduationCap, Twitter, Linkedin, Github, Mail, MapPin, Phone } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'Alumni Directory', href: '/alumni' },
    { label: 'Job Board',       href: '/jobs'   },
    { label: 'Events',          href: '/events' },
    { label: 'Mentorship',      href: '/mentors' },
    { label: 'Success Stories', href: '/stories' },
  ],
  Resources: [
    { label: 'About Us',    href: '/about'   },
    { label: 'Blog',        href: '/blog'    },
    { label: 'FAQ',         href: '/faq'     },
    { label: 'Privacy',     href: '/privacy' },
    { label: 'Terms',       href: '/terms'   },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 border border-navy-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5 text-gold-400" />
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Alumni<span className="text-gold-400">Portal</span>
              </span>
            </Link>
            <p className="text-navy-400 leading-relaxed max-w-sm mb-6">
              Connecting generations of graduates. Building futures together since 2020.
              Your college's official professional network.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter,  href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github,   href: '#' },
                { icon: Mail,     href: 'mailto:alumni@college.edu' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-navy-400 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="py-6 border-y border-navy-800 flex flex-col sm:flex-row gap-4 text-sm text-navy-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-500" />
            Government Engineering College, Rajkot, Gujarat 360005
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold-500" />
            alumni@gec.edu.in
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold-500" />
            +91 99999 00000
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-navy-500">
          <p>© {new Date().getFullYear()} Alumni Portal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-navy-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-navy-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
