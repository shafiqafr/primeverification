import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Current admin user
    const admin = await db.admin.findUnique({
      where: { id: session.user.id }
    })

    if (!admin) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Hash & save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await db.admin.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
