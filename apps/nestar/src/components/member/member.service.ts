import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
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
