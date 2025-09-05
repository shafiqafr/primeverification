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

  const handleQRScan = async ( string) => {
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
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <Search className="w-6 h-6 text-blue-600" />
              Employee Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 font-semibold text-sm">
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="camera" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 font-semibold text-sm">
                  Camera Scan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                    Employee ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="employeeId"
                      placeholder="Enter Employee ID (e.g., EMP001)"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 text-sm py-2 px-3 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md text-sm"
                    >
                      {loading ? 'Verifying...' : 'Search'}
                    </Button>
                  </div>
                  {error && (
                    <Alert className="mt-2 border-l-4 border-red-500 bg-red-50" variant="destructive">
                      <AlertDescription className="text-red-700 font-medium text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="camera" className="space-y-4">
                <QRScanner onScan={handleQRScan} onError={() => {}} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 {companySettings.companyName}. All rights reserved. | Official Employee Verification System
            </p>
            <p className="text-gray-500 text-xs mt-1">
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
