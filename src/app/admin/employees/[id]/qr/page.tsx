'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, QrCode, User, CheckCircle, XCircle, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QRCodeGenerator from '@/components/QRCodeGenerator'

interface Employee {
  id: string
  employeeId: string
  fullName: string
  department: string
  dateOfBirth: string
  phoneNumber: string
  email?: string
  bloodGroup: string
  profilePicture?: string
  status: 'ACTIVE' | 'INACTIVE'
  issueDate: string
  expiryDate: string
}

export default function EmployeeQRPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      fetchEmployee(id)
    }
  }, [session, params.id])

  const fetchEmployee = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/employees/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch employee')
      }
      const data = await response.json()
      setEmployee(data.employee)
    } catch (err) {
      setError('Failed to load employee')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/employees')}
              className="hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
            <div className="ml-6 pl-6 border-l border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                QR Code Generation
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <Alert className="mb-8 border-l-4 border-red-500 bg-red-50" variant="destructive">
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {employee ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Employee Information */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">Employee Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                      {employee.profilePicture ? (
                        <img 
                          src={employee.profilePicture} 
                          alt={employee.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {employee.fullName}
                        {employee.status === 'ACTIVE' && (
                          <div className="inline-flex items-center justify-center w-5 h-5 bg-green-500 rounded-full shadow-lg">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {employee.status === 'ACTIVE' ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                            <Shield className="w-3 h-3 text-white" strokeWidth={2} />
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm font-semibold ${
                          employee.status === 'ACTIVE' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {employee.status === 'ACTIVE' ? 'Verified Employee' : 'Inactive Employee'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 font-medium">{employee.employeeId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Department</p>
                      <p className="font-semibold text-gray-900">{employee.department}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Status</p>
                      <p className={`font-semibold ${
                        employee.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {employee.status}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Date of Birth</p>
                      <p className="font-semibold text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{employee.phoneNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{employee.email || 'Not Available'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Blood Group</p>
                      <p className="font-semibold text-gray-900">{employee.bloodGroup}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 font-medium mb-1">Issue Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(employee.issueDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-purple-600" />
                    Employee QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                      <QRCodeGenerator 
                        value={`${window.location.origin}/?employee=${employee.employeeId}`}
                        size={240}
                      />
                      <div className="text-center mt-4 text-sm text-gray-600 font-semibold">
                        {employee.employeeId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-base text-gray-700 leading-relaxed">
                      Scan this QR code to verify employee identity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-lg border-0">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Not Found</h3>
                <p className="text-gray-600">The requested employee could not be found in the system.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}