-- CreateEnum
CREATE TYPE "public"."EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."AdminRole" AS ENUM ('ADMIN', 'HR');

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "region" TEXT,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "bloodGroup" TEXT NOT NULL,
    "profilePicture" TEXT,
    "status" "public"."EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationLog" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyLogo" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Karachi',
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "dataRetention" INTEGER NOT NULL DEFAULT 365,
    "backupEnabled" BOOLEAN NOT NULL DEFAULT true,
    "backupFrequency" TEXT NOT NULL DEFAULT 'daily',
    "qrExpiryDays" INTEGER NOT NULL DEFAULT 365,
    "defaultDepartment" TEXT NOT NULL DEFAULT 'Human Resources',
    "autoGenerateEmployeeId" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "public"."Employee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."VerificationLog" ADD CONSTRAINT "VerificationLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
