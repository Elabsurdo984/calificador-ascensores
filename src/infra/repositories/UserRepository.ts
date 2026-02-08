import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User, CreateUserDTO } from '../../domain';
import { AuthService } from '../../core/AuthService';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private toDomain(record: PrismaUser): User {
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async create(dto: CreateUserDTO): Promise<User> {
    // Validate email
    if (!AuthService.validateEmail(dto.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    const passwordValidation = AuthService.validatePassword(dto.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message || 'Invalid password');
    }

    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<(User & { password: string }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await AuthService.comparePassword(password, user.password);
    if (!isValid) return null;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
