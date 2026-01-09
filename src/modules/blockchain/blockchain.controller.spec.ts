import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';

describe('BlockchainController', () => {
  let controller: BlockchainController;
  let blockchainService: BlockchainService;

  const mockBlockchainService = {
    getCurrentBlockNumber: jest.fn(),
    getBalance: jest.fn(),
    getTransaction: jest.fn(),
    getTransactionReceipt: jest.fn(),
    getBlock: jest.fn(),
    getGasPrice: jest.fn(),
    isValidAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainController],
      providers: [
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
      ],
    }).compile();

    controller = module.get<BlockchainController>(BlockchainController);
    blockchainService = module.get<BlockchainService>(BlockchainService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentBlockNumber', () => {
    it('should return current block number', async () => {
      const blockNumber = 18000000;
      mockBlockchainService.getCurrentBlockNumber.mockResolvedValue(blockNumber);

      const result = await controller.getCurrentBlockNumber();

      expect(blockchainService.getCurrentBlockNumber).toHaveBeenCalled();
      expect(result).toEqual({ blockNumber });
    });
  });

  describe('getBalance', () => {
    it('should return balance for valid address', async () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      const balance = '1.5';
      mockBlockchainService.getBalance.mockResolvedValue(balance);

      const result = await controller.getBalance(address);

      expect(blockchainService.getBalance).toHaveBeenCalledWith(address);
      expect(result).toEqual({ address, balance });
    });
  });

  describe('getGasPrice', () => {
    it('should return current gas price', async () => {
      const gasPrice = '25.5';
      mockBlockchainService.getGasPrice.mockResolvedValue(gasPrice);

      const result = await controller.getGasPrice();

      expect(blockchainService.getGasPrice).toHaveBeenCalled();
      expect(result).toEqual({ gasPrice });
    });
  });

  describe('validateAddress', () => {
    it('should validate address and return true for valid address', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      mockBlockchainService.isValidAddress.mockReturnValue(true);

      const result = controller.validateAddress(address);

      expect(blockchainService.isValidAddress).toHaveBeenCalledWith(address);
      expect(result).toEqual({ address, isValid: true });
    });

    it('should validate address and return false for invalid address', () => {
      const address = 'invalid-address';
      mockBlockchainService.isValidAddress.mockReturnValue(false);

      const result = controller.validateAddress(address);

      expect(blockchainService.isValidAddress).toHaveBeenCalledWith(address);
      expect(result).toEqual({ address, isValid: false });
    });
  });
});
