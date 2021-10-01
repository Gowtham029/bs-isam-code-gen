import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ResourceType } from '../../../access-management/access-control/role';
import { PaginationArgInfo } from '../../../common/decorators';
import { PaginationArgs } from '../../../common/graphql';
import {
  FetchParams,
  FilterByParams,
  OrderByParams,
  PaginationParams,
} from '../../../common/params';
import { IdValidationPipe } from '../../../common/pipes';
import { CursorGqlPipe } from '../../../common/pipes/pagination/cursor-gql.pipe';
import { FilteringGqlPipe } from '../../../common/pipes/pagination/filtering-gql.pipe';
import { OrderingGqlPipe } from '../../../common/pipes/pagination/ordering-gql.pipe';
import { Id } from '../../../common/types';
import {
  JwtAuthGuard,
  RoleBasedPermissions,
  RolesGuard,
} from '../../../identity';
import { <%= kebabToPascal(config.name) %>DTO } from './dtos/<%= (config.name) %>.dto';
import { <%= kebabToPascal(config.name) %>Map } from './<%= (config.name) %>s.datamapper';
import {
  Create<%= kebabToPascal(config.name) %>Input,
  <%= kebabToPascal(config.name) %>Filters,
  <%= kebabToPascal(config.name) %>Gql,
  <%= kebabToPascal(config.name) %>Ordering,
  <%= kebabToPascal(config.name) %>PagedGql,
  Update<%= kebabToPascal(config.name) %>Input,
} from './<%= (config.name) %>s.graphql';
import { <%= kebabToPascal(config.name) %>Service } from './<%= (config.name) %>s.service';

@Resolver(() => <%= kebabToPascal(config.name) %>Gql)
@UseGuards(JwtAuthGuard, RolesGuard)
export class <%= kebabToPascal(config.name) %>Resolver {
  constructor(private readonly <%= kebabToCamel(config.name) %>Service: <%= kebabToPascal(config.name) %>Service) {}

  @Mutation(() => <%= kebabToPascal(config.name) %>Gql, {
    description: 'private: Update <%= (config.name) %>',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    permissions: [],
  })
  async update<%= kebabToPascal(config.name) %>(
    @Args('<%= kebabToCamel(config.name) %>Id', { type: () => String }, new IdValidationPipe())
    <%= kebabToCamel(config.name) %>Id: Id,
    @Args('input')
    input: Update<%= kebabToPascal(config.name) %>Input,
  ): Promise<<%= kebabToPascal(config.name) %>Gql> {
    const result = await this.<%= kebabToCamel(config.name) %>Service.update<%= kebabToPascal(config.name) %>ById(
      <%= kebabToCamel(config.name) %>Id,
      input,
    );
    return <%= kebabToPascal(config.name) %>Map.toGql(result);
  }

  @Query(() => <%= kebabToPascal(config.name) %>Gql, { name: 'get<%= kebabToPascal(config.name) %>ById' })
  public async get<%= kebabToPascal(config.name) %>ById(
    @Args('id') <%= kebabToCamel(config.name) %>Id: Id,
  ): Promise<<%= kebabToPascal(config.name) %>Gql> {
    const <%= kebabToCamel(config.name) %> = await this.<%= kebabToCamel(config.name) %>Service.get<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
    const <%= kebabToCamel(config.name) %>DTO: <%= kebabToPascal(config.name) %>DTO = <%= kebabToPascal(config.name) %>Map.toGql(<%= kebabToCamel(config.name) %>);
    return <%= kebabToCamel(config.name) %>DTO;
  }

  @Mutation(() => <%= kebabToPascal(config.name) %>Gql, {
    description: 'private: Creates a new <%= (config.name) %>',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    permissions: [],
  })
  async create<%= kebabToPascal(config.name) %>(
    @Args('input')
    input: Create<%= kebabToPascal(config.name) %>Input,
  ): Promise<<%= kebabToPascal(config.name) %>Gql> {
    const result = await this.<%= kebabToCamel(config.name) %>Service.create<%= kebabToPascal(config.name) %>(input);
    return <%= kebabToPascal(config.name) %>Map.toGql(result);
  }

  @Mutation(() => Boolean, {
    description: 'private: Delete <%= (config.name) %>',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    permissions: [],
  })
  async delete<%= kebabToPascal(config.name) %>(
    @Args('<%= kebabToCamel(config.name) %>Id', { type: () => String }, new IdValidationPipe())
    <%= kebabToCamel(config.name) %>Id: Id,
  ): Promise<boolean> {
    await this.<%= kebabToCamel(config.name) %>Service.delete<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
    return true;
  }

  @Query(() => <%= kebabToPascal(config.name) %>PagedGql, {
    name: 'get<%= kebabToPascal(config.name) %>s',
    description: 'private: Returns <%= kebabToPascal(config.name) %> in a paged collection',
  })
  async get<%= kebabToPascal(config.name) %>s(
    @Args(
      'cursor',
      { nullable: true, defaultValue: undefined, type: () => String },
      CursorGqlPipe,
    )
    cursor?: FetchParams,
    @Args('pagination', { nullable: true, type: () => PaginationArgs })
    @PaginationArgInfo
    pagination?: PaginationParams,
    @Args(
      'ordering',
      { nullable: true, type: () => [<%= kebabToPascal(config.name) %>Ordering] },
      new OrderingGqlPipe(),
    )
    ordering?: OrderByParams,
    @Args(
      'filtering',
      { nullable: true, type: () => <%= kebabToPascal(config.name) %>Filters },
      new FilteringGqlPipe(),
    )
    filterBy?: FilterByParams,
  ): Promise<<%= kebabToPascal(config.name) %>PagedGql> {
    const fetchParams =
      cursor ?? new FetchParams(pagination, ordering, filterBy);
    const paginatedResults = await this.<%= kebabToCamel(config.name) %>Service.get<%= kebabToPascal(config.name) %>s(
      fetchParams,
    );

    return <%= kebabToPascal(config.name) %>Map.toPaginateGql(paginatedResults);
  }
}
