import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AuthenticationError, ConflictError, NotFoundError, ValidationError } from '../utils/errors.js';
import { JwtPayload } from '../types/index.js';

export class AuthService {
  async register(email: string, firstName: string, lastName: string, password: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get voter role
    const voterRole = await prisma.role.findUnique({
      where: { name: 'VOTER' }
    });

    if (!voterRole) {
      throw new ValidationError('Voter role not found');
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        roleId: voterRole.id
      },
      include: { role: true }
    });

    return this.formatUser(user);
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.roleId);

    return {
      user: this.formatUser(user),
      ...tokens
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt_refresh_secret) as JwtPayload;

      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token }
      });

      if (!refreshToken) {
        throw new AuthenticationError('Refresh token not found');
      }

      if (new Date() > refreshToken.expiresAt) {
        throw new AuthenticationError('Refresh token expired');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      return this.generateTokens(user.id, user.email, user.roleId);
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }

  private generateTokens(userId: string, email: string, roleId: string) {
    const payload: JwtPayload = { userId, email, roleId };

    const accessToken = jwt.sign(payload, config.jwt_access_secret, {
      expiresIn: config.jwt_access_expiry
    });

    const refreshToken = jwt.sign(payload, config.jwt_refresh_secret, {
      expiresIn: config.jwt_refresh_expiry
    });

    return { accessToken, refreshToken };
  }

  private formatUser(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
