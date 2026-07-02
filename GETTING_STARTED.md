# 🚀 Getting Started Guide

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **Docker** (optional): For containerized setup
- **Git**: For version control

## Installation

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/thesurya46/Online-voting-system.git
cd Online-voting-system

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

### Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/voting_system

# Create database
creatdb voting_system

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev
```

**Backend runs on**: `http://localhost:5000`

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

## Configuration

### Environment Variables

#### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/voting_system

# JWT
JWT_ACCESS_SECRET=your_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_secret_key_min_32_chars

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Online Voting System
```

## Test Credentials

### Users Pre-loaded with Seed Data

```
📊 Super Admin
Email: admin@votingsystem.com
Password: Admin@12345
Role: SUPER_ADMIN

🗳️ Election Admin
Email: election.admin@votingsystem.com
Password: Admin@12345
Role: ELECTION_ADMIN

👥 Sample Voters (5)
Email: voter1@votingsystem.com to voter5@votingsystem.com
Password: Admin@12345
Role: VOTER
```

## Project Structure

```
Online-voting-system/
├── backend/              # Node.js + Express server
│   ├── src/             # Source code
│   ├── prisma/          # Database schema & migrations
│   ├── tests/           # Test files
│   └── Dockerfile
├── frontend/            # React + Vite application
│   ├── src/             # React components
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml   # Docker Compose configuration
├── .env.example         # Environment variables template
├── README.md            # Project documentation
├── ARCHITECTURE.md      # Architecture documentation
├── DEPLOYMENT.md        # Deployment guide
└── TESTING.md          # Testing guide
```

## Development Workflow

### Running Both Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database UI (optional)
cd backend
npm run prisma:studio
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/refresh         - Refresh token
POST   /api/auth/logout          - Logout user
GET    /api/auth/me              - Get current user
```

### Elections
```
GET    /api/elections            - List elections
GET    /api/elections/:id        - Get election details
POST   /api/elections            - Create election (Admin)
PUT    /api/elections/:id        - Update election (Admin)
DELETE /api/elections/:id        - Delete election (Admin)
```

### Analytics
```
GET    /api/analytics/election/:id/stats      - Get election statistics
GET    /api/analytics/election/:id/report     - Generate report
GET    /api/analytics/election/:id/report/pdf - Export as PDF
GET    /api/analytics/election/:id/report/csv - Export as CSV
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL status
sudo service postgresql status

# Test connection
psql -U postgres -d voting_system
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Explore the API**: Visit `http://localhost:5000/api/docs`
2. **Test Authentication**: Login with provided credentials
3. **Create Elections**: Use admin panel to create elections
4. **Review Code**: Check out the implementation
5. **Customize**: Modify to fit your needs

## Support & Documentation

- **API Docs**: Swagger UI at `/api/docs`
- **Architecture**: See `ARCHITECTURE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Security**: See `SECURITY.md`
- **Testing**: See `TESTING.md`
- **Advanced Features**: See `ADVANCED_FEATURES.md`

## Common Commands

```bash
# Backend
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Run linter
npm run migrate          # Run database migrations
npm run seed             # Seed database
npm run prisma:studio    # Open Prisma Studio

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run lint             # Run linter
```

## License

MIT License - See LICENSE file for details

## Author

**Surya Dev**
- GitHub: [@thesurya46](https://github.com/thesurya46)
- Email: suryasnatapanigrahi46@gmail.com

---

**Built with ❤️ for secure and transparent elections**
