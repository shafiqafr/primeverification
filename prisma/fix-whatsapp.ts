import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check current employees
  const employees = await prisma.employee.findMany()
  
  console.log('Current employees:')
  for (const emp of employees) {
    console.log(`${emp.employeeId}: ${emp.fullName}, WhatsApp: ${emp.whatsappNumber || 'NOT SET'}`)
  }
  
  // Update WhatsApp numbers for all employees
  const updates = [
    { employeeId: 'EMP001', whatsappNumber: '+1-555-0123' },
    { employeeId: 'EMP002', whatsappNumber: '+1-555-0124' },
    { employeeId: 'EMP003', whatsappNumber: '+1-555-0125' },
    { employeeId: 'EMP004', whatsappNumber: '+1-555-0126' },
    { employeeId: 'EMP005', whatsappNumber: '0334-3838679' }
  ]

  for (const update of updates) {
    try {
      await prisma.employee.update({
        where: { employeeId: update.employeeId },
        data: { whatsappNumber: update.whatsappNumber }
      })
      console.log(`Updated ${update.employeeId} WhatsApp: ${update.whatsappNumber}`)
    } catch (error) {
      console.log(`Failed to update ${update.employeeId}: ${error}`)
    }
  }

  console.log('WhatsApp numbers updated!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })