import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { BlockchainEventListener } from './blockchain-event-listener.service';

@Module({
  providers: [BlockchainService, BlockchainEventListener],
  controllers: [BlockchainController],
  exports: [BlockchainService, BlockchainEventListener],
})
export class BlockchainModule {}
