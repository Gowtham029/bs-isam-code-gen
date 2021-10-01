import { DataMapper, modelExists } from '../../../common/domain/DataMapper';
import { PaginatedResults } from '../../../common/domain/Repository';
import { valueExists } from '../../../common/utils';
import { <%= kebabToPascal(config.name) %>ListDTO } from './dtos/<%= (config.name) %>-list.dto';
import { <%= kebabToPascal(config.name) %>DTO } from './dtos/<%= (config.name) %>.dto';
import { <%= kebabToPascal(config.name) %> } from './<%= (config.name) %>s.entity';
import { <%= kebabToPascal(config.name) %>Gql, <%= kebabToPascal(config.name) %>PagedGql } from './<%= (config.name) %>s.graphql';
import { <%= kebabToPascal(config.name) %>Model } from './<%= (config.name) %>s.model';

export class <%= kebabToPascal(config.name) %>Map extends DataMapper {
  static toDomain(model: <%= kebabToPascal(config.name) %>Model): <%= kebabToPascal(config.name) %> {
    if (!modelExists(model)) {
      return null;
    }

    const {
      primaryKey,
      id,
      createdAt,
      updatedAt,
      deletedAt,
    } = model;

    const projectedProps = {
      primaryKey,
      id,
      createdAt,
      updatedAt,
      deletedAt,
    };
    return <%= kebabToPascal(config.name) %>.create(projectedProps, [id, primaryKey]);
  }

  static toPersistence(entity: <%= kebabToPascal(config.name) %>): <%= kebabToPascal(config.name) %>Model {
    const { createdAt, updatedAt } = entity.props;

    const raw = {
      createdAt,
      updatedAt,
    };

    return raw as <%= kebabToPascal(config.name) %>Model;
  }

  static toListDTO(entity: <%= kebabToPascal(config.name) %>): <%= kebabToPascal(config.name) %>DTO {
    const { createdAt, updatedAt } = entity.props;

    return {
      id: entity.id,
      createdAt,
      updatedAt,
    };
  }

  static toPaginated<%= kebabToPascal(config.name) %>DTO(
    pgdResults: PaginatedResults<<%= kebabToPascal(config.name) %>>,
  ): <%= kebabToPascal(config.name) %>ListDTO {
    const { results, ...pagination } = pgdResults;

    const <%= kebabToCamel(config.name) %>s = results.map((<%= kebabToCamel(config.name) %>) =>
      <%= kebabToPascal(config.name) %>Map.toListDTO(<%= kebabToCamel(config.name) %>),
    );
    return {
      <%= kebabToCamel(config.name) %>s,
      ...pagination,
    };
  }

  static toGql(entity: <%= kebabToPascal(config.name) %>): <%= kebabToPascal(config.name) %>Gql {
    if (!valueExists(entity)) {
      return null;
    }

    const { createdAt, updatedAt } = entity;

    return {
      id: entity.id,
      createdAt,
      updatedAt,
    } as <%= kebabToPascal(config.name) %>Gql;
  }

  static toPaginateGql(paged: PaginatedResults<<%= kebabToPascal(config.name) %>>): <%= kebabToPascal(config.name) %>PagedGql {
    const { results, ...pagination } = paged;

    const <%= kebabToCamel(config.name) %>s = results.map(<%= kebabToPascal(config.name) %>Map.toGql);
    return {
      results: <%= kebabToCamel(config.name) %>s,
      ...pagination,
    };
  }
}
