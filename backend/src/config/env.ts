import dotenv from 'dotenv';

dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database_url: process.env.DATABASE_URL || '',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_access_expiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwt_refresh_expiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  smtp_host: process.env.SMTP_HOST || '',
  smtp_port: parseInt(process.env.SMTP_PORT || '587', 10),
  smtp_user: process.env.SMTP_USER || '',
  smtp_pass: process.env.SMTP_PASS || '',
  smtp_from: process.env.SMTP_FROM || '',
  smtp_from_name: process.env.SMTP_FROM_NAME || 'Online Voting System',
  max_file_size: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  allowed_file_types: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(','),
  upload_dir: process.env.UPLOAD_DIR || './uploads',
  rate_limit_window: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  rate_limit_max_requests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  cors_origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket_io_cors: process.env.SOCKET_IO_CORS || 'http://localhost:5173'
};

export default config;
