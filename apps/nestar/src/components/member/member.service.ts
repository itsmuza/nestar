import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<null>) {}

	async signup(): Promise<string> {
		return 'signup executed';
	}

	async login(): Promise<string> {
		return 'login executed';
	}

	async updateMember(): Promise<string> {
		return 'updateMember executed';
	}

	async getMember(): Promise<string> {
		return 'getMember executed';
	}
}
