'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Building2, Users, BarChart3, LogOut, Menu, X, Activity, Shield, FileText, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from 'next-auth/react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    verificationsToday: 0,
    totalVerifications: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const [employeesRes, logsRes] = await Promise.all([
        fetch('/api/admin/employees'),
        fetch('/api/admin/logs')
      ])

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json()
        const activeCount = employeesData.employees.filter((e: any) => e.status === 'ACTIVE').length
        setStats(prev => ({
          ...prev,
          totalEmployees: employeesData.employees.length,
          activeEmployees: activeCount
        }))
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        const today = new Date().toDateString()
        const todayCount = logsData.logs.filter((log: any) => 
          new Date(log.timestamp).toDateString() === today
        ).length
        setStats(prev => ({
          ...prev,
          verificationsToday: todayCount,
          totalVerifications: logsData.logs.length
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center ml-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:translate-x-0 md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:transform-none`}>
          <div className="p-6">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                onClick={() => router.push('/admin')}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-xs text-gray-500">Overview & Analytics</div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                onClick={() => router.push('/admin/employees')}
              >
                <Users className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-semibold">Employees</div>
                  <div className="text-xs text-gray-500">Manage Staff</div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                onClick={() => router.push('/admin/logs')}
              >
                <Activity className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-semibold">Verification Logs</div>
                  <div className="text-xs text-gray-500">Track Activity</div>
                </div>
              </Button>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 h-auto hover:bg-gray-50 rounded-lg"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-semibold">Settings</div>
                    <div className="text-xs text-gray-500">System Configuration</div>
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 h-auto hover:bg-gray-50 rounded-lg"
                  onClick={() => router.push('/admin/security')}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-semibold">Security</div>
                    <div className="text-xs text-gray-500">Access Control</div>
                  </div>
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Welcome back! Here's what's happening with your employee verification system.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeEmployees} active
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.activeEmployees}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Verifications Today</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.verificationsToday}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalVerifications} total verifications
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-gray-500 mt-1">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start p-4 h-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => router.push('/admin/employees?action=add')}
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Add New Employee</div>
                        <div className="text-sm text-gray-600">Create a new employee profile</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start p-4 h-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => router.push('/admin/logs')}
                  >
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">View Verification Logs</div>
                        <div className="text-sm text-gray-600">Monitor verification activity</div>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">System running normally</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stats.verificationsToday} verifications today</p>
                        <p className="text-xs text-gray-500">Last updated: Just now</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stats.activeEmployees} active employees</p>
                        <p className="text-xs text-gray-500">Last updated: Just now</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
