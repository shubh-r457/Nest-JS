import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const rpcUrl =
        this.configService.get<string>('ETHEREUM_RPC_URL') ||
        'https://eth-mainnet.g.alchemy.com/v2/your-api-key';
      
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      if (privateKey) {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.logger.log('Wallet initialized successfully');
      }
      
      this.logger.log('Blockchain service initialized');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service', error);
    }
  }

  /**
   * Get the current block number
   */
  async getCurrentBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      this.logger.error('Error getting block number', error);
      throw error;
    }
  }

  /**
   * Get ETH balance of an address
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      this.logger.error(`Error getting balance for ${address}`, error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash: string): Promise<any> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      return tx;
    } catch (error) {
      this.logger.error(`Error getting transaction ${txHash}`, error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      this.logger.error(`Error getting transaction receipt ${txHash}`, error);
      throw error;
    }
  }

  /**
   * Get block details
   */
  async getBlock(blockNumber: number): Promise<any> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return block;
    } catch (error) {
      this.logger.error(`Error getting block ${blockNumber}`, error);
      throw error;
    }
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Get gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || 0n, 'gwei');
    } catch (error) {
      this.logger.error('Error getting gas price', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(transaction: ethers.TransactionRequest): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas(transaction);
      return gasEstimate.toString();
    } catch (error) {
      this.logger.error('Error estimating gas', error);
      throw error;
    }
  }

  /**
   * Send a transaction (requires wallet)
   */
  async sendTransaction(
    to: string,
    value: string,
  ): Promise<ethers.TransactionResponse> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(value),
      });
      
      this.logger.log(`Transaction sent: ${tx.hash}`);
      return tx;
    } catch (error) {
      this.logger.error('Error sending transaction', error);
      throw error;
    }
  }

  /**
   * Interact with a smart contract (read)
   */
  async callContract(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = [],
  ): Promise<any> {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider);
      const result = await contract[methodName](...params);
      return result;
    } catch (error) {
      this.logger.error(`Error calling contract method ${methodName}`, error);
      throw error;
    }
  }

  /**
   * Interact with a smart contract (write) - requires wallet
   */
  async writeContract(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = [],
  ): Promise<ethers.TransactionResponse> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, this.wallet);
      const tx = await contract[methodName](...params);
      this.logger.log(`Contract transaction sent: ${tx.hash}`);
      return tx;
    } catch (error) {
      this.logger.error(`Error writing to contract method ${methodName}`, error);
      throw error;
    }
  }

  /**
   * Listen to events from a smart contract
   */
  async listenToContractEvents(
    contractAddress: string,
    abi: any[],
    eventName: string,
    callback: (event: any) => void,
  ): Promise<void> {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider);
      
      contract.on(eventName, (...args) => {
        this.logger.log(`Event ${eventName} received`);
        callback(args);
      });
      
      this.logger.log(`Listening to ${eventName} events on ${contractAddress}`);
    } catch (error) {
      this.logger.error(`Error setting up event listener for ${eventName}`, error);
      throw error;
    }
  }
}
