import { helpMenuData, paginatedHelpMenu } from 'test/mockData/helpMenuData';

import { HelpMenuMap } from './help-menu.datamapper';
import { HelpMenu } from './help-menu.entity';
import { HelpMenuModel } from './help-menu.model';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Help Menu Datamapper', () => {
  const helpMenuModelData = {
    primaryKey: 1,
    id: 'HLZFnYstH1X9mznA8FZW',
    title: 'Help Center',
    link: 'http://bluescape.com/help-center',
    displayOrder: 1,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  } as HelpMenuModel;

  const helpMenu = HelpMenu.create({
    title: 'Help Center',
    link: 'http://bluescape.com/help-center',
    displayOrder: 1,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  describe('toListDTO', () => {
    it('should return help menu DTO', async () => {
      const rawData = HelpMenuMap.toListDTO(helpMenu);
      expect(rawData).toMatchSnapshot();
    });
  });

  describe('toPersistence', () => {
    it('should return help menu entity to help menu Model', async () => {
      const rawData = HelpMenuMap.toPersistence(helpMenu);
      expect(rawData).toMatchSnapshot();
    });
  });

  describe('toDomain', () => {
    it('should return null', async () => {
      const entity = HelpMenuMap.toDomain(null);
      expect(entity).toBe(null);
    });
    it('should return help menu model to help menu entity', async () => {
      const entity = HelpMenuMap.toDomain(helpMenuModelData);
      expect(entity).toBeInstanceOf(HelpMenu);
      expect(entity).toMatchSnapshot();
    });
  });

  describe('toPaginatedHelpMenusDTO', () => {
    it('should return paginated Help menu DTO', async () => {
      const rawData = HelpMenuMap.toPaginatedHelpMenuDTO(paginatedHelpMenu);
      expect(rawData).toMatchSnapshot();
    });
  });

  describe('toGql', () => {
    it('should return null', async () => {
      const entity = HelpMenuMap.toGql(undefined);
      expect(entity).toBe(null);
    });
    it('should return HelpMenuGql', async () => {
      const helpMenuItem = HelpMenu.create(helpMenuModelData);
      const result = HelpMenuMap.toGql(helpMenuItem);
      expect(result).toMatchInlineSnapshot(`
        Object {
          "createdAt": Any<Date>,
          "displayOrder": 1,
          "id": "HLZFnYstH1X9mznA8FZW",
          "link": "http://bluescape.com/help-center",
          "title": "Help Center",
          "updatedAt": Any<Date>,
        }
      `);
    });
  });

  describe('toPaginateGql', () => {
    it('should return paginated templates Gql', async () => {
      const rawData = HelpMenuMap.toPaginateGql(paginatedHelpMenu);
      expect(rawData).toMatchSnapshot();
    });
  });
});
