# Ambient Sensors Dashboard

A real-time sensor monitoring dashboard built with Ionic React and FastAPI, designed to visualize and track environmental sensor data.

## Features

- **Real-time Monitoring**: Automatically refreshes sensor readings every minute
- **Multi-Sensor Support**: Display data from multiple sensors simultaneously
- **Threshold Alerts**: Visual color-coded indicators (green/yellow/red) based on configurable thresholds
- **Responsive Design**: Grid-based layout that adapts to different screen sizes
- **RESTful API**: FastAPI backend with PostgreSQL database integration

## Architecture

### Frontend
- **Framework**: Ionic React with TypeScript
- **UI Components**: Ionic UI components
- **State Management**: React hooks (useState, useEffect)
- **Build Tool**: Vite
- **Testing**: Cypress (E2E), Vitest (unit tests)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: psycopg2 with RealDictCursor
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
ambient_sensors_dashboard/
├── frontend/               # Ionic React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
└── server/                # FastAPI backend
    ├── react_api_database_access.py
    └── .env               # Environment variables (not in repo)
```

## Prerequisites

- Node.js (for frontend)
- Python 3.7+ (for backend)
- PostgreSQL database
- SSL certificates (for HTTPS)

## Installation

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd server
pip install fastapi uvicorn psycopg2 python-dotenv
```

Create a `.env` file in the `server/` directory:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
SSL_KEYFILE=path/to/ssl/key.pem
SSL_CERTFILE=path/to/ssl/cert.pem
```

## Running the Application

### Start the Backend

```bash
cd server
python react_api_database_access.py
```

The API will be available at `https://localhost:8080`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The dashboard will be available at the local development URL provided by Vite.

## API Endpoints

- `GET /api/sensors/measurements/latest` - Get latest readings for all sensors with threshold values
- `GET /api/sensors` - Get all registered sensors
- `GET /api/devices` - Get all devices

## Database Schema

The application expects the following PostgreSQL tables:
- `sensors` - Sensor configuration and metadata
- `measurements` - Time-series sensor readings
- `metric_thresholds` - Threshold values for good/acceptable ranges
- `devices` - Device registry

## Development

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test.e2e` - Run Cypress E2E tests
- `npm run test.unit` - Run Vitest unit tests

## License

This project is private and not licensed for public use.
