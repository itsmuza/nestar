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
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObject } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

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
	@Mutation(() => Member)
	async updateMember(@Args('input') input: MemberUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Mutation: updateMember');
		delete input._id;
		return this.memberService.updateMember(memberId, input);
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
	async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query: checkAuthRoles');

		return `hi ${authMember.memberNick}, you are ${authMember.memberType} (memberID: ${authMember._id})`;
	}

	@UseGuards(WithoutGuard)
	@Query(() => Member)
	async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		const targetId = shapeIntoMongoObject(input);
		return this.memberService.getMember(memberId, targetId);
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
