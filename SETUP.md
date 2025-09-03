# Prime Steel Employee Verification System - Local Setup Guide

## 🚀 Project Overview
This is a complete employee verification system built with Next.js 15, featuring:
- Employee verification with QR codes
- Admin dashboard with full CRUD operations
- Company settings management
- Password management system
- Responsive design with modern UI

## 📋 System Requirements
- Node.js 18+ (recommended: 20.x)
- npm or yarn package manager
- 4GB+ RAM recommended
- 2GB+ free disk space

## 🛠️ Installation Steps

### 1. Download and Extract
```bash
# Extract the project files to your desired location
# Make sure you have the complete project folder with all files
```

### 2. Install Dependencies
```bash
# Navigate to the project directory
cd prime-steel-verification

# Install all required packages
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database URL (SQLite - file-based)
DATABASE_URL="file:./db/custom.db"

# NextAuth Secret (generate a new one for production)
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
NODE_ENV="development"
```

### 5. Start the Development Server
```bash
# Start the development server with hot reload
npm run dev
```

The application will be available at: `http://localhost:3000`

## 🔐 Default Login Credentials
- **Username**: `admin`
- **Password**: `password`

## 🗂️ Project Structure
```
prime-steel-verification/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   ├── lib/                # Utility functions
│   └── hooks/              # Custom React hooks
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── db/                     # Database files
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── SETUP.md               # This file
```

## 🎯 Key Features

### Employee Verification
- Search employees by ID
- Generate QR codes for verification
- View detailed employee reports
- WhatsApp integration for sales contact

### Admin Dashboard
- Employee management (CRUD operations)
- System settings configuration
- Password management
- Activity logs viewing

### System Settings
- Company information management
- Logo upload and display
- Notification preferences
- Data retention settings

## 🔄 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run code linting

# Database
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with data
npm run db:reset     # Reset database (CAUTION: deletes all data)
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Ensure the db directory exists
mkdir -p db

# Check file permissions
chmod 755 db/
```

#### 2. Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 4. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### 5. Authentication Issues
```bash
# Reset database and re-seed
npm run db:reset
npm run db:seed
```

## 📱 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Production Deployment

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV="production"
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="generate-a-strong-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## 📊 Performance Notes
- SQLite database is suitable for small to medium deployments
- For large-scale deployments, consider PostgreSQL or MySQL
- QR code generation is client-side for better performance
- Images are optimized with Next.js Image component

## 🔒 Security Considerations
- Change default admin password immediately
- Use strong NEXTAUTH_SECRET in production
- Regular database backups recommended
- Keep dependencies updated

## 📞 Support
For issues and questions:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Check server logs in the terminal
4. Ensure all dependencies are properly installed

---

## 🎉 You're Ready!
After following these steps, your Prime Steel Employee Verification System should be running locally without any errors. The system is fully functional and ready for use or further customization.