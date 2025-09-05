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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
    {/* Header */}
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {companySettings.companyLogo ? (
                <img 
                  src={companySettings.companyLogo} 
                  alt="Company Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              )}
            </div>
            <div className="ml-2">
              <h1 className="text-lg font-bold text-blue-800">
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
            <MessageCircle className="w-4 h-4 mr-1" />
            Contact Info
          </Button>
        </div>
        {showContactInfo && (
          <div className="pb-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="font-medium truncate">{companySettings.companyAddress}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="font-medium">{companySettings.companyPhone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-medium truncate">{companySettings.companyEmail}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
    {/* Header */}
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {companySettings.companyLogo ? (
                <img 
                  src={companySettings.companyLogo} 
                  alt="Company Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              )}
            </div>
            <div className="ml-2">
              <h1 className="text-lg font-bold text-blue-800">
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
            <MessageCircle className="w-4 h-4 mr-1" />
            Contact Info
          </Button>
        </div>
        {showContactInfo && (
          <div className="pb-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="font-medium truncate">{companySettings.companyAddress}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="font-medium">{companySettings.companyPhone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-3 h-3 mr-1 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
