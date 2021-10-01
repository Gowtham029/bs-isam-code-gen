import { PaginationDTO } from '../../../../common/dto/pagination.dto';
import { <%= kebabToPascal(config.name) %>DTO } from './<%= (config.name) %>.dto';

export class <%= kebabToPascal(config.name) %>ListDTO extends PaginationDTO {
  <%= kebabToCamel(config.name) %>s: <%= kebabToPascal(config.name) %>DTO[];
}
