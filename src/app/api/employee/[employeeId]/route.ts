import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { headers } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const { employeeId } = await params
    
    // Get client IP for logging
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    
    // Get user agent
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Find employee by employeeId
    const employee = await db.employee.findUnique({
      where: { employeeId: employeeId.toUpperCase() }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Log the verification attempt
    await db.verificationLog.create({
      data: {
        employeeId: employee.id,
        ipAddress: ip,
        userAgent: userAgent
      }
    })

    // Format the response
    const response = {
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        department: employee.department,
        region: employee.region,
        email: employee.email,
        dateOfBirth: employee.dateOfBirth.toISOString(),
        phoneNumber: employee.phoneNumber,
        whatsappNumber: employee.whatsappNumber,
        bloodGroup: employee.bloodGroup,
        profilePicture: employee.profilePicture,
        status: employee.status,
        issueDate: employee.issueDate.toISOString(),
        expiryDate: employee.expiryDate.toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}