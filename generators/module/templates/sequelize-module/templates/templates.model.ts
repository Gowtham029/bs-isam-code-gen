import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { INT_TYPE_CONFIG } from '../../../access-management/access-management.constants';
import { ID_LENGTH } from '../../../common/constants';
import { Id, PrimaryKey } from '../../../common/types';

@Table({
  tableName: '<%= kebabToLowerSnakeCase(config.name) %>',
  timestamps: true,
  paranoid: true,
})
export class <%= kebabToPascal(config.name) %>Model extends Model<<%= kebabToPascal(config.name) %>Model> {
  @Column({
    field: 'id',
    type: DataType.INTEGER(INT_TYPE_CONFIG),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  primaryKey: PrimaryKey;

  @Column({
    field: 'uid',
    type: DataType.CHAR(ID_LENGTH),
    unique: true,
    allowNull: false,
  })
  id: Id;

  @Column({
    field: 'created_at',
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    allowNull: false,
  })
  updatedAt: Date;

  @Column({
    field: 'deleted_at',
    allowNull: true,
    defaultValue: null,
  })
  deletedAt?: Date;
}
