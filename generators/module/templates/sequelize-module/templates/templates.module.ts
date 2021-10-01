import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BaseModule } from '../../../common/BaseModule';
import { <%= kebabToPascal(config.name) %>Controller } from './<%= (config.name) %>.controller';
import { <%= kebabToPascal(config.name) %>Model } from './<%= (config.name) %>s.model';
import { <%= kebabToPascal(config.name) %>Repository } from './<%= (config.name) %>s.repository';
import { <%= kebabToPascal(config.name) %>Resolver } from './<%= (config.name) %>s.resolver';
import { <%= kebabToPascal(config.name) %>Service } from './<%= (config.name) %>s.service';

@Module({
  imports: [SequelizeModule.forFeature([<%= kebabToPascal(config.name) %>Model])],
  controllers: [<%= kebabToPascal(config.name) %>Controller],
  providers: [<%= kebabToPascal(config.name) %>Repository, <%= kebabToPascal(config.name) %>Service, <%= kebabToPascal(config.name) %>Resolver],
  exports: [<%= kebabToPascal(config.name) %>Service],
})
export class <%= kebabToPascal(config.name) %>Module extends BaseModule {}
