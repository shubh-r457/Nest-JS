import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    toObject: function() {
      return { ...this };
    },
    save: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: '507f1f77bcf86cd799439011',
      save: jest.fn().mockResolvedValue(mockUser),
    })),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = mockUserModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      userModel.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      // Mock constructor and save
      const mockUserInstance = {
        _id: '507f1f77bcf86cd799439011',
        email: registerDto.email,
        name: registerDto.name,
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          email: registerDto.email,
          name: registerDto.name,
        }),
      };

      // Mock the model constructor
      (userModel as any).mockReturnValue(mockUserInstance);

      const result = await service.register(registerDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      userModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          ...mockUser,
          password: await bcrypt.hash(password, 10),
        }),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      userModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.validateUser('invalid@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const result = await service.generateToken(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
