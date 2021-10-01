import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

import { OrderingGql, Paginated, StringFilter } from '../../../common/graphql';
import { FieldOrder, FilterByParams } from '../../../common/params';
import { CursorToken, Id } from '../../../common/types';

@ObjectType('<%= kebabToPascal(config.name) %>')
export class <%= kebabToPascal(config.name) %>Gql {
  @Field(() => ID, { description: 'The Id of the <%= (config.name) %>' })
  id: Id;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType()
export class Create<%= kebabToPascal(config.name) %>Input extends OmitType(
  <%= kebabToPascal(config.name) %>Gql,
  ['id', 'updatedAt', 'createdAt'],
  InputType,
) {
}

@InputType()
export class Update<%= kebabToPascal(config.name) %>Input extends PartialType(
  OmitType(<%= kebabToPascal(config.name) %>Gql, ['id', 'createdAt', 'updatedAt'], InputType),
) {
}

/**
 * Return type for paged <%= kebabToCamel(config.name) %>
 */
@ObjectType('<%= kebabToPascal(config.name) %>Paged')
export class <%= kebabToPascal(config.name) %>PagedGql extends Paginated<<%= kebabToPascal(config.name) %>Gql>(<%= kebabToPascal(config.name) %>Gql) {
  @Field(() => String, { nullable: true })
  next?: CursorToken;

  @Field(() => String, { nullable: true })
  prev?: CursorToken;

  @Field(() => Int, { nullable: true })
  totalItems?: number;

  @Field(() => [<%= kebabToPascal(config.name) %>Gql], { nullable: true })
  results?: <%= kebabToPascal(config.name) %>Gql[];
}

export enum SortFields {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}
registerEnumType(SortFields, { name: '<%= kebabToPascal(config.name) %>OrderByField' });
@InputType()
export class <%= kebabToPascal(config.name) %>Ordering extends OrderingGql {
  @Field(() => SortFields)
  field: SortFields;
  @Field(() => FieldOrder)
  order?: FieldOrder = FieldOrder.Asc;
}

/**
 * Input base type for filtering parameters
 */
@InputType()
export class <%= kebabToPascal(config.name) %>FilterFields extends FilterByParams {
}

/**
 * Input type for filtering parameters
 */
@InputType()
export class <%= kebabToPascal(config.name) %>Filters extends <%= kebabToPascal(config.name) %>FilterFields {
  @Field(() => [<%= kebabToPascal(config.name) %>Filters], { nullable: true })
  and?: <%= kebabToPascal(config.name) %>Filters[];

  @Field(() => [<%= kebabToPascal(config.name) %>Filters], { nullable: true })
  or?: <%= kebabToPascal(config.name) %>Filters[];

  @Field(() => [<%= kebabToPascal(config.name) %>Filters], { nullable: true })
  not?: <%= kebabToPascal(config.name) %>Filters[];
}
