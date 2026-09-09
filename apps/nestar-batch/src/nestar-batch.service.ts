import { Injectable } from '@nestjs/common';

@Injectable()
export class NestarBatchService {
	getHello(): string {
		return 'Welcome Nestar Batch server!';
	}

	async batchRollback(): Promise<void> {
		console.log('batch Rollback');
	}

	async batchProperties(): Promise<void> {
		console.log('batch Properties');
	}

	async batchAgents(): Promise<void> {
		console.log('batch Agents');
	}
}
