'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCode, Search, User, Building, Calendar, Phone, Droplets, Badge, CheckCircle, XCircle, Camera, Shield, MessageCircle, Lock, MapPin, Mail, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRScanner from '@/components/QRScanner';
import QRCodeGenerator from '@/components/QRCodeGenerator';

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  region?: string;
  email?: string;
  dateOfBirth: string;
  phoneNumber: string;
  bloodGroup: string;
  whatsappNumber?: string;
  profilePicture?: string;
  status: 'ACTIVE' | 'INACTIVE';
  issueDate: string;
  expiryDate: string;
}

interface CompanySettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo?: string | null;
}

// ✅ یہ فنکشن پرانی سیٹنگز کی فِلکرِنگ روکے گا
const getInitialSettings = () => {
  if (typeof window === 'undefined') return null;
  const el = document.getElementById('initial-settings');
  if (!el) return null;
  try {
    return JSON.parse(el.getAttribute('data-settings') || '{}');
  } catch (e) {
    return null;
  }
};

function HomePageContent() {
  const searchParams = useSearchParams();
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  // ✅ یہاں ڈیفالٹ سیٹنگز نہیں ہیں — ہم فوری سیٹنگز لوڈ کریں گے
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyLogo: null,
  });

  // ✅ سیٹنگز فوری لوڈ ہوں گی
  useEffect(() => {
    const initial = getInitialSettings();
    if (initial) {
      setCompanySettings(initial);
    } else {
      fetchCompanySettings(); // اگر نہ ملے تو API سے لے
    }
  }, []);

  useEffect(() => {
    const employeeParam = searchParams.get('employee');
    if (employeeParam) {
      setEmployeeId(employeeParam.toUpperCase());
      fetchCompanySettings().then(() => {
        handleSearchById(employeeParam.toUpperCase());
      });
    }
  }, [searchParams]);

  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('/api/public/settings');
      if (response.ok) {
        const data = await response.json();
        setCompanySettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  const handleSearch = async () => {
    if (!employeeId.trim()) {
      setError('Please enter an Employee ID');
      return;
    }

    setLoading(true);
    setError('');

    await fetchCompanySettings();

    try {
      await handleSearchById(employeeId);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async (id: string) => {
    try {
      const response = await fetch(`/api/employee/${id}`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      setEmployee(data.employee);
      setError('');
      setShowReport(true);
    } catch (err) {
      setError('Employee not found or an error occurred.');
      setEmployee(null);
      setShowReport(false);
    }
  };

  const handleQRScan = async (data: string) => {
    setCameraActive(false);
    try {
      let employeeId = data;
      if (data.includes('employee=')) {
        const url = new URL(data);
        employeeId = url.searchParams.get('employee') || data;
      }
      employeeId = employeeId.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setEmployeeId(employeeId);
      await handleSearchById(employeeId);
    } catch (err) {
      setError('Invalid QR code or employee not found');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearchAgain = () => {
    setShowReport(false);
    setEmployee(null);
    setEmployeeId('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {companySettings.companyLogo ? (
                  <img 
                    src={companySettings.companyLogo} 
                    alt="Company Logo" 
                    className="w-10 h-10 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-blue-800">
                  {companySettings.companyName}
                </h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Info
              {showContactInfo ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
          {showContactInfo && (
            <div className="pb-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="font-medium truncate">{companySettings.companyAddress}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="font-medium">{companySettings.companyPhone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="font-medium truncate">{companySettings.companyEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {showReport && employee ? (
          <div className="min-h-screen">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black flex items-center gap-2">
                      Employee Verification Report
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        Official verification results
                      </span>
                      {employee.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Report Generated</p>
                    <p className="text-sm font-semibold text-black">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="overflow-hidden shadow-2xl border-0 bg-white">
                <div className={`h-3 ${employee.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`} />
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="flex-shrink-0">
                        <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-xl border-4 border-white relative">
                          {employee.profilePicture ? (
                            <img 
                              src={employee.profilePicture} 
                              alt={employee.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-20 h-20 text-gray-400" />
                          )}
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                            {employee.fullName}
                            {employee.status === 'ACTIVE' && (
                              <div className="inline-flex items-center justify-center w-5 h-5 bg-green-500 rounded-full shadow-lg">
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </h3>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-500 font-medium mb-2">Employee ID QR Code</p>
                        <QRCodeGenerator 
                          value={`https://primeverification.vercel.app/verify?employee=${employee.employeeId}`}
                          size={150}
                          className="p-2 bg-white rounded-lg shadow-md"
                        />
                        <p className="text-gray-400 mt-2 text-sm">Scan for verification</p>
                        
                        {employee.whatsappNumber && (
                          <Button
                            onClick={() => {
                              const message = `Hello, I'm verifying ${employee.fullName} (${employee.employeeId}) from Prime Steel. Please confirm this employee's status.`;
                              const phone = employee.whatsappNumber.replace(/[^0-9]/g, '');
                              const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                              window.open(whatsappUrl, '_blank');
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-md w-full mt-4 text-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat with Salesman
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex justify-end">
                        <div className="text-right">
                          <Badge className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                            {employee.employeeId}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Building className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-gray-500 font-medium">Department</p>
                            <p className="text-sm font-semibold text-gray-900">{employee.department}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-gray-500 font-medium">Date of Birth</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-gray-500 font-medium">Phone Number</p>
                            <p className="text-sm font-semibold text-gray-900">{employee.phoneNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-gray-500 font-medium">Email</p>
                            <p className="text-sm font-semibold text-gray-900">{employee.email || 'Not Available'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Droplets className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-gray-500 font-medium">Blood Group</p>
                            <p className="text-sm font-semibold text-gray-900">{employee.bloodGroup}</p>
                          </div>
                        </div>

                        {employee.region && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="text-gray-500 font-medium">Region</p>
                              <p className="text-sm font-semibold text-gray-900">{employee.region}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Official Verification Notice</h4>
                            <p className="text-blue-800 text-sm leading-relaxed">
                              This employee is officially verified by {companySettings.companyName}. For any inquiries or further verification, 
                              please contact our HR department at <span className="text-sm font-semibold">{companySettings.companyPhone}</span>. 
                              This verification is valid until the expiry date mentioned above.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-600 font-medium">Issue Date</p>
                            <p className="text-sm font-semibold text-blue-900">{formatDate(employee.issueDate)}</p>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <p className="text-orange-600 font-medium">Expiry Date</p>
                            <p className="text-sm font-semibold text-orange-900">{formatDate(employee.expiryDate)}</p>
                          </div>
                        </div>
                      </div>

                      {employee.status === 'INACTIVE' && (
                        <Alert className="mt-6 border-l-4 border-red-500 bg-red-50" variant="destructive">
                          <AlertDescription className="text-red-700 font-medium text-lg">
                            ⚠️ Inactive Employee – Contact HR Department
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleSearchAgain}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  Search Again
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight inline-flex items-center gap-3">
                Official Employee Verification Portal
              </h2>
              <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Secure, reliable, and real-time employee verification system.
              </p>
            </div>

            <Card className="mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-black">
                  <Search className="w-7 h-7 text-blue-600" />
                  Employee Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-3 font-semibold">
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger value="camera" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-3 font-semibold">
                      Camera Scan
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="employeeId" className="text-lg font-semibold text-gray-700">
                        Employee ID
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="employeeId"
                          placeholder="Enter Employee ID (e.g., EMP001)"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="text-lg py-3 px-4 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                        />
                        <Button 
                          onClick={handleSearch} 
                          disabled={loading}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg"
                        >
                          {loading ? 'Verifying Employee...' : 'Search'}
                        </Button>
                      </div>
                      {error && (
                        <Alert className="mt-4 border-l-4 border-red-500 bg-red-50" variant="destructive">
                          <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="camera" className="space-y-6">
                    <QRScanner onScan={handleQRScan} onError={() => {}} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-20 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 {companySettings.companyName}. All rights reserved. | Official Employee Verification System
            </p>
            <p className="text-gray-500 text-xs mt-2">
              This system is for official use only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
