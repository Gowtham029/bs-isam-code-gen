import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiSecurity,
} from '@bluescape/nestjs-swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ResourceType,
  RoleType,
} from '../../../access-management/access-control/role';
import {
  API_SECURITY_USER_ACCESS_TOKEN,
  ApiLevel,
} from '../../../common/constants';
import { IdParam } from '../../../common/decorators';
import { FilterBy, OrderBy, Pagination } from '../../../common/decorators';
import { Cursor } from '../../../common/decorators/pagination/cursor.decorator';
import {
  ApiResponseStandardErrors,
  Method,
} from '../../../common/openapi/decorators/api-response-standard-errors.decorator';
import {
  FetchParams,
  FilterByParams,
  OrderByParams,
  PaginationParams,
} from '../../../common/params';
import { Id } from '../../../common/types';
import {
  IsamApi,
  JwtAuthGuard,
  RoleBasedPermissions,
  RolesGuard,
} from '../../../identity';
import { <%= kebabToPascal(config.name) %>CreateDTO } from './dtos/<%= (config.name) %>-create.dto';
import { <%= kebabToPascal(config.name) %>ListDTO } from './dtos/<%= (config.name) %>-list.dto';
import { <%= kebabToPascal(config.name) %>PatchDTO } from './dtos/<%= (config.name) %>-patch.dto';
import { <%= kebabToPascal(config.name) %>DTO } from './dtos/<%= (config.name) %>.dto';
import { API_TAG_<%= kebabToConstant(config.name) %> } from './<%= (config.name) %>s.constants';
import { <%= kebabToPascal(config.name) %>Map } from './<%= (config.name) %>s.datamapper';
import { <%= kebabToPascal(config.name) %>Service } from './<%= (config.name) %>s.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('<%= kebabToCamel(config.name) %>s')
export class <%= kebabToPascal(config.name) %>Controller {
  constructor(private readonly <%= kebabToCamel(config.name) %>Service: <%= kebabToPascal(config.name) %>Service) {}

  // POST /<%= kebabToCamel(config.name) %>s
  @IsamApi({
    tag: API_TAG_<%= kebabToConstant(config.name) %>,
    summary: '<%= (config.name) %>',
    description: `<%= (config.name) %>`,
    apiLevel: ApiLevel.Private,
    apiId: 'isam-',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    roleTypes: [RoleType.Admin],
    permissions: [],
  })
  @ApiResponseStandardErrors(Method.Post)
  @ApiSecurity(API_SECURITY_USER_ACCESS_TOKEN)
  @Post()
  async create<%= kebabToPascal(config.name) %>(
    @Body() <%= kebabToCamel(config.name) %>: <%= kebabToPascal(config.name) %>CreateDTO,
  ): Promise<<%= kebabToPascal(config.name) %>DTO> {
    const result = await this.<%= kebabToCamel(config.name) %>Service.create<%= kebabToPascal(config.name) %>(<%= kebabToCamel(config.name) %>);
    return <%= kebabToPascal(config.name) %>Map.toListDTO(result);
  }

  // GET /<%= kebabToCamel(config.name) %>s
  @IsamApi({
    tag: API_TAG_<%= kebabToConstant(config.name) %>,
    summary: '<%= (config.name) %>',
    description: '<%= (config.name) %> List',
    apiLevel: ApiLevel.Private,
    apiId: 'isam-',
  })
  @ApiResponseStandardErrors(Method.Get)
  @ApiSecurity(API_SECURITY_USER_ACCESS_TOKEN)
  @Get()
  async get<%= kebabToPascal(config.name) %>s(
    @Cursor() cursor?: FetchParams,
    @Pagination pagination?: PaginationParams,
    @OrderBy([])
    orderBy?: OrderByParams,
    @FilterBy([], {
      example: ``,
    })
    filterBy?: FilterByParams,
  ): Promise<<%= kebabToPascal(config.name) %>ListDTO> {
    const fetchParams =
      cursor ?? new FetchParams(pagination, orderBy, filterBy);
    const <%= kebabToCamel(config.name) %>s = await this.<%= kebabToCamel(config.name) %>Service.get<%= kebabToPascal(config.name) %>s(fetchParams);
    return <%= kebabToPascal(config.name) %>Map.toPaginated<%= kebabToPascal(config.name) %>DTO(<%= kebabToCamel(config.name) %>s);
  }

  // GET /<%= kebabToCamel(config.name) %>s/:<%= kebabToCamel(config.name) %>Id
  @IsamApi({
    tag: API_TAG_<%= kebabToConstant(config.name) %>,
    summary: 'Get a <%= (config.name) %>',
    description: 'Get a <%= (config.name) %>',
    apiLevel: ApiLevel.Private,
    apiId: 'isam-',
  })
  @ApiResponseStandardErrors(Method.Get)
  @ApiSecurity(API_SECURITY_USER_ACCESS_TOKEN)
  @Get('/:<%= kebabToCamel(config.name) %>Id')
  async get<%= kebabToPascal(config.name) %>ById(
    @IdParam('<%= kebabToCamel(config.name) %>Id') <%= kebabToCamel(config.name) %>Id: Id,
  ): Promise<<%= kebabToPascal(config.name) %>DTO> {
    const <%= kebabToCamel(config.name) %> = await this.<%= kebabToCamel(config.name) %>Service.get<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
    const <%= kebabToCamel(config.name) %>DTO: <%= kebabToPascal(config.name) %>DTO = <%= kebabToPascal(config.name) %>Map.toListDTO(<%= kebabToCamel(config.name) %>);
    return <%= kebabToCamel(config.name) %>DTO;
  }

  // DELETE /<%= kebabToCamel(config.name) %>s/:<%= kebabToCamel(config.name) %>Id
  @IsamApi({
    tag: API_TAG_<%= kebabToConstant(config.name) %>,
    summary: 'Remove a <%= kebabToCamel(config.name) %>',
    description: ``,
    apiLevel: ApiLevel.Private,
    apiId: 'isam-',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    roleTypes: [RoleType.Admin],
    permissions: [],
  })
  @ApiOkResponse()
  @ApiResponseStandardErrors(Method.Delete)
  @Delete(':<%= kebabToCamel(config.name) %>Id')
  async delete<%= kebabToPascal(config.name) %>(@IdParam('<%= kebabToCamel(config.name) %>Id') <%= kebabToCamel(config.name) %>Id: Id): Promise<void> {
    await this.<%= kebabToCamel(config.name) %>Service.delete<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
  }

  // PATCH /<%= kebabToCamel(config.name) %>s/:<%= kebabToCamel(config.name) %>Id
  @IsamApi({
    tag: API_TAG_<%= kebabToConstant(config.name) %>,
    summary: '<%= (config.name) %>',
    description: `Update <%= (config.name) %>`,
    apiLevel: ApiLevel.Private,
    apiId: 'isam-',
  })
  @RoleBasedPermissions({
    resourceType: ResourceType.Application,
    permissions: [],
  })
  @ApiResponseStandardErrors(Method.Patch)
  @ApiSecurity(API_SECURITY_USER_ACCESS_TOKEN)
  @Patch(':<%= kebabToCamel(config.name) %>Id')
  async update<%= kebabToPascal(config.name) %>(
    @IdParam('<%= kebabToCamel(config.name) %>Id') <%= kebabToCamel(config.name) %>Id: Id,
    @Body() <%= kebabToCamel(config.name) %>: <%= kebabToPascal(config.name) %>PatchDTO,
  ): Promise<<%= kebabToPascal(config.name) %>DTO> {
    const result = await this.<%= kebabToCamel(config.name) %>Service.update<%= kebabToPascal(config.name) %>ById(
      <%= kebabToCamel(config.name) %>Id,
      <%= kebabToCamel(config.name) %>,
    );
    return <%= kebabToPascal(config.name) %>Map.toListDTO(result);
  }
}
