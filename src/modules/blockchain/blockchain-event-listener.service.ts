import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

/**
 * Service to listen to blockchain events using NestJS Lifecycle Hooks
 * OnModuleInit - Called when the module is initialized
 * OnModuleDestroy - Called when the module is destroyed
 */
@Injectable()
export class BlockchainEventListener
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(BlockchainEventListener.name);
  private provider: ethers.JsonRpcProvider;
  private listeners: Array<{ event: string; listener: any }> = [];

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Blockchain Event Listener initialized');
    
    try {
      const rpcUrl =
        this.configService.get<string>('ETHEREUM_RPC_URL') ||
        'https://eth-mainnet.g.alchemy.com/v2/your-api-key';
      
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Start listening to new blocks
      await this.listenToNewBlocks();
      
      this.logger.log('Event listeners started successfully');
    } catch (error) {
      this.logger.error('Failed to initialize event listeners', error);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down Blockchain Event Listener');
    
    // Clean up all listeners
    this.removeAllListeners();
    
    this.logger.log('All event listeners removed');
  }

  /**
   * Listen to new blocks being mined
   */
  private async listenToNewBlocks() {
    try {
      const blockListener = async (blockNumber: number) => {
        this.logger.log(`New block detected: ${blockNumber}`);
        
        // Fetch block details
        const block = await this.provider.getBlock(blockNumber);
        if (block) {
          this.logger.debug(`Block ${blockNumber} has ${block.transactions.length} transactions`);
        }
      };

      this.provider.on('block', blockListener);
      this.listeners.push({ event: 'block', listener: blockListener });
      
      this.logger.log('Started listening to new blocks');
    } catch (error) {
      this.logger.error('Error setting up block listener', error);
    }
  }

  /**
   * Listen to pending transactions (mempool)
   */
  async listenToPendingTransactions() {
    try {
      const pendingListener = (txHash: string) => {
        this.logger.debug(`Pending transaction: ${txHash}`);
      };

      this.provider.on('pending', pendingListener);
      this.listeners.push({ event: 'pending', listener: pendingListener });
      
      this.logger.log('Started listening to pending transactions');
    } catch (error) {
      this.logger.error('Error setting up pending transaction listener', error);
    }
  }

  /**
   * Listen to specific contract events
   */
  async listenToContractEvent(
    contractAddress: string,
    abi: any[],
    eventName: string,
  ) {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider);
      
      const eventListener = (...args: any[]) => {
        this.logger.log(`Contract event ${eventName} emitted`);
        this.logger.debug(`Event data: ${JSON.stringify(args)}`);
      };

      contract.on(eventName, eventListener);
      this.listeners.push({ event: eventName, listener: eventListener });
      
      this.logger.log(`Started listening to ${eventName} on contract ${contractAddress}`);
    } catch (error) {
      this.logger.error(`Error setting up contract event listener for ${eventName}`, error);
    }
  }

  /**
   * Listen to Transfer events for a specific ERC20 token
   */
  async listenToERC20Transfers(tokenAddress: string, filterAddress?: string) {
    try {
      const erc20Abi = [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ];
      
      const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
      
      const transferListener = (from: string, to: string, value: bigint, event: any) => {
        this.logger.log(`ERC20 Transfer detected`);
        this.logger.debug(`From: ${from}, To: ${to}, Value: ${ethers.formatEther(value)}`);
      };

      if (filterAddress) {
        // Listen to transfers from or to a specific address
        const filter = contract.filters.Transfer(filterAddress, null);
        contract.on(filter, transferListener);
      } else {
        // Listen to all transfers
        contract.on('Transfer', transferListener);
      }

      this.listeners.push({ event: 'Transfer', listener: transferListener });
      
      this.logger.log(`Started listening to ERC20 Transfer events on ${tokenAddress}`);
    } catch (error) {
      this.logger.error('Error setting up ERC20 transfer listener', error);
    }
  }

  /**
   * Listen to a specific address for incoming/outgoing transactions
   */
  async listenToAddressActivity(address: string) {
    try {
      const blockListener = async (blockNumber: number) => {
        const block = await this.provider.getBlock(blockNumber, true);
        
        if (block && block.transactions) {
          const relevantTxs = block.transactions.filter((tx: any) => {
            return tx.from === address || tx.to === address;
          });

          if (relevantTxs.length > 0) {
            this.logger.log(`Address ${address} has ${relevantTxs.length} transactions in block ${blockNumber}`);
            relevantTxs.forEach((tx: any) => {
              this.logger.debug(`TX: ${tx.hash}`);
            });
          }
        }
      };

      this.provider.on('block', blockListener);
      this.listeners.push({ event: `address-${address}`, listener: blockListener });
      
      this.logger.log(`Started monitoring address: ${address}`);
    } catch (error) {
      this.logger.error(`Error setting up address activity listener for ${address}`, error);
    }
  }

  /**
   * Remove all event listeners
   */
  private removeAllListeners() {
    try {
      this.provider.removeAllListeners();
      this.listeners = [];
      this.logger.log('All listeners removed successfully');
    } catch (error) {
      this.logger.error('Error removing listeners', error);
    }
  }

  /**
   * Get current listener count
   */
  getListenerCount(): number {
    return this.listeners.length;
  }

  /**
   * Get list of active listeners
   */
  getActiveListeners(): string[] {
    return this.listeners.map((l) => l.event);
  }
}
