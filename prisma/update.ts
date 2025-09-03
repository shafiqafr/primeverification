import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update existing employees with Region and Area
  const updates = [
    { employeeId: 'EMP001', region: 'North', area: 'Downtown' },
    { employeeId: 'EMP002', region: 'South', area: 'Uptown' },
    { employeeId: 'EMP003', region: 'East', area: 'Industrial Zone' },
    { employeeId: 'EMP004', region: 'West', area: 'Business District' },
    { employeeId: 'EMP005', region: 'Central', area: 'City Center' }
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
      console.log(`Updated ${update.employeeId} with region: ${update.region}, area: ${update.area}`)
    } catch (error) {
      console.log(`Employee ${update.employeeId} not found or already updated`)
    }
  }

  console.log('Database updated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })