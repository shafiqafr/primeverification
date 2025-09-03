'use client'

import { useState, useEffect } from 'react'
import { Building2, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CompanySettings {
  companyName: string
  companyAddress?: string
  companyPhone?: string
  companyEmail?: string
  companyLogo?: string
}

interface CompanyPreviewProps {
  className?: string
  showTitle?: boolean
}

export default function CompanyPreview({ className = '', showTitle = true }: CompanyPreviewProps) {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'Prime Steel Industries',
    companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
    companyPhone: '091-XXXXXXX',
    companyEmail: 'support@primesteel.com',
    companyLogo: null
  })

  useEffect(() => {
    fetchCompanySettings()
  }, [])

  const fetchCompanySettings = async () => {
    try {
      const response = await fetch('/api/public/settings')
      if (response.ok) {
        const data = await response.json()
        setCompanySettings({
          companyName: data.settings.companyName || 'Prime Steel Industries',
          companyAddress: data.settings.companyAddress || 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
          companyPhone: data.settings.companyPhone || '091-XXXXXXX',
          companyEmail: data.settings.companyEmail || 'support@primesteel.com',
          companyLogo: data.settings.companyLogo || null
        })
      }
    } catch (error) {
      console.error('Error fetching company settings:', error)
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-md ${className}`}>
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Globe className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companySettings.companyLogo ? (
              <img 
                src={companySettings.companyLogo} 
                alt="Company Logo" 
                className="w-16 h-16 rounded-xl object-cover shadow-lg border-2 border-blue-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-blue-200">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          {/* Company Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              {companySettings.companyName}
            </h3>
            
            <div className="space-y-2">
              {/* Address */}
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                <span className="break-words">{companySettings.companyAddress}</span>
              </div>
              
              {/* Phone */}
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                <span>{companySettings.companyPhone}</span>
              </div>
              
              {/* Email */}
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                <span className="break-words">{companySettings.companyEmail}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live Preview</span>
          </div>
          <span className="text-xs text-gray-500">Updates in real-time</span>
        </div>
      </CardContent>
    </Card>
  )
}