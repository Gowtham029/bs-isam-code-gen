import { Test, TestingModule } from '@nestjs/testing';
import { fetchParams } from 'test/mockData';
import {
  helpMenuCreateProps,
  helpMenuData,
  paginatedHelpMenu,
} from 'test/mockData/helpMenuData';

import { AppConfigService } from '../../../common/modules/app-config';
import { CursorProvider } from '../../../common/modules/cursor/cursor.provider';
import { IsamLogger } from '../../../common/providers';
import { AuthService } from '../../../identity';
import { HelpMenuDTO } from './dtos/help-menu.dto';
import { HelpMenuController } from './help-menu.controller';
import { HelpMenuMap } from './help-menu.datamapper';
import { HelpMenu, HelpMenuPatchProps } from './help-menu.entity';
import { HelpMenuService } from './help-menu.service';

describe('HelpMenu Controller', () => {
  let controller: HelpMenuController;
  let helpMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpMenuController],
      providers: [
        {
          provide: HelpMenuService,
          useValue: {
            createHelpMenu: jest.fn(),
            getHelpMenus: jest.fn(),
            getHelpMenuById: jest.fn(),
            deleteHelpMenuById: jest.fn(),
            updateHelpMenuById: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: IsamLogger,
          useValue: {},
        },
        {
          provide: AppConfigService,
          useValue: {},
        },
        {
          provide: CursorProvider,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HelpMenuController>(HelpMenuController);
    helpMenuService = module.get<HelpMenuService>(HelpMenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createHelpMenu', () => {
    it('should call the service', async () => {
      helpMenuService.createHelpMenu.mockResolvedValue(helpMenuData);
      await controller.createHelpMenu(helpMenuCreateProps);
      expect(helpMenuService.createHelpMenu).toHaveBeenCalledWith(
        helpMenuCreateProps,
      );
    });
  });

  describe('getHelpMenus', () => {
    it('should call the getHelpMenus', async () => {
      (helpMenuService.getHelpMenus as jest.Mock).mockResolvedValue(
        paginatedHelpMenu,
      );
      const cursor = null;
      const { pagination, orderBy, filterBy } = fetchParams;
      const result = await controller.getHelpMenus(
        cursor,
        pagination,
        orderBy,
        filterBy,
      );
      expect(helpMenuService.getHelpMenus).toHaveBeenCalledWith(fetchParams);
      expect(result).toEqual(
        HelpMenuMap.toPaginatedHelpMenuDTO(paginatedHelpMenu),
      );
    });
  });

  describe('GET /helpMenus/:helpMenuId', () => {
    it('should return get helpMenu by id', async () => {
      helpMenuService.getHelpMenuById.mockResolvedValue(helpMenuData);
      const helpMenuDTO: HelpMenuDTO = HelpMenuMap.toListDTO(helpMenuData);
      const fetchedMenu = await controller.getHelpMenuById(helpMenuData.id);
      expect(helpMenuService.getHelpMenuById).toHaveBeenCalledTimes(1);
      expect(fetchedMenu).toEqual(helpMenuDTO);
    });
  });

  describe('deleteHelpMenu', () => {
    it('should delete helpMenu', async () => {
      await controller.deleteHelpMenu(helpMenuData.id);
      expect(helpMenuService.deleteHelpMenuById).toHaveBeenCalledWith(
        helpMenuData.id,
      );
    });
  });

  describe('PATCH /helpMenus/:helpMenuId', () => {
    it('should return updated helpMenu', async () => {
      helpMenuService.updateHelpMenuById.mockResolvedValue(
        helpMenuData as HelpMenu,
      );
      const updatedHelpMenu = await controller.updateHelpMenu(
        helpMenuData.id,
        helpMenuCreateProps as HelpMenuPatchProps,
      );
      expect(helpMenuService.updateHelpMenuById).toHaveBeenCalledWith(
        helpMenuData.id,
        helpMenuCreateProps,
      );
      expect(updatedHelpMenu).not.toEqual(null);
    });
  });
});
