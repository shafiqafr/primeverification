'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Shield, Key, UserCheck, AlertTriangle, Settings, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { signOut } from 'next-auth/react'

interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
  ipRestriction: boolean
  allowedIPs: string[]
  auditLogEnabled: boolean
  notificationLevel: 'low' | 'medium' | 'high'
}

export default function SecuritySettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipRestriction: false,
    allowedIPs: [],
    auditLogEnabled: true,
    notificationLevel: 'medium'
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

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
      // Mock API call - in real implementation, this would fetch from your API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Settings would be fetched from API here
    } catch (error) {
      console.error('Error fetching security settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      // Mock API call - in real implementation, this would save to your API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage('Security settings updated successfully!')
    } catch (error) {
      setMessage('Failed to update security settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipRestriction: false,
      allowedIPs: [],
      auditLogEnabled: true,
      notificationLevel: 'medium'
    })
    setMessage('Settings reset to default values')
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
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Security Settings
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

          {/* Authentication Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Authentication Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Enable 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorEnabled: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 30})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value) || 90})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Maximum Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) => setSettings({...settings, loginAttempts: parseInt(e.target.value) || 5})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Restriction</Label>
                  <p className="text-sm text-gray-500">Limit access to specific IP addresses</p>
                </div>
                <Switch
                  checked={settings.ipRestriction}
                  onCheckedChange={(checked) => setSettings({...settings, ipRestriction: checked})}
                />
              </div>

              {settings.ipRestriction && (
                <div className="space-y-2">
                  <Label>Allowed IP Addresses</Label>
                  <div className="space-y-2">
                    {settings.allowedIPs.map((ip, index) => (
                      <div key={index} className="flex gap-2">
                        <Input value={ip} readOnly className="flex-1" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newIPs = settings.allowedIPs.filter((_, i) => i !== index)
                            setSettings({...settings, allowedIPs: newIPs})
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIP = prompt('Enter IP address:')
                        if (newIP) {
                          setSettings({...settings, allowedIPs: [...settings.allowedIPs, newIP]})
                        }
                      }}
                    >
                      Add IP Address
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monitoring & Alerts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Monitoring & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-gray-500">Log all security-related events</p>
                </div>
                <Switch
                  checked={settings.auditLogEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, auditLogEnabled: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationLevel">Notification Level</Label>
                <Select value={settings.notificationLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setSettings({...settings, notificationLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Critical only</SelectItem>
                    <SelectItem value="medium">Medium - Important events</SelectItem>
                    <SelectItem value="high">High - All events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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