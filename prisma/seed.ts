import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Default Settings (already working for you)
  await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      companyName: 'Prime Steel Industries',
      companyAddress: 'Jamrud Road, Near Saleem Check Post, Khyber 2500',
      companyPhone: '091-XXXXXXX',
      companyEmail: 'support@primesteel.com',
      timezone: 'Asia/Karachi',
      language: 'en',
      theme: 'light'
    }
  })

  // 🔑 Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.admin.upsert({
    where: { email: 'admin@primesteel.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@primesteel.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Default Admin Created: admin@primesteel.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
