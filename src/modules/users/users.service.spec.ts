import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    role: 'user',
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: 'LoggerService',
          useValue: mockLoggerService,
        },
        {
          provide: 'CacheService',
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = mockUserModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      const mockOptions = { page: 1, limit: 10 };
      
      mockUserModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      });
      
      mockUserModel.countDocuments = jest.fn().mockResolvedValue(1);

      const result = await service.findAll(mockOptions);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(userModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(mockUser._id);

      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });
});
