'use client';
// app/(dashboard)/dashboard/alumni-map/page.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Users, Filter } from 'lucide-react';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

// Alumni location data (lat, lng, count, city)
const ALUMNI_LOCATIONS = [
  { id: 1,  city: 'Bangalore',      country: 'India',         lat: 12.97,   lng: 77.59,   count: 450, alumni: ['Arjun Mehta', 'Kavya Reddy', 'Harsh Patel'] },
  { id: 2,  city: 'Mumbai',         country: 'India',         lat: 19.08,   lng: 72.88,   count: 310, alumni: ['Priya Sharma', 'Sneha Joshi'] },
  { id: 3,  city: 'Hyderabad',      country: 'India',         lat: 17.39,   lng: 78.49,   count: 280, alumni: ['Rohan Patel', 'Divya Trivedi'] },
  { id: 4,  city: 'Pune',           country: 'India',         lat: 18.52,   lng: 73.86,   count: 190, alumni: ['Raju Kumar', 'Vijay Shah'] },
  { id: 5,  city: 'Delhi NCR',      country: 'India',         lat: 28.61,   lng: 77.20,   count: 220, alumni: ['Pooja Verma'] },
  { id: 6,  city: 'Ahmedabad',      country: 'India',         lat: 23.03,   lng: 72.59,   count: 145, alumni: ['Vikram Shah'] },
  { id: 7,  city: 'Rajkot',         country: 'India',         lat: 22.30,   lng: 70.80,   count: 680, alumni: ['Many Students'] },
  { id: 8,  city: 'San Francisco',  country: 'USA',           lat: 37.77,   lng: -122.42, count: 95,  alumni: ['Tech alumni'] },
  { id: 9,  city: 'New York',       country: 'USA',           lat: 40.71,   lng: -74.01,  count: 42,  alumni: ['Finance alumni'] },
  { id: 10, city: 'London',         country: 'UK',            lat: 51.51,   lng: -0.13,   count: 38,  alumni: ['Ananya Singh'] },
  { id: 11, city: 'Singapore',      country: 'Singapore',     lat: 1.35,    lng: 103.82,  count: 28,  alumni: ['Singapore alumni'] },
  { id: 12, city: 'Dubai',          country: 'UAE',           lat: 25.20,   lng: 55.27,   count: 54,  alumni: ['UAE alumni'] },
  { id: 13, city: 'Toronto',        country: 'Canada',        lat: 43.65,   lng: -79.38,  count: 22,  alumni: ['Canada alumni'] },
  { id: 14, city: 'Sydney',         country: 'Australia',     lat: -33.87,  lng: 151.21,  count: 15,  alumni: ['Australia alumni'] },
  { id: 15, city: 'Berlin',         country: 'Germany',       lat: 52.52,   lng: 13.40,   count: 12,  alumni: ['Europe alumni'] },
];

const STATS_BY_COUNTRY = [
  { country: 'India',     count: 4512, flag: '🇮🇳' },
  { country: 'USA',       count: 187,  flag: '🇺🇸' },
  { country: 'UAE',       count: 95,   flag: '🇦🇪' },
  { country: 'UK',        count: 78,   flag: '🇬🇧' },
  { country: 'Singapore', count: 56,   flag: '🇸🇬' },
  { country: 'Canada',    count: 48,   flag: '🇨🇦' },
  { country: 'Germany',   count: 32,   flag: '🇩🇪' },
  { country: 'Australia', count: 28,   flag: '🇦🇺' },
];

// SVG World Map dot representation
function WorldMapSVG({ locations, selected, onSelect }: {
  locations: typeof ALUMNI_LOCATIONS;
  selected: typeof ALUMNI_LOCATIONS[0] | null;
  onSelect: (loc: typeof ALUMNI_LOCATIONS[0] | null) => void;
}) {
  // Map lat/lng to SVG coordinates (simplified Mercator-ish)
  function toSVG(lat: number, lng: number): [number, number] {
    const x = ((lng + 180) / 360) * 900;
    const y = ((90 - lat) / 180) * 450;
    return [x, y];
  }

  return (
    <div className="relative w-full bg-navy-950 rounded-2xl overflow-hidden">
      <svg
        viewBox="0 0 900 450"
        className="w-full"
        style={{ background: 'linear-gradient(180deg, #0d1129 0%, #151a53 100%)' }}
      >
        {/* Grid lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="900" y2={i * 50} stroke="#1e2a85" strokeWidth="0.5" opacity={0.3} />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" stroke="#1e2a85" strokeWidth="0.5" opacity={0.3} />
        ))}

        {/* Equator */}
        <line x1="0" y1="225" x2="900" y2="225" stroke="#3b5ff4" strokeWidth="0.5" opacity={0.4} strokeDasharray="4 4" />

        {/* Alumni dots */}
        {locations.map(loc => {
          const [x, y] = toSVG(loc.lat, loc.lng);
          const r = Math.max(6, Math.min(20, Math.sqrt(loc.count) / 1.5));
          const isSelected = selected?.id === loc.id;

          return (
            <g key={loc.id} onClick={() => onSelect(isSelected ? null : loc)} style={{ cursor: 'pointer' }}>
              {/* Pulse rings */}
              {[1, 2].map(ring => (
                <circle
                  key={ring}
                  cx={x} cy={y}
                  r={r + ring * 8}
                  fill="none"
                  stroke={isSelected ? '#f59e0b' : '#3b5ff4'}
                  strokeWidth="1"
                  opacity={0.15 / ring}
                >
                  <animate attributeName="r" values={`${r};${r + 20};${r}`} dur={`${2 + ring}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values={`0.3;0;0.3`} dur={`${2 + ring}s`} repeatCount="indefinite" />
                </circle>
              ))}
              {/* Main dot */}
              <circle
                cx={x} cy={y}
                r={r}
                fill={isSelected ? '#f59e0b' : '#3b5ff4'}
                stroke={isSelected ? '#fcd34d' : '#60a5fa'}
                strokeWidth="2"
                opacity={0.9}
              />
              {/* Count label */}
              <text
                x={x} y={y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={r > 12 ? '9' : '7'}
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {loc.count > 99 ? `${Math.round(loc.count / 100)}k+` : loc.count}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Popup */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-4 min-w-56 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <MapPin className="w-4 h-4 text-gold-400" />
            <p className="font-semibold text-white">{selected.city}, {selected.country}</p>
          </div>
          <p className="text-gold-300 font-display text-xl font-bold">{selected.count}</p>
          <p className="text-navy-300 text-xs">alumni based here</p>
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {selected.alumni.slice(0, 2).map(name => (
              <span key={name} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white">{name}</span>
            ))}
            {selected.alumni.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white">+{selected.alumni.length - 2} more</span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function AlumniMapPage() {
  const [selected, setSelected] = useState<typeof ALUMNI_LOCATIONS[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'india' | 'international'>('all');

  const locations = ALUMNI_LOCATIONS.filter(l => {
    if (filter === 'india') return l.country === 'India';
    if (filter === 'international') return l.country !== 'India';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-gold-500" /> Alumni World Map
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Our graduates are making an impact across 25+ countries</p>
        </div>
        {/* Filter */}
        <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1">
          {(['all', 'india', 'international'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                filter === f ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Countries',         value: '25+',   icon: Globe,   color: 'bg-blue-500'  },
          { label: 'Total Alumni',      value: '5,200', icon: Users,   color: 'bg-navy-600'  },
          { label: 'Cities',            value: '80+',   icon: MapPin,  color: 'bg-green-500' },
          { label: 'Hiring Companies',  value: '300+',  icon: Filter,  color: 'bg-gold-500'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-navy-800 rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-navy-900 dark:text-white text-lg">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div>
        <WorldMapSVG locations={locations} selected={selected} onSelect={setSelected} />
        <p className="text-xs text-muted-foreground text-center mt-2">Click on a dot to see alumni details · Dot size = number of alumni</p>
      </div>

      {/* Country breakdown */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Alumni by Country</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS_BY_COUNTRY.map(({ country, count, flag }, i) => (
            <motion.div
              key={country}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-700/50 hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors cursor-pointer"
            >
              <span className="text-2xl">{flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900 dark:text-white">{country}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-navy-200 dark:bg-navy-600">
                    <div
                      className="h-1 rounded-full bg-navy-600 dark:bg-gold-400"
                      style={{ width: `${(count / STATS_BY_COUNTRY[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{count}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
