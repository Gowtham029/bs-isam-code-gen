import { Injectable } from '@nestjs/common';

import { PaginatedResults } from '../../../common/domain/Repository';
import {
  IsamErrorEntityNotFound,
  IsamErrorInvalidParameter,
} from '../../../common/isam-errors';
import { FetchParams } from '../../../common/params';
import { IsamLogger } from '../../../common/providers';
import { Id } from '../../../common/types';
import { valueExists } from '../../../common/utils';
import { <%= kebabToPascal(config.name) %>CreateDTO } from './dtos/<%= (config.name) %>-create.dto';
import {
  <%= kebabToConstant(config.name) %>_ALREADY_EXISTS,
  <%= kebabToConstant(config.name) %>_NOT_FOUND,
} from './<%= (config.name) %>.constants';
import { <%= kebabToPascal(config.name) %>, <%= kebabToPascal(config.name) %>PatchProps } from './<%= (config.name) %>.entity';
import { <%= kebabToPascal(config.name) %>Repository } from './<%= (config.name) %>.repository';
import { <%= kebabToPascal(config.name) %>Props } from './<%= (config.name) %>s.entity';

@Injectable()
export class <%= kebabToPascal(config.name) %>Service {
  constructor(
    private readonly <%= kebabToCamel(config.name) %>Repository: <%= kebabToPascal(config.name) %>Repository,
    private readonly isamLogger: IsamLogger,
  ) {}

  public async create<%= kebabToPascal(config.name) %>(<%= kebabToCamel(config.name) %>DTO: <%= kebabToPascal(config.name) %>CreateDTO): Promise<<%= kebabToPascal(config.name) %>> {
    const { data } = <%= kebabToCamel(config.name) %>DTO;
    const <%= kebabToCamel(config.name) %>Props = {
      data
    } as <%= kebabToPascal(config.name) %>Props;
    const <%= kebabToCamel(config.name) %>Entity = <%= kebabToPascal(config.name) %>.create(<%= kebabToCamel(config.name) %>Props);
    const result = await this.<%= kebabToCamel(config.name) %>Repository.save(<%= kebabToCamel(config.name) %>Entity);
    return result;
  }

  public async get<%= kebabToPascal(config.name) %>s(
    fetchParams: FetchParams,
  ): Promise<PaginatedResults<<%= kebabToPascal(config.name) %>>> {
    return await this.<%= kebabToCamel(config.name) %>Repository.get<%= kebabToPascal(config.name) %>s(fetchParams);
  }

  public async get<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id: Id): Promise<<%= kebabToPascal(config.name) %>> {
    const <%= kebabToCamel(config.name) %> = await this.<%= kebabToCamel(config.name) %>Repository.get<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
    if (!<%= kebabToCamel(config.name) %>) {
      throw IsamErrorEntityNotFound(<%= kebabToConstant(config.name) %>_NOT_FOUND, { <%= kebabToCamel(config.name) %>Id });
    }
    return <%= kebabToCamel(config.name) %>;
  }

  async delete<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id: Id): Promise<void> {
    await this.get<%= kebabToPascal(config.name) %>ById(<%= kebabToCamel(config.name) %>Id);
    return this.<%= kebabToCamel(config.name) %>Repository.delete(<%= kebabToCamel(config.name) %>Id);
  }

  async update<%= kebabToPascal(config.name) %>ById(
    id: Id,
    <%= kebabToCamel(config.name) %>Props: <%= kebabToPascal(config.name) %>PatchProps,
  ): Promise<<%= kebabToPascal(config.name) %>> {
    const <%= kebabToCamel(config.name) %> = await this.<%= kebabToCamel(config.name) %>Repository.get<%= kebabToPascal(config.name) %>ById(id);
    if (!<%= kebabToCamel(config.name) %>) {
      throw IsamErrorEntityNotFound(<%= kebabToConstant(config.name) %>_NOT_FOUND, { id });
    }
    const { data } = <%= kebabToCamel(config.name) %>Props;
    const updated<%= kebabToPascal(config.name) %> = <%= kebabToCamel(config.name) %>.patch({ data });
    await this.<%= kebabToCamel(config.name) %>Repository.save(updated<%= kebabToPascal(config.name) %>);
    return updated<%= kebabToPascal(config.name) %>;
  }
}
