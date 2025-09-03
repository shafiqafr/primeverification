'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Download, User, Phone, Calendar, Building, Camera, Check, Shield, MapPin, Mail, MessageCircle, QrCode, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import { signOut } from 'next-auth/react'

interface EmployeeFormData {
  fullName: string
  employeeId: string
  department: string
  region: string
  email: string
  dateOfBirth: string
  phoneNumber: string
  whatsappNumber: string
  bloodGroup: string
  status: 'ACTIVE' | 'INACTIVE'
  issueDate: string
  expiryDate: string
  profilePicture: string
}

export default function AddEmployeePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [companyName, setCompanyName] = useState('Prime Steel Industries')
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [companyAddress, setCompanyAddress] = useState('Jamrud Road, Near Saleem Check Post, Khyber 2500')
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: '',
    employeeId: '',
    department: '',
    region: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    whatsappNumber: '',
    bloodGroup: '',
    status: 'ACTIVE',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    profilePicture: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchCompanySettings()
    generateEmployeeId()
  }, [])

  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('/api/public/settings')
      if (response.ok) {
        const data = await response.json()
        setCompanyName(data.settings.companyName || 'Prime Steel Industries')
        setCompanyLogo(data.settings.companyLogo || null)
        setCompanyAddress(data.settings.companyAddress || 'Jamrud Road, Near Saleem Check Post, Khyber 2500')
      }
    } catch (error) {
      console.error('Error fetching company settings:', error)
    }
  }

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const employeeId = `EMP${timestamp.slice(-4)}${random}`
    setFormData(prev => ({ ...prev, employeeId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save employee')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/employees')
      }, 2000)
    } catch (err) {
      setError('Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement('a')
      link.download = `${formData.employeeId}-qrcode.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const getQRCodeValue = () => {
    return `https://primesteel.com/verify?employee=${formData.employeeId}`
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Added Successfully!</h2>
            <p className="text-gray-600">Redirecting to employee list...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/employees')}
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employees
              </Button>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-blue-800">Add New Employee</h1>
                <p className="text-sm text-gray-600">Create a new employee profile with ID card</p>
              </div>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Employee Form */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <User className="w-6 h-6" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <Label className="text-base font-semibold text-gray-900 mb-4 block">Profile Picture</Label>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                        {formData.profilePicture ? (
                          <img 
                            src={formData.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  handleInputChange('profilePicture', event.target.result as string)
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="w-full max-w-md"
                        />
                        <p className="text-sm text-gray-600 mt-2">Upload profile picture (JPG, PNG, max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">Employee ID *</Label>
                        <Input
                          id="employeeId"
                          value={formData.employeeId}
                          onChange={(e) => handleInputChange('employeeId', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Auto-generated"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="+1-555-0123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-700">WhatsApp Number</Label>
                        <Input
                          id="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="+1-555-0123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="employee@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group *</Label>
                        <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
                        <Building className="w-4 h-4 text-orange-600" />
                      </div>
                      Employment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department *</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Engineering"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region" className="text-sm font-medium text-gray-700">Region</Label>
                        <Input
                          id="region"
                          value={formData.region}
                          onChange={(e) => handleInputChange('region', e.target.value)}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Peshawar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueDate" className="text-sm font-medium text-gray-700">Issue Date *</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => handleInputChange('issueDate', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          required
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => handleInputChange('status', value)}>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white h-12 text-lg font-semibold"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Employee
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/employees')}
                      className="h-12 px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Employee Card Preview */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <QrCode className="w-6 h-6" />
                  Employee Card Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Preview Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {companyLogo ? (
                            <img 
                              src={companyLogo} 
                              alt="Company Logo" 
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-lg">P</span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-bold">{companyName}</h3>
                            <p className="text-blue-100 text-sm">Employee ID Card</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${formData.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {formData.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Column - Profile and QR */}
                        <div className="flex flex-col items-center space-y-4">
                          {/* Profile Picture */}
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                            {formData.profilePicture ? (
                              <img 
                                src={formData.profilePicture} 
                                alt={formData.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-gray-400" />
                            )}
                          </div>

                          {/* QR Code */}
                          <div className="text-center">
                            <p className="text-xs text-gray-500 font-medium mb-2">Employee ID QR Code</p>
                            <div className="bg-white p-2 rounded-lg shadow-md">
                              <QRCodeGenerator 
                                value={getQRCodeValue()}
                                size={120}
                              />
                            </div>
                            <p className="text-gray-400 mt-1 text-xs">Scan to verify</p>
                          </div>
                        </div>

                        {/* Right Column - Employee Details */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {formData.fullName || 'Employee Name'}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                {formData.employeeId || 'EMP-ID'}
                              </span>
                              {formData.status === 'ACTIVE' && (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Department:</span>
                              <span className="font-medium text-gray-900">{formData.department || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-600">DOB:</span>
                              <span className="font-medium text-gray-900">
                                {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'Not specified'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium text-gray-900">{formData.phoneNumber || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-600" />
                              <span className="text-gray-600">Region:</span>
                              <span className="font-medium text-gray-900">{formData.region || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-red-600" />
                              <span className="text-gray-600">Blood:</span>
                              <span className="font-medium text-gray-900">{formData.bloodGroup || 'Not specified'}</span>
                            </div>
                          </div>

                          {/* Card Validity */}
                          <div className="bg-gray-50 rounded-lg p-3 mt-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">Issue Date:</span>
                              <span className="font-medium">{formData.issueDate ? formatDate(formData.issueDate) : 'Not set'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-1">
                              <span className="text-gray-600">Expiry Date:</span>
                              <span className="font-medium">{formData.expiryDate ? formatDate(formData.expiryDate) : 'Not set'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-50 border-t border-gray-200 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">{companyAddress}</p>
                        <p className="text-xs text-gray-500">Report Generated: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadQRCode}
                    disabled={!formData.employeeId}
                    className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white h-12 font-semibold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download QR Code
                  </Button>

                  {/* Preview Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Live Preview
                    </h4>
                    <p className="text-sm text-blue-800">
                      This is a live preview of the employee card. As you fill in the form, the preview updates in real-time. 
                      The QR code contains a unique verification link for this employee.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}