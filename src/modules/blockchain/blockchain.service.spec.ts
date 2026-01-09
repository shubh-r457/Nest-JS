import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';

describe('BlockchainService', () => {
  let service: BlockchainService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ETHEREUM_RPC_URL') {
        return 'https://eth-mainnet.g.alchemy.com/v2/test-key';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isValidAddress', () => {
    it('should validate correct Ethereum address', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
      expect(service.isValidAddress(validAddress)).toBe(true);
    });

    it('should invalidate incorrect Ethereum address', () => {
      const invalidAddress = 'invalid-address';
      expect(service.isValidAddress(invalidAddress)).toBe(false);
    });

    it('should invalidate empty string', () => {
      expect(service.isValidAddress('')).toBe(false);
    });

    it('should invalidate address without 0x prefix', () => {
      const addressWithoutPrefix = '742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      expect(service.isValidAddress(addressWithoutPrefix)).toBe(false);
    });
  });

  describe('onModuleInit', () => {
    it('should initialize provider on module init', () => {
      service.onModuleInit();
      expect(configService.get).toHaveBeenCalledWith('ETHEREUM_RPC_URL');
    });
  });
});
