import { Controller, Get, Logger } from '@nestjs/common';
import { NestarBatchService } from './nestar-batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class NestarBatchController {
	private logger: Logger = new Logger('BatchController');
	constructor(private readonly batchService: NestarBatchService) {}

	// @Timeout(2000)
	// handleTimeout() {
	// 	this.logger.debug('Batch server ready');
	// }

	// @Interval(1000)
	// handleInterval() {
	// 	this.logger.debug('INTERVAL TEST');
	// }

	// @Cron('00 * * * * *', { name: 'CRON_TEST' })
	// cronTest() {
	// 	this.logger['context'] = 'CRON_TEST';
	// 	this.logger.debug('EXECUTED');
	// }

	@Cron('0 * * * * *', { name: BATCH_ROLLBACK })
	async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('Executed');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES })
	async batchProperties() {
		try {
			this.logger['context'] = BATCH_TOP_PROPERTIES;
			this.logger.debug('Executed');
			await this.batchService.batchProperties();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 * * * * *', { name: BATCH_TOP_AGENTS })
	async batchAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('Executed');
			await this.batchService.batchAgents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
