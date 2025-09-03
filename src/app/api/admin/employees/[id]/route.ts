import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const employee = await db.employee.findUnique({
      where: { id }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json({ employee })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const employee = await db.employee.update({
      where: { id },
      data: {
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
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db.employee.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}