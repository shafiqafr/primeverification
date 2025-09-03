'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { signOut } from 'next-auth/react'

interface Employee {
  id: string
  employeeId: string
  fullName: string
  department: string
  region?: string
  email?: string
  dateOfBirth: string
  phoneNumber: string
  whatsappNumber?: string
  bloodGroup: string
  profilePicture?: string
  status: 'ACTIVE' | 'INACTIVE'
  issueDate: string
  expiryDate: string
}

export default function EmployeesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchEmployees()
    }
  }, [session])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/admin/employees')
      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }
      const data = await response.json()
      setEmployees(data.employees)
    } catch (err) {
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete employee')
      }

      await fetchEmployees()
    } catch (err) {
      setError('Failed to delete employee')
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
              ← Back to Dashboard
            </Button>
            <h1 className="ml-4 text-xl font-bold text-gray-900 flex items-center">
              <img
                src="/logo.svg"
                alt="Prime Steel Logo"
                className="w-6 h-6 object-contain mr-2"
              />
              Employee Management
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
        <div className="max-w-7xl mx-auto">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/admin/employees/add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>{employee.fullName}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.region || '-'}</TableCell>
                        <TableCell>{employee.email || 'Not Available'}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {employee.status === 'ACTIVE' ? 'Verified Employee' : 'Inactive Employee'}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.phoneNumber}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/employees/edit/${employee.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/employees/${employee.id}/qr`)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}