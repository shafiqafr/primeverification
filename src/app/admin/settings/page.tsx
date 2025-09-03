'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Settings, Database, Bell, Palette, Globe, Save, RefreshCw, Building2, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { signOut } from 'next-auth/react'

interface SystemSettings {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyLogo?: string
  timezone: string
  language: string
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  dataRetention: number
  backupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  qrExpiryDays: number
  defaultDepartment: string
  autoGenerateEmployeeId: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'Prime Steel Industries',
    companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
    companyPhone: '091-XXXXXXX',
    companyEmail: 'support@primesteel.com',
    timezone: 'Asia/Karachi',
    language: 'en',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    dataRetention: 365,
    backupEnabled: true,
    backupFrequency: 'daily',
    qrExpiryDays: 365,
    defaultDepartment: 'Human Resources',
    autoGenerateEmployeeId: true
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      console.log('Saving settings:', settings)
      
      // Save admin settings
      const adminResponse = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      if (!adminResponse.ok) {
        const errorData = await adminResponse.json()
        console.error('Admin settings update failed:', errorData)
        throw new Error(errorData.error || 'Failed to save admin settings')
      }

      const adminData = await adminResponse.json()
      console.log('Admin settings response:', adminData)

      // Also update public settings for company name and logo
      const publicSettings = {
        companyName: settings.companyName,
        companyLogo: settings.companyLogo
      }
      
      console.log('Updating public settings:', publicSettings)
      
      const publicResponse = await fetch('/api/public/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: publicSettings }),
      })

      if (!publicResponse.ok) {
        const errorData = await publicResponse.json()
        console.error('Public settings update failed:', errorData)
        throw new Error('Failed to update public settings')
      }

      const publicData = await publicResponse.json()
      console.log('Public settings response:', publicData)

      setMessage('Settings updated successfully!')
      
      // Refresh settings to confirm changes
      setTimeout(() => {
        fetchSettings()
      }, 1000)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to reset settings')
      }

      const data = await response.json()
      setSettings(data.settings)
      setMessage('Settings reset to default values')
    } catch (error) {
      console.error('Error resetting settings:', error)
      setMessage('Failed to reset settings')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordLoading(true)
    setPasswordMessage('')
    
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setPasswordMessage('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Optionally sign out the user after password change
      setTimeout(() => {
        signOut({ callbackUrl: '/admin/login' })
      }, 2000)
      
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordMessage(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="ml-4 text-xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-blue-600" />
              System Settings
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {message && (
            <Alert className={`mb-6 ${message.includes('success') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <AlertDescription className={message.includes('success') ? 'text-green-700' : 'text-red-700'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Live Preview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This is how your company information will appear on the main page:
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center space-x-4">
                  {settings.companyLogo ? (
                    <img 
                      src={settings.companyLogo} 
                      alt="Company Logo Preview" 
                      className="w-16 h-16 rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {settings.companyName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800">
                      {settings.companyName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {settings.companyAddress}
                    </p>
                    <p className="text-sm text-gray-500">
                      📞 {settings.companyPhone} | ✉️ {settings.companyEmail}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.companyLogo && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img 
                        src={settings.companyLogo} 
                        alt="Company Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setSettings({...settings, companyLogo: event.target.result as string})
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setSettings({...settings, theme: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Employee Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Employee ID</Label>
                  <p className="text-sm text-gray-500">Automatically generate unique employee IDs</p>
                </div>
                <Switch
                  checked={settings.autoGenerateEmployeeId}
                  onCheckedChange={(checked) => setSettings({...settings, autoGenerateEmployeeId: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDepartment">Default Department</Label>
                  <Select value={settings.defaultDepartment} onValueChange={(value) => setSettings({...settings, defaultDepartment: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qrExpiryDays">QR Code Expiry (days)</Label>
                  <Input
                    id="qrExpiryDays"
                    type="number"
                    value={settings.qrExpiryDays}
                    onChange={(e) => setSettings({...settings, qrExpiryDays: parseInt(e.target.value) || 365})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    emailNotifications: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    pushNotifications: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    smsNotifications: checked
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Backup */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-red-600" />
                Data & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Backups</Label>
                  <p className="text-sm text-gray-500">Automatically backup system data</p>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                />
              </div>

              {settings.backupEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings({...settings, backupFrequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({...settings, dataRetention: parseInt(e.target.value) || 365})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordMessage && (
                <Alert className={`${passwordMessage.includes('success') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <AlertDescription className={passwordMessage.includes('success') ? 'text-green-700' : 'text-red-700'}>
                    {passwordMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePasswordChange}
                disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
              
              {passwordMessage?.includes('successfully') && (
                <p className="text-sm text-gray-600 text-center">
                  You will be logged out automatically in 2 seconds...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={saving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}