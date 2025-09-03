import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface SettingsData {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyLogo?: string
  timezone: string
  language: string
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  dataRetention: number
  backupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  qrExpiryDays: number
  defaultDepartment: string
  autoGenerateEmployeeId: boolean
}

// Default settings
const defaultSettings: SettingsData = {
  companyName: 'Prime Steel Industry',
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get settings from database
    let settings = await db.settings.findFirst()
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.settings.create({
        data: {
          companyName: defaultSettings.companyName,
          companyAddress: defaultSettings.companyAddress,
          companyPhone: defaultSettings.companyPhone,
          companyEmail: defaultSettings.companyEmail,
          timezone: defaultSettings.timezone,
          language: defaultSettings.language,
          theme: defaultSettings.theme,
          emailNotifications: defaultSettings.emailNotifications,
          pushNotifications: defaultSettings.pushNotifications,
          smsNotifications: defaultSettings.smsNotifications,
          dataRetention: defaultSettings.dataRetention,
          backupEnabled: defaultSettings.backupEnabled,
          backupFrequency: defaultSettings.backupFrequency,
          qrExpiryDays: defaultSettings.qrExpiryDays,
          defaultDepartment: defaultSettings.defaultDepartment,
          autoGenerateEmployeeId: defaultSettings.autoGenerateEmployeeId
        }
      })
    }

    // Format the response to match the expected interface
    const responseSettings: SettingsData = {
      companyName: settings.companyName,
      companyAddress: settings.companyAddress,
      companyPhone: settings.companyPhone,
      companyEmail: settings.companyEmail,
      companyLogo: settings.companyLogo || undefined,
      timezone: settings.timezone,
      language: settings.language,
      theme: settings.theme as 'light' | 'dark' | 'auto',
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      smsNotifications: settings.smsNotifications,
      dataRetention: settings.dataRetention,
      backupEnabled: settings.backupEnabled,
      backupFrequency: settings.backupFrequency as 'daily' | 'weekly' | 'monthly',
      qrExpiryDays: settings.qrExpiryDays,
      defaultDepartment: settings.defaultDepartment,
      autoGenerateEmployeeId: settings.autoGenerateEmployeeId
    }

    return NextResponse.json({ settings: responseSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    console.log('Updating settings with data:', settings)

    // Check if settings exist first
    const existingSettings = await db.settings.findFirst()
    
    let updatedSettings
    if (existingSettings) {
      // Update existing settings
      updatedSettings = await db.settings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: settings.companyName,
          companyAddress: settings.companyAddress,
          companyPhone: settings.companyPhone,
          companyEmail: settings.companyEmail,
          companyLogo: settings.companyLogo || null,
          timezone: settings.timezone,
          language: settings.language,
          theme: settings.theme,
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          smsNotifications: settings.smsNotifications,
          dataRetention: settings.dataRetention,
          backupEnabled: settings.backupEnabled,
          backupFrequency: settings.backupFrequency,
          qrExpiryDays: settings.qrExpiryDays,
          defaultDepartment: settings.defaultDepartment,
          autoGenerateEmployeeId: settings.autoGenerateEmployeeId
        }
      })
    } else {
      // Create new settings
      updatedSettings = await db.settings.create({
        data: {
          companyName: settings.companyName,
          companyAddress: settings.companyAddress,
          companyPhone: settings.companyPhone,
          companyEmail: settings.companyEmail,
          companyLogo: settings.companyLogo || null,
          timezone: settings.timezone,
          language: settings.language,
          theme: settings.theme,
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          smsNotifications: settings.smsNotifications,
          dataRetention: settings.dataRetention,
          backupEnabled: settings.backupEnabled,
          backupFrequency: settings.backupFrequency,
          qrExpiryDays: settings.qrExpiryDays,
          defaultDepartment: settings.defaultDepartment,
          autoGenerateEmployeeId: settings.autoGenerateEmployeeId
        }
      })
    }

    console.log('Settings updated in database:', updatedSettings)

    // Format the response
    const responseSettings: SettingsData = {
      companyName: updatedSettings.companyName,
      companyAddress: updatedSettings.companyAddress,
      companyPhone: updatedSettings.companyPhone,
      companyEmail: updatedSettings.companyEmail,
      companyLogo: updatedSettings.companyLogo || undefined,
      timezone: updatedSettings.timezone,
      language: updatedSettings.language,
      theme: updatedSettings.theme as 'light' | 'dark' | 'auto',
      emailNotifications: updatedSettings.emailNotifications,
      pushNotifications: updatedSettings.pushNotifications,
      smsNotifications: updatedSettings.smsNotifications,
      dataRetention: updatedSettings.dataRetention,
      backupEnabled: updatedSettings.backupEnabled,
      backupFrequency: updatedSettings.backupFrequency as 'daily' | 'weekly' | 'monthly',
      qrExpiryDays: updatedSettings.qrExpiryDays,
      defaultDepartment: updatedSettings.defaultDepartment,
      autoGenerateEmployeeId: updatedSettings.autoGenerateEmployeeId
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: responseSettings 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if settings exist first
    const existingSettings = await db.settings.findFirst()
    
    let resetSettings
    if (existingSettings) {
      // Reset existing settings to default
      resetSettings = await db.settings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: defaultSettings.companyName,
          companyAddress: defaultSettings.companyAddress,
          companyPhone: defaultSettings.companyPhone,
          companyEmail: defaultSettings.companyEmail,
          companyLogo: null,
          timezone: defaultSettings.timezone,
          language: defaultSettings.language,
          theme: defaultSettings.theme,
          emailNotifications: defaultSettings.emailNotifications,
          pushNotifications: defaultSettings.pushNotifications,
          smsNotifications: defaultSettings.smsNotifications,
          dataRetention: defaultSettings.dataRetention,
          backupEnabled: defaultSettings.backupEnabled,
          backupFrequency: defaultSettings.backupFrequency,
          qrExpiryDays: defaultSettings.qrExpiryDays,
          defaultDepartment: defaultSettings.defaultDepartment,
          autoGenerateEmployeeId: defaultSettings.autoGenerateEmployeeId
        }
      })
    } else {
      // Create new settings with default values
      resetSettings = await db.settings.create({
        data: {
          companyName: defaultSettings.companyName,
          companyAddress: defaultSettings.companyAddress,
          companyPhone: defaultSettings.companyPhone,
          companyEmail: defaultSettings.companyEmail,
          companyLogo: null,
          timezone: defaultSettings.timezone,
          language: defaultSettings.language,
          theme: defaultSettings.theme,
          emailNotifications: defaultSettings.emailNotifications,
          pushNotifications: defaultSettings.pushNotifications,
          smsNotifications: defaultSettings.smsNotifications,
          dataRetention: defaultSettings.dataRetention,
          backupEnabled: defaultSettings.backupEnabled,
          backupFrequency: defaultSettings.backupFrequency,
          qrExpiryDays: defaultSettings.qrExpiryDays,
          defaultDepartment: defaultSettings.defaultDepartment,
          autoGenerateEmployeeId: defaultSettings.autoGenerateEmployeeId
        }
      })
    }

    // Format the response
    const responseSettings: SettingsData = {
      companyName: resetSettings.companyName,
      companyAddress: resetSettings.companyAddress,
      companyPhone: resetSettings.companyPhone,
      companyEmail: resetSettings.companyEmail,
      companyLogo: resetSettings.companyLogo || undefined,
      timezone: resetSettings.timezone,
      language: resetSettings.language,
      theme: resetSettings.theme as 'light' | 'dark' | 'auto',
      emailNotifications: resetSettings.emailNotifications,
      pushNotifications: resetSettings.pushNotifications,
      smsNotifications: resetSettings.smsNotifications,
      dataRetention: resetSettings.dataRetention,
      backupEnabled: resetSettings.backupEnabled,
      backupFrequency: resetSettings.backupFrequency as 'daily' | 'weekly' | 'monthly',
      qrExpiryDays: resetSettings.qrExpiryDays,
      defaultDepartment: resetSettings.defaultDepartment,
      autoGenerateEmployeeId: resetSettings.autoGenerateEmployeeId
    }

    return NextResponse.json({ 
      message: 'Settings reset to default',
      settings: responseSettings 
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json({ error: 'Failed to reset settings' }, { status: 500 })
  }
}