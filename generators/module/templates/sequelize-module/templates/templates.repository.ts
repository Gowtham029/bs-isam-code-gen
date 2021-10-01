import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import {
  PaginatedResults,
  RepositoryBase,
  ScopeNameValueTuple,
} from '../../../common/domain/Repository';
import { FetchParams } from '../../../common/params';
import { Id } from '../../../common/types';
import { genId } from '../../../common/utils';
import { <%= kebabToPascal(config.name) %>Map } from './<%= (config.name) %>s.datamapper';
import { <%= kebabToPascal(config.name) %> } from './<%= (config.name) %>s.entity';
import { <%= kebabToPascal(config.name) %>Model } from './<%= (config.name) %>s.model';

export enum Scope<%= kebabToPascal(config.name) %> {
  Default,
}

const scopes: ScopeNameValueTuple[] = [
  [Scope<%= kebabToPascal(config.name) %>[Scope<%= kebabToPascal(config.name) %>.Default], {}],
];

@Injectable()
export class <%= kebabToPascal(config.name) %>Repository extends RepositoryBase<
  <%= kebabToPascal(config.name) %>,
  <%= kebabToPascal(config.name) %>Model
> {
  constructor(
    @InjectModel(<%= kebabToPascal(config.name) %>Model)
    private readonly <%= kebabToCamel(config.name) %>Model: typeof <%= kebabToPascal(config.name) %>Model,
  ) {
    super(<%= kebabToPascal(config.name) %>Model, <%= kebabToPascal(config.name) %>Map);
    this.addScopes(scopes);
  }

  public async save(<%= kebabToCamel(config.name) %>Entity: <%= kebabToPascal(config.name) %>): Promise<<%= kebabToPascal(config.name) %>> {
    const isPersisted = <%= kebabToCamel(config.name) %>Entity.isPersisted;
    let rawData = null;
    let <%= kebabToCamel(config.name) %>Props = null;
    rawData = <%= kebabToPascal(config.name) %>Map.toPersistence(<%= kebabToCamel(config.name) %>Entity);
    if (isPersisted) {
      <%= kebabToCamel(config.name) %>Props = await this.<%= kebabToCamel(config.name) %>Model.update(rawData, { where: { id: <%= kebabToCamel(config.name) %>Entity.id } });
    } else {
      rawData.id = await genId();
      <%= kebabToCamel(config.name) %>Props = await this.<%= kebabToCamel(config.name) %>Model.create(rawData);
    }
    return <%= kebabToPascal(config.name) %>Map.toDomain(<%= kebabToCamel(config.name) %>Props);
  }

  async get<%= kebabToPascal(config.name) %>s(
    fetchParams: FetchParams,
    scope = Scope<%= kebabToPascal(config.name) %>.Default,
  ): Promise<PaginatedResults<<%= kebabToPascal(config.name) %>>> {
    const scopeString = Scope<%= kebabToPascal(config.name) %>[scope];
    return super.getAllPaginated(fetchParams, scopeString);
  }

  async get<%= kebabToPascal(config.name) %>ById(
    id: Id,
    scope = Scope<%= kebabToPascal(config.name) %>.Default,
  ): Promise<<%= kebabToPascal(config.name) %>> {
    const modelInstance = await this.<%= kebabToCamel(config.name) %>Model
      .scope(Scope<%= kebabToPascal(config.name) %>[scope])
      .findOne({
        where: { id },
      });
    return <%= kebabToPascal(config.name) %>Map.toDomain(modelInstance);
  }

  async delete(<%= kebabToCamel(config.name) %>Id: Id): Promise<void> {
    await this.<%= kebabToCamel(config.name) %>Model.destroy({
      where: {
        id: <%= kebabToCamel(config.name) %>Id,
      },
      force: true,
    });
  }
}
