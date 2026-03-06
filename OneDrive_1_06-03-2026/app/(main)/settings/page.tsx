'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Moon, 
  Lock, 
  HelpCircle,
  FileText,
  Shield,
  ChevronRight,
  Smartphone,
  Volume2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [newFollowers, setNewFollowers] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        { 
          icon: Bell, 
          label: 'Push Notifications', 
          description: 'Get notified about important updates',
          type: 'switch' as const,
          value: notifications,
          onChange: setNotifications
        },
        { 
          icon: Smartphone, 
          label: 'Order Updates', 
          description: 'Notifications for order status',
          type: 'switch' as const,
          value: orderUpdates,
          onChange: setOrderUpdates
        },
        { 
          icon: Bell, 
          label: 'New Followers', 
          description: 'When someone follows you',
          type: 'switch' as const,
          value: newFollowers,
          onChange: setNewFollowers
        },
        { 
          icon: Volume2, 
          label: 'Sound Effects', 
          description: 'Play sounds for notifications',
          type: 'switch' as const,
          value: soundEffects,
          onChange: setSoundEffects
        },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          description: 'Switch to dark theme',
          type: 'switch' as const,
          value: darkMode,
          onChange: setDarkMode
        },
        { 
          icon: Globe, 
          label: 'Language', 
          description: 'Choose your preferred language',
          type: 'select' as const,
          value: language,
          onChange: setLanguage,
          options: [
            { value: 'en', label: 'English' },
            { value: 'te', label: 'Telugu' },
            { value: 'hi', label: 'Hindi' },
            { value: 'ta', label: 'Tamil' },
            { value: 'kn', label: 'Kannada' },
          ]
        },
      ]
    },
    {
      title: 'Security',
      items: [
        { 
          icon: Lock, 
          label: 'Change Password', 
          type: 'link' as const,
          href: '/settings/password'
        },
        { 
          icon: Shield, 
          label: 'Privacy Settings', 
          type: 'link' as const,
          href: '/settings/privacy'
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          type: 'link' as const,
          href: '/help'
        },
        { 
          icon: FileText, 
          label: 'Terms & Conditions', 
          type: 'link' as const,
          href: '/terms'
        },
        { 
          icon: Shield, 
          label: 'Privacy Policy', 
          type: 'link' as const,
          href: '/privacy'
        },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">
              {section.title}
            </h2>
            <Card className="divide-y divide-border">
              {section.items.map((item) => (
                <div key={item.label} className="p-4">
                  {item.type === 'switch' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          {'description' in item && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                  )}
                  
                  {item.type === 'select' && 'options' in item && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          {'description' in item && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <Select value={item.value} onValueChange={item.onChange}>
                        <SelectTrigger className="w-28 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {item.type === 'link' && 'href' in item && (
                    <button
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <p className="font-medium text-foreground">{item.label}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Rythu Market v1.0.0</p>
        </div>
      </main>
    </div>
  )
}
