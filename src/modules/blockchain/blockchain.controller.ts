import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidateEthereumAddressPipe } from '../../common/pipes/validate-ethereum-address.pipe';
import { ValidateTransactionHashPipe } from '../../common/pipes/validate-transaction-hash.pipe';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Public()
  @Get('block-number')
  @ApiOperation({ summary: 'Get current blockchain block number' })
  @ApiResponse({ status: 200, description: 'Returns current block number' })
  async getCurrentBlockNumber() {
    const blockNumber = await this.blockchainService.getCurrentBlockNumber();
    return { blockNumber };
  }

  @Public()
  @Get('balance/:address')
  @ApiOperation({ summary: 'Get ETH balance of an address' })
  @ApiParam({ name: 'address', description: 'Ethereum address', example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' })
  @ApiResponse({ status: 200, description: 'Returns balance in ETH' })
  @ApiResponse({ status: 400, description: 'Invalid address format' })
  async getBalance(@Param('address', ValidateEthereumAddressPipe) address: string) {
    const balance = await this.blockchainService.getBalance(address);
    return { address, balance };
  }

  @Public()
  @Get('transaction/:hash')
  @ApiOperation({ summary: 'Get transaction details by hash' })
  @ApiParam({ name: 'hash', description: 'Transaction hash', example: '0x...' })
  @ApiResponse({ status: 200, description: 'Returns transaction details' })
  @ApiResponse({ status: 400, description: 'Invalid transaction hash' })
  async getTransaction(@Param('hash', ValidateTransactionHashPipe) hash: string) {
    const transaction = await this.blockchainService.getTransaction(hash);
    return transaction;
  }

  @Public()
  @Get('transaction-receipt/:hash')
  @ApiOperation({ summary: 'Get transaction receipt by hash' })
  @ApiParam({ name: 'hash', description: 'Transaction hash', example: '0x...' })
  @ApiResponse({ status: 200, description: 'Returns transaction receipt' })
  @ApiResponse({ status: 400, description: 'Invalid transaction hash' })
  async getTransactionReceipt(@Param('hash', ValidateTransactionHashPipe) hash: string) {
    const receipt = await this.blockchainService.getTransactionReceipt(hash);
    return receipt;
  }

  @Public()
  @Get('block/:number')
  @ApiOperation({ summary: 'Get block details by number' })
  @ApiParam({ name: 'number', description: 'Block number', example: '12345678' })
  @ApiResponse({ status: 200, description: 'Returns block details' })
  async getBlock(@Param('number') number: string) {
    const block = await this.blockchainService.getBlock(parseInt(number));
    return block;
  }

  @Public()
  @Get('gas-price')
  @ApiOperation({ summary: 'Get current gas price' })
  @ApiResponse({ status: 200, description: 'Returns current gas price in gwei' })
  async getGasPrice() {
    const gasPrice = await this.blockchainService.getGasPrice();
    return { gasPrice };
  }

  @Public()
  @Get('validate-address/:address')
  @ApiOperation({ summary: 'Validate Ethereum address format' })
  @ApiParam({ name: 'address', description: 'Ethereum address to validate' })
  @ApiResponse({ status: 200, description: 'Returns validation result' })
  validateAddress(@Param('address') address: string) {
    const isValid = this.blockchainService.isValidAddress(address);
    return { address, isValid };
  }
}
