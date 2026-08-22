import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'bson';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		console.log('input:', input);
		return await this.memberService.signup(input);
	}

	@Mutation(() => Member)
	async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return await this.memberService.login(input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => String)
	async updateMember(@AuthMember('_id') memberId: ObjectId): Promise<string> {
		console.log('Mutation: updateMember');
		console.log(typeof memberId);
		console.log(memberId);
		return this.memberService.updateMember();
	}

	@UseGuards(AuthGuard)
	@Query(() => String)
	async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		return 'hi ' + memberNick;
	}

	@Roles(MemberType.USER)
	@UseGuards(RolesGuard)
	@Query(() => String)
	async checkAuthRoles(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuthRoles');
		console.log('memberNick:', memberNick);
		return 'hi ' + memberNick;
	}

	@Query(() => String)
	async getMember(): Promise<string> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}

	//* ADMIN
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	async getAllMembersByAdmin(): Promise<string> {
		return this.memberService.getAllMembersByAdmin();
	}

	//& Authorization: ADMIN
	@Mutation(() => String)
	async updateMemberByAdmin(): Promise<string> {
		console.log('Mutation: updateMemberByAdmin');
		return this.memberService.updateMemberByAdmin();
	}
}
