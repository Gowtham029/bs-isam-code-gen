import { Entity, proxyEntity } from '../../../common/domain/Entity';
import { IsamErrorInvalidParameter } from '../../../common/isam-errors';
import { IdPrimaryKeyPair } from '../../../common/types';

export interface <%= kebabToPascal(config.name) %>Props {
  // R/W - Mutations
 
  // R/O - Queries
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface <%= kebabToPascal(config.name) %>CreateProps {
  // R/W - Mutations
}

export interface <%= kebabToPascal(config.name) %>PatchProps {
}

export class <%= kebabToPascal(config.name) %> extends Entity<<%= kebabToPascal(config.name) %>Props> {
  private constructor(props: <%= kebabToPascal(config.name) %>Props, idPrimaryKey?: IdPrimaryKeyPair) {
    super(props, idPrimaryKey);
  }

  static create(
    props: <%= kebabToPascal(config.name) %>Props,
    idPrimaryKey?: IdPrimaryKeyPair,
  ): <%= kebabToPascal(config.name) %> {
    return proxyEntity(new <%= kebabToPascal(config.name) %>(props, idPrimaryKey));
  }
}
