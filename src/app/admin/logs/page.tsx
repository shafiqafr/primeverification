'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Search, Filter, Activity, Calendar, MapPin, User, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { signOut } from 'next-auth/react'

interface VerificationLog {
  id: string
  timestamp: string
  ipAddress: string
  userAgent: string
  employee: {
    employeeId: string
    fullName: string
    department: string
  }
}

export default function LogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchLogs()
    }
  }, [session, currentPage])

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/admin/logs?page=${currentPage}&limit=50`)
      if (!response.ok) {
        throw new Error('Failed to fetch logs')
      }
      const data = await response.json()
      setLogs(data.logs)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError('Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Employee ID', 'Name', 'Department', 'IP Address', 'User Agent']
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.employee.employeeId,
        log.employee.fullName,
        log.employee.department,
        log.ipAddress,
        `"${log.userAgent}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verification-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm)
    
    const matchesDate = !dateFilter || 
      new Date(log.timestamp).toDateString() === new Date(dateFilter).toDateString()
    
    return matchesSearch && matchesDate
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading logs...</p>
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
              onClick={() => router.push('/admin')}
            >
              ← Back to Dashboard
            </Button>
            <h1 className="ml-4 text-xl font-bold text-gray-900">Verification Logs</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-48"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Logs Table */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <Activity className="h-6 w-6 text-blue-600" />
                Verification Activity Logs
                <Badge variant="secondary" className="ml-auto">
                  {filteredLogs.length} records
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                      <TableHead className="font-semibold text-gray-700">Employee</TableHead>
                      <TableHead className="font-semibold text-gray-700">Department</TableHead>
                      <TableHead className="font-semibold text-gray-700">IP Address</TableHead>
                      <TableHead className="font-semibold text-gray-700">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{formatDate(log.timestamp)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{log.employee.fullName}</div>
                              <div className="text-sm text-gray-500">{log.employee.employeeId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{log.employee.department}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="font-mono text-sm">{log.ipAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.ipAddress.startsWith('192.168.') ? 'Local Network' : 'External'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No verification logs found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}