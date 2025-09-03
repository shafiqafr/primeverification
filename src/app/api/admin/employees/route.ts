import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employees = await db.employee.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      fullName,
      department,
      region,
      email,
      dateOfBirth,
      phoneNumber,
      whatsappNumber,
      bloodGroup,
      profilePicture,
      status,
      issueDate,
      expiryDate
    } = body

    // Generate unique employee ID
    const employeeCount = await db.employee.count()
    const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`

    const employee = await db.employee.create({
      data: {
        employeeId,
        fullName,
        department,
        region,
        email,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        whatsappNumber,
        bloodGroup,
        profilePicture,
        status,
        issueDate: new Date(issueDate),
        expiryDate: new Date(expiryDate)
      }
    })

    return NextResponse.json({ employee })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}