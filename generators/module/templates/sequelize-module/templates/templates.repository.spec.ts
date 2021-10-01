import { mockIsamLogger } from 'test/common';
import { fetchParams } from 'test/mockData';
import {
  helpMenuCreateProps,
  helpMenuData,
  mockHelpMenuModel,
} from 'test/mockData/helpMenuData';

import { SequelizeTester } from '../../../../test/utils';
import * as utils from '../../../common/utils/utils';
import { HelpMenuMap } from './help-menu.datamapper';
import { HelpMenu } from './help-menu.entity';
import { HelpMenuModel } from './help-menu.model';
import { HelpMenuRepository, ScopeHelpMenu } from './help-menu.repository';

const mockHelpMenuUid = 'mock-user-id';
describe('HelpMenuRepository', () => {
  let repo: HelpMenuRepository;
  const modelTester = new SequelizeTester();
  const modelsToMock = [HelpMenuModel];
  const [helpMenuModel] = modelTester.mockModels(modelsToMock);

  beforeEach(() => {
    repo = new HelpMenuRepository(helpMenuModel);
    // IsamLogger is injected outside the repo's constructor in RepositoryBase
    (repo as any).logger = mockIsamLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('to be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should add Scopes to the model', () => {
    modelTester.verifyAddScopes(helpMenuModel, ScopeHelpMenu);
  });

  describe('getHelpMenuByTitle', () => {
    it('should fetch helpMenu by Title', async () => {
      await repo.getHelpMenuByTitle(helpMenuCreateProps.title);
      modelTester.verifyModelFunction(helpMenuModel, 'findOne');
    });
  });

  describe('save', () => {
    it('should create new HelpMenu', async () => {
      const newMenu = HelpMenu.create({
        title: 'Help Center',
        link: 'http://bluescape.com/help-center',
        displayOrder: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      jest.spyOn(utils, 'genId').mockResolvedValue(mockHelpMenuUid);
      jest
        .spyOn(HelpMenuMap, 'toPersistence')
        .mockReturnValue(mockHelpMenuModel);
      await repo.save(newMenu);
      modelTester.verifyModelFunction(helpMenuModel, 'create');
      expect(utils.genId).toBeCalled();
      expect(HelpMenuMap.toPersistence).toBeCalledWith(newMenu);
    });
    it('should update HelpMenu', async () => {
      jest
        .spyOn(HelpMenuMap, 'toPersistence')
        .mockReturnValue(mockHelpMenuModel);
      await repo.save(helpMenuData);
      modelTester.verifyModelFunction(helpMenuModel, 'update');
      expect(HelpMenuMap.toPersistence).toBeCalledWith(helpMenuData);
    });
  });

  describe('getHelpMenus', () => {
    it('should get paginated help menu', async () => {
      await repo.getHelpMenus(fetchParams, ScopeHelpMenu.Default);
      modelTester.verifyModelFunction(helpMenuModel, 'findAll');
    });
  });

  describe('getHelpMenuById', () => {
    it('should get HelpMenu', async () => {
      await repo.getHelpMenuById(helpMenuData.id);
      modelTester.verifyModelFunction(helpMenuModel, 'findOne');
    });
  });

  describe('delete', () => {
    it('should delete helpmenu', async () => {
      await repo.delete(helpMenuData.id);
      modelTester.verifyModelFunction(helpMenuModel, 'destroy');
    });
  });

  describe('getMaxDisplayOrder', () => {
    it('should get maximum value of dispalyOrder', async () => {
      await repo.getMaxDisplayOrder();
      expect(helpMenuModel.max).toBeCalledTimes(1);
      expect(helpMenuModel.max.mock.calls[0][0]).toMatchInlineSnapshot(
        `"displayOrder"`,
      );
    });
  });
  describe('isHelpMenuExistsByTitleAndId', () => {
    it('should return boolean true when given title and except given id are matched', async () => {
      helpMenuModel.count.mockResolvedValue(1);
      const response = await repo.isHelpMenuExistsByTitleAndId(
        'Help Menu',
        'menu-id',
      );
      modelTester.verifyModelFunction(helpMenuModel, 'count');
      expect(response).toBe(true);
    });
    it('should return boolean false when given title and except given id are not matched', async () => {
      helpMenuModel.count.mockResolvedValue(0);
      const response = await repo.isHelpMenuExistsByTitleAndId(
        'Help Menu',
        'menu-id',
      );
      expect(helpMenuModel.count).toBeCalled();
      expect(helpMenuModel.count.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "where": Object {
            "id": Object {
              Symbol(ne): "menu-id",
            },
            "title": "Help Menu",
          },
        }
      `);
      expect(response).toBe(false);
    });
  });
  describe('updateDisplayOrder', () => {
    it('should prev orer as dispalay order', async () => {
      await repo.updateDisplayOrder('menu-id', 2, 1);
      modelTester.verifyModelFunction(helpMenuModel, 'update');
      expect(helpMenuModel.update.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "displayOrder": 2,
          },
          Object {
            "where": Object {
              "displayOrder": 1,
              "id": Object {
                Symbol(ne): "menu-id",
              },
            },
          },
        ]
      `);
    });
    it('should set maximum order+1 when prev order is null', async () => {
      helpMenuModel.max.mockResolvedValue(0);
      await repo.updateDisplayOrder('menu-id', null, 2);
      modelTester.verifyModelFunction(helpMenuModel, 'update');
      expect(helpMenuModel.update.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "displayOrder": 1,
          },
          Object {
            "where": Object {
              "displayOrder": 2,
              "id": Object {
                Symbol(ne): "menu-id",
              },
            },
          },
        ]
      `);
    });
  });
});
