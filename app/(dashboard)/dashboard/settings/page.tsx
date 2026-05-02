'use client';
// app/(dashboard)/dashboard/settings/page.tsx
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Bell, Lock, Shield, Eye, Trash2, Moon, Sun, Globe,
  ChevronRight, Check, AlertTriangle, Download, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

function SettingRow({ icon: Icon, label, desc, children }: {
  icon: React.ElementType; label: string; desc?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-navy-600 dark:text-navy-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-navy-900 dark:text-white">{label}</p>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'w-11 h-6 rounded-full transition-colors relative',
        value ? 'bg-navy-700' : 'bg-navy-200 dark:bg-navy-600',
      )}
    >
      <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', value ? 'left-6' : 'left-1')} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [notifs, setNotifs] = useState({
    messages:    true,
    mentorship:  true,
    jobs:        true,
    events:      true,
    connections: true,
    email:       true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile:   true,
    showEmail:       false,
    showPhone:       false,
    allowMessages:   true,
    allowMentorship: true,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveSettings() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Settings saved!');
    setSaving(false);
  }

  async function changePassword() {
    toast('Password reset email sent to ' + user?.email, { icon: '📧' });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      {/* Account */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-navy-500" /> Account
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Manage your login credentials and security</p>

        <SettingRow icon={Lock} label="Change Password" desc="Last changed: Never">
          <button onClick={changePassword} className="text-sm text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            Reset <ChevronRight className="w-4 h-4" />
          </button>
        </SettingRow>

        <SettingRow icon={Shield} label="Two-Factor Authentication" desc="Add extra security to your account">
          <button className="text-xs px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 hover:bg-navy-200 dark:hover:bg-navy-600 transition-colors font-medium">
            Enable
          </button>
        </SettingRow>

        <SettingRow icon={Download} label="Download My Data" desc="Get a copy of all your portal data">
          <button className="text-xs px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 hover:bg-navy-200 dark:hover:bg-navy-600 transition-colors font-medium">
            Request
          </button>
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-navy-500" /> Notifications
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Choose what you want to be notified about</p>

        {[
          { key: 'messages',    label: 'New Messages',          desc: 'When someone sends you a message'        },
          { key: 'mentorship',  label: 'Mentorship Updates',    desc: 'Booking confirmations and reminders'     },
          { key: 'jobs',        label: 'Job Matches',           desc: 'New jobs matching your skills'           },
          { key: 'events',      label: 'Event Reminders',       desc: '24h before your RSVPd events'           },
          { key: 'connections', label: 'Connection Requests',   desc: 'When someone wants to connect'          },
          { key: 'email',       label: 'Email Notifications',   desc: 'Also send notifications to your email'  },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} icon={Bell} label={label} desc={desc}>
            <Toggle
              value={notifs[key as keyof typeof notifs]}
              onChange={v => setNotifs(p => ({ ...p, [key]: v }))}
            />
          </SettingRow>
        ))}
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-1 flex items-center gap-2">
          <Eye className="w-4 h-4 text-navy-500" /> Privacy
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Control who can see your information</p>

        {[
          { key: 'publicProfile',   label: 'Public Profile',         desc: 'Visible to non-logged-in visitors (name and highlights only)' },
          { key: 'showEmail',       label: 'Show Email Address',      desc: 'Display email on your profile'           },
          { key: 'showPhone',       label: 'Show Phone Number',       desc: 'Display phone on your profile'           },
          { key: 'allowMessages',   label: 'Allow Messages',          desc: 'Let connections send you messages'       },
          { key: 'allowMentorship', label: 'Open to Mentorship',      desc: 'Appear in mentorship search results'    },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} icon={Globe} label={label} desc={desc}>
            <Toggle
              value={privacy[key as keyof typeof privacy]}
              onChange={v => setPrivacy(p => ({ ...p, [key]: v }))}
            />
          </SettingRow>
        ))}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-gold py-3 px-8 rounded-xl text-sm disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Saving…</>
          ) : (
            <><Check className="w-4 h-4" /> Save Settings</>
          )}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-red-200 dark:border-red-800/50 p-6">
        <h2 className="font-display font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-xs text-muted-foreground mb-5">These actions are permanent and cannot be undone</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-navy-900 dark:hover:text-white hover:border-navy-400 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
          >
            <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-3">
              Are you absolutely sure? This will permanently delete your account, profile, messages, and all data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.error('Account deletion is disabled in demo mode');
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-navy-700 border border-border text-sm hover:bg-navy-50 dark:hover:bg-navy-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
