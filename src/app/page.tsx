import React, { useState, useEffect, Suspense } from 'react';
import { render } from 'react-dom';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Mock data to simulate API responses since there is no backend
const mockCompanySettings = {
  companyName: 'Prime Steel',
  companyAddress: 'Industrial Area, Karachi',
  companyPhone: '+92 300 1234567',
  companyEmail: 'contact@primesteel.pk',
  companyLogo: 'https://placehold.co/100x100/4F46E5/ffffff?text=PS',
};

const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    fullName: 'Javed Khan',
    department: 'Sales',
    region: 'South',
    email: 'javed.k@primesteel.pk',
    dateOfBirth: '1985-05-20',
    phoneNumber: '+92 333 9876543',
    bloodGroup: 'A+',
    whatsappNumber: '+923339876543',
    profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
    status: 'ACTIVE',
    issueDate: '2015-01-10',
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    fullName: 'Fatima Zafar',
    department: 'Human Resources',
    region: 'North',
    email: 'fatima.z@primesteel.pk',
    dateOfBirth: '1990-11-15',
    phoneNumber: '+92 345 1234567',
    bloodGroup: 'B-',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    status: 'ACTIVE',
    issueDate: '2018-03-22',
    expiryDate: '2025-12-31',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    fullName: 'Ali Hassan',
    department: 'Production',
    region: 'East',
    email: null,
    dateOfBirth: '1980-02-18',
    phoneNumber: '+92 321 5558899',
    bloodGroup: 'O-',
    profilePicture: 'https://images.unsplash.com/photo-1549068106-b024baf5062d?q=80&w=1934&auto=format&fit=crop',
    status: 'INACTIVE',
    issueDate: '2010-06-01',
    expiryDate: '2020-06-01',
  },
];

// Re-implementing icons with simple SVG for a single-file app
const Icon = ({ path, className, children }) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const UserIcon = ({ className = 'text-gray-400' }) => (
  <Icon className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </Icon>
);

const CheckIcon = ({ className = 'text-white' }) => (
  <Icon className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </Icon>
);

const SearchIcon = ({ className = '' }) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </Icon>
);

const MessageCircleIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </Icon>
);

const ChevronDownIcon = ({ className = '' }) => (
  <Icon className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </Icon>
);

const ChevronUpIcon = ({ className = '' }) => (
  <Icon className={className}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </Icon>
);

const PhoneIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2.02l-3.39-1.02a2 2 0 0 1-1.25-2.16L16.4 12.92a2 2 0 0 1 1.25-2.16l3.39-1.02a2 2 0 0 1 2.18 2.02v3zM14 6L8 8a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"></path>
  </Icon>
);

const BuildingIcon = ({ className = '' }) => (
  <Icon className={className}>
    <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <line x1="7" y1="7" x2="7" y2="17"></line>
    <line x1="17" y1="7" x2="17" y2="17"></line>
  </Icon>
);

const CalendarIcon = ({ className = '' }) => (
  <Icon className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </Icon>
);

const DropletsIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0z"></path>
  </Icon>
);

const MapPinIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
    <circle cx="12" cy="9" r="3"></circle>
  </Icon>
);

const MailIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </Icon>
);

const CameraIcon = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </Icon>
);

const LockIcon = ({ className = '' }) => (
  <Icon className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </Icon>
);


function HomePageContent() {
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [companySettings, setCompanySettings] = useState(mockCompanySettings);
  const [activeTab, setActiveTab] = useState('manual');

  // Handle URL search params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const employeeParam = params.get('employee');
    if (employeeParam) {
      setEmployeeId(employeeParam.toUpperCase());
      handleSearchById(employeeParam.toUpperCase());
    }
  }, []);

  const handleSearch = async () => {
    if (!employeeId.trim()) {
      setError('Please enter an Employee ID');
      return;
    }
    setLoading(true);
    setError('');
    await handleSearchById(employeeId);
    setLoading(false);
  };

  const handleSearchById = async (id) => {
    const foundEmployee = mockEmployees.find(emp => emp.employeeId === id);
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setError('');
      setShowReport(true);
    } else {
      setError('Employee not found or an error occurred.');
      setEmployee(null);
      setShowReport(false);
    }
  };

  const handleQRScan = (data) => {
    setCameraActive(false);
    try {
      let scannedId = data;
      if (data.includes('employee=')) {
        const url = new URL(data);
        scannedId = url.searchParams.get('employee') || data;
      }
      const employeeId = scannedId.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setEmployeeId(employeeId);
      handleSearchById(employeeId);
    } catch (err) {
      setError('Invalid QR code or employee not found');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {companySettings.companyLogo ? (
                  <img
                    src={companySettings.companyLogo}
                    alt="Company Logo"
                    className="w-12 h-12 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {companySettings.companyName}
                </h1>
                <p className="text-sm text-gray-500">Official Verification Portal</p>
              </div>
            </div>
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors rounded-lg px-4 py-2"
            >
              <MessageCircleIcon className="w-5 h-5 mr-2" />
              Contact
              {showContactInfo ? (
                <ChevronUpIcon className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>
          {showContactInfo && (
            <div className="pb-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPinIcon className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="font-medium truncate">{companySettings.companyAddress}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <PhoneIcon className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                    <span className="font-medium">{companySettings.companyPhone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <MailIcon className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" />
                    <span className="font-medium truncate">{companySettings.companyEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        {showReport && employee ? (
          <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-2xl border-0 bg-white rounded-3xl">
              <div className={`h-4 ${employee.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} rounded-t-3xl`} />
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                  <div className="flex-shrink-0 flex flex-col items-center space-y-6">
                    <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white relative transition-transform transform hover:scale-105">
                      {employee.profilePicture ? (
                        <img
                          src={employee.profilePicture}
                          alt={employee.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-24 h-24 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                        {employee.fullName}
                        {employee.status === 'ACTIVE' && (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 mt-1">
                        Employee ID: {employee.employeeId}
                      </p>
                    </div>

                    {employee.whatsappNumber && (
                      <button
                        onClick={() => {
                          const message = `Hello, I'm verifying ${employee.fullName} (${employee.employeeId}) from Prime Steel. Please confirm this employee's status.`;
                          const phone = employee.whatsappNumber.replace(/[^0-9]/g, '');
                          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl shadow-lg w-full transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <MessageCircleIcon className="w-5 h-5" />
                        Chat with Salesman
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                        <BuildingIcon className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-gray-500 font-medium text-sm">Department</p>
                          <p className="text-lg font-semibold text-gray-900">{employee.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                        <CalendarIcon className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-gray-500 font-medium text-sm">Date of Birth</p>
                          <p className="text-lg font-semibold text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                        <PhoneIcon className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-gray-500 font-medium text-sm">Phone Number</p>
                          <p className="text-lg font-semibold text-gray-900">{employee.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                        <MailIcon className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-gray-500 font-medium text-sm">Email</p>
                          <p className="text-lg font-semibold text-gray-900 truncate">{employee.email || 'Not Available'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                        <DropletsIcon className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="text-gray-500 font-medium text-sm">Blood Group</p>
                          <p className="text-lg font-semibold text-gray-900">{employee.bloodGroup}</p>
                        </div>
                      </div>

                      {employee.region && (
                        <div className="flex items-center gap-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                          <MapPinIcon className="w-6 h-6 text-indigo-600" />
                          <div>
                            <p className="text-gray-500 font-medium text-sm">Region</p>
                            <p className="text-lg font-semibold text-gray-900">{employee.region}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-inner">
                      <div className="flex items-start gap-4">
                        <LockIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">Official Verification Notice</h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            This employee is officially verified by {companySettings.companyName}. For any inquiries or further verification,
                            please contact our HR department at <span className="font-semibold">{companySettings.companyPhone}</span>.
                            This verification is valid until the expiry date mentioned below.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 bg-blue-100 rounded-xl border border-blue-200">
                          <p className="text-blue-600 font-semibold text-sm">Issue Date</p>
                          <p className="text-lg font-bold text-blue-900 mt-1">{formatDate(employee.issueDate)}</p>
                        </div>
                        <div className="p-5 bg-orange-100 rounded-xl border border-orange-200">
                          <p className="text-orange-600 font-semibold text-sm">Expiry Date</p>
                          <p className="text-lg font-bold text-orange-900 mt-1">{formatDate(employee.expiryDate)}</p>
                        </div>
                      </div>
                    </div>

                    {employee.status === 'INACTIVE' && (
                      <div className="mt-6 border-l-4 border-red-500 bg-red-50 rounded-lg shadow-md p-4">
                        <div className="text-red-700 font-bold text-xl">
                          ⚠️ Inactive Employee – Contact HR Department
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-center space-y-6 lg:ml-auto">
                    <div className="text-center">
                      <p className="text-gray-500 font-medium mb-3 text-lg">Employee ID QR Code</p>
                      <div className="p-3 bg-white rounded-xl shadow-lg border border-gray-200">
                        <QRCode
                          value={`https://primeverification.vercel.app/verify?employee=${employee.employeeId}`}
                          size={180}
                        />
                      </div>
                      <p className="text-gray-400 mt-3 text-sm">Scan for verification</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleSearchAgain}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl shadow-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <SearchIcon className="w-5 h-5" />
                    Search Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Official Employee Verification Portal
              </h2>
              <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Secure, reliable, and real-time employee verification system.
              </p>
            </div>

            <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl p-8">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 py-2">
                  <LockIcon className="w-8 h-8 text-blue-600" />
                  Employee Verification
                </h2>
              </div>
              <div className="p-8">
                <div className="w-full grid grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl shadow-inner">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 font-semibold text-gray-800 transition-all duration-200 ${activeTab === 'manual' ? 'bg-white shadow-md' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      <SearchIcon className="w-5 h-5 mr-2" />
                      Manual Entry
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('camera');
                      setCameraActive(true);
                    }}
                    className={`data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 font-semibold text-gray-800 transition-all duration-200 ${activeTab === 'camera' ? 'bg-white shadow-md' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      <CameraIcon className="w-5 h-5 mr-2" />
                      Camera Scan
                    </div>
                  </button>
                </div>

                {activeTab === 'manual' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="employeeId" className="text-lg font-semibold text-gray-700">
                        Employee ID
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          id="employeeId"
                          placeholder="Enter Employee ID (e.g., EMP001)"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="flex-1 text-lg py-3 px-4 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                        />
                        <button
                          onClick={handleSearch}
                          disabled={loading}
                          className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          {loading ? 'Verifying...' : 'Search'}
                        </button>
                      </div>
                      {error && (
                        <div className="mt-4 border-l-4 border-red-500 bg-red-50 rounded-lg shadow-sm p-4 text-red-700 font-medium">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'camera' && (
                  <div className="space-y-6">
                    <div className="w-full flex flex-col items-center">
                      <div id="qr-reader" style={{ width: '100%', maxWidth: '400px' }}></div>
                      <p className="mt-4 text-center text-gray-600">
                        Please grant camera access to start scanning.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto border-t border-gray-700">
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

// Separate component for rendering the scanner to handle its lifecycle
const QRScannerComponent = ({ onScan }) => {
  useEffect(() => {
    let html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    html5QrcodeScanner.render(onScan, (error) => console.warn(error));
    return () => {
      html5QrcodeScanner.clear().catch(console.error);
    };
  }, [onScan]);

  return <div id="qr-reader"></div>;
};

// The main rendering logic for the single-file React app
const rootElement = document.getElementById('root');
if (rootElement) {
  render(
    <React.StrictMode>
      <HomePageContent />
    </React.StrictMode>,
    rootElement
  );
}
