import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update existing employees with Pakistani city names
  const updates = [
    { employeeId: 'EMP001', region: 'Peshawar', area: 'Cantonment' },
    { employeeId: 'EMP002', region: 'Islamabad', area: 'City Center' },
    { employeeId: 'EMP003', region: 'Lahore', area: 'Gulberg' },
    { employeeId: 'EMP004', region: 'Karachi', area: 'Clifton' },
    { employeeId: 'EMP005', region: 'Kohat', area: 'Downtown' }
  ]

  for (const update of updates) {
    try {
      await prisma.employee.update({
        where: { employeeId: update.employeeId },
        data: {
          region: update.region,
          area: update.area
        }
      })
      console.log(`Updated ${update.employeeId}: ${update.region} - ${update.area}`)
    } catch (error) {
      console.log(`Employee ${update.employeeId} not found or already updated`)
    }
  }

  console.log('Database updated with Pakistani regions and areas!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })