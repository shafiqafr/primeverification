import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface PublicSettingsData {
  companyName: string
  companyLogo?: string
  companyAddress?: string
  companyPhone?: string
  companyEmail?: string
}

export async function GET(request: NextRequest) {
  try {
    // Get settings from database
    let settings = await db.settings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.settings.create({
        data: {
          companyName: 'Prime Steel Industries',
          companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
          companyPhone: '091-XXXXXXX',
          companyEmail: 'support@primesteel.com',
          timezone: 'Asia/Karachi',
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          dataRetention: 365,
          backupEnabled: true,
          backupFrequency: 'daily',
          qrExpiryDays: 365,
          defaultDepartment: 'Human Resources',
          autoGenerateEmployeeId: true
        }
      })
    }

    // Return current public settings (no authentication required)
    const publicSettings: PublicSettingsData = {
      companyName: settings.companyName,
      companyLogo: settings.companyLogo || undefined,
      companyAddress: settings.companyAddress || undefined,
      companyPhone: settings.companyPhone || undefined,
      companyEmail: settings.companyEmail || undefined
    }

    return NextResponse.json({ settings: publicSettings })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    console.log('Updating public settings with data:', settings)

    // Check if settings exist first
    const existingSettings = await db.settings.findFirst()
    
    let updatedSettings
    if (existingSettings) {
      // Update existing settings - only public fields
      updatedSettings = await db.settings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: settings.companyName,
          companyLogo: settings.companyLogo || null
        }
      })
    } else {
      // Create new settings with default values and provided public settings
      updatedSettings = await db.settings.create({
        data: {
          companyName: settings.companyName || 'Prime Steel Industries',
          companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
          companyPhone: '091-XXXXXXX',
          companyEmail: 'support@primesteel.com',
          timezone: 'Asia/Karachi',
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          dataRetention: 365,
          backupEnabled: true,
          backupFrequency: 'daily',
          qrExpiryDays: 365,
          defaultDepartment: 'Human Resources',
          autoGenerateEmployeeId: true,
          companyLogo: settings.companyLogo || null
        }
      })
    }

    console.log('Public settings updated in database:', updatedSettings)

    // Format the response
    const publicSettings: PublicSettingsData = {
      companyName: updatedSettings.companyName,
      companyLogo: updatedSettings.companyLogo || undefined,
      companyAddress: updatedSettings.companyAddress || undefined,
      companyPhone: updatedSettings.companyPhone || undefined,
      companyEmail: updatedSettings.companyEmail || undefined
    }

    return NextResponse.json({ 
      message: 'Public settings updated successfully',
      settings: publicSettings 
    })
  } catch (error) {
    console.error('Error updating public settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}