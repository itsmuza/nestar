import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'bson';
import { Properties, Property } from '../../libs/dto/property/property';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObject } from '../../libs/config';
import { PropertyUpdate } from '../../libs/dto/property/property.updates';

@Resolver()
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	public async createProperty(
		@Args('input') input: PropertyInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;
		return await this.propertyService.createProperty(input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Property)
	async getProperty(@Args('propertyId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Property> {
		console.log('Query: getProperty');
		const propertyId = shapeIntoMongoObject(input);
		return await this.propertyService.getProperty(memberId, propertyId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	public async updateProperty(
		@Args('input') input: PropertyUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Mutation: updateProperty');
		input._id = shapeIntoMongoObject(input._id);
		return await this.propertyService.updateProperty(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Properties)
	public async getProperties(
		@Args('input') input: PropertiesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Properties> {
		console.log('Query: getProperties');
		return await this.propertyService.getProperties(memberId, input);
	}
}
