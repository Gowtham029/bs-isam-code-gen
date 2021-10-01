import { Test, TestingModule } from '@nestjs/testing';
import { fetchParams } from 'test/mockData';
import { paginatedHelpMenu } from 'test/mockData/helpMenuData';

import {
  IsamErrorEntityNotFound,
  IsamErrorInvalidParameter,
} from '../../../common/isam-errors';
import { AppConfigModule } from '../../../common/modules/app-config';
import { IsamLoggerModule } from '../../../common/modules/isam-logger.module';
import { IsamLogger } from '../../../common/providers';
import { HelpMenuCreateDTO } from './dtos/help-menu-create.dto';
import {
  DISPLAY_ORDER_SHOULD_BE_NUMBER,
  HELP_MENU_ALREADY_EXISTS,
  HELP_MENU_NOT_FOUND,
  TITLE_CANNOT_BE_EMPTY,
} from './help-menu.constants';
import { HelpMenu, HelpMenuPatchProps } from './help-menu.entity';
import { HelpMenuRepository } from './help-menu.repository';
import { HelpMenuService } from './templates.service';

const title = 'Help Center';
const link = 'http://bluescape.com/help-center';
const helpMenu: HelpMenuCreateDTO = {
  title,
  link,
  displayOrder: 1,
};

const newHelpMenu = HelpMenu.create({
  title,
  link,
  displayOrder: 1,
});

const helpMenuData = HelpMenu.create(
  {
    title,
    link,
    displayOrder: 1,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  },
  ['mock-id', 1],
);

describe('HelpMenuService', () => {
  let helpMenuService: HelpMenuService;
  let helpMenuRepo;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, IsamLoggerModule],
      providers: [
        HelpMenuService,
        {
          provide: HelpMenuRepository,
          useValue: {
            save: jest.fn(),
            getHelpMenuByTitle: jest.fn(),
            getLastInsertedId: jest.fn(),
            getHelpMenus: jest.fn(),
            getHelpMenuById: jest.fn(),
            delete: jest.fn(),
            getMaxDisplayOrder: jest.fn(),
            updateDisplayOrder: jest.fn(),
            isHelpMenuExistsByTitleAndId: jest.fn(),
          },
        },
        {
          provide: IsamLogger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    helpMenuService = module.get<HelpMenuService>(HelpMenuService);
    helpMenuRepo = module.get<HelpMenuRepository>(HelpMenuRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createHelpMenu', () => {
    beforeEach(() => {
      helpMenuRepo.getHelpMenuByTitle.mockResolvedValue(null);
      helpMenuRepo.save.mockResolvedValue(helpMenuData);
    });
    it('Should create new help menu', async () => {
      const result = await helpMenuService.createHelpMenu(helpMenu);
      expect(helpMenuRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(HelpMenu);
      expect(result.isPersisted).toBe(true);
    });

    it('Should assign help menu displayOrder as 1', async () => {
      delete helpMenu.displayOrder;
      helpMenuRepo.getMaxDisplayOrder.mockResolvedValue(null);
      helpMenuRepo.save.mockResolvedValue(helpMenuData);
      const result = await helpMenuService.createHelpMenu(helpMenu);
      expect(result).toEqual(helpMenuData);
    });

    it('Should assign help menu displayOrder with incremental value of maximum display order', async () => {
      helpMenuRepo.getHelpMenuByTitle.mockResolvedValue(null);
      delete helpMenu.displayOrder;
      helpMenuRepo.getMaxDisplayOrder.mockResolvedValue(0);
      const result = await helpMenuService.createHelpMenu(helpMenu);
      expect(result).toEqual(helpMenuData);
    });
    it(`Should throw ${DISPLAY_ORDER_SHOULD_BE_NUMBER}`, async () => {
      try {
        helpMenuRepo.getHelpMenuByTitle.mockResolvedValue(null);
        helpMenu.displayOrder = null;
        helpMenuRepo.getMaxDisplayOrder.mockResolvedValue(0);
        await helpMenuService.createHelpMenu(helpMenu);
      } catch (error) {
        expect(error).toEqual(
          IsamErrorInvalidParameter(DISPLAY_ORDER_SHOULD_BE_NUMBER),
        );
      }
    });
    it(`Should throw ${HELP_MENU_ALREADY_EXISTS}`, async () => {
      try {
        helpMenuRepo.getHelpMenuByTitle.mockResolvedValue(helpMenuData);
        helpMenuRepo.getMaxDisplayOrder.mockResolvedValue(0);
        helpMenu.displayOrder = 1;
        await helpMenuService.createHelpMenu(helpMenu);
      } catch (error) {
        expect(error).toEqual(
          IsamErrorInvalidParameter(HELP_MENU_ALREADY_EXISTS),
        );
      }
    });
    it(`Should call update display order`, async () => {
      await helpMenuService.createHelpMenu(helpMenu);
      expect(helpMenuRepo.save).toBeCalledWith(newHelpMenu);
      expect(helpMenuRepo.updateDisplayOrder).toBeCalledWith(
        helpMenuData.id,
        null, // there is no prev order value forr new help menu
        helpMenu.displayOrder,
      );
    });
    it(`Shouldn't call updateDisplayOrder because displayOrder not in input props.`, async () => {
      delete helpMenu.displayOrder;
      await helpMenuService.createHelpMenu(helpMenu);
      expect(helpMenuRepo.save).toBeCalledWith(newHelpMenu);
      expect(helpMenuRepo.updateDisplayOrder).not.toBeCalled();
    });
  });

  describe('getHelpMenus', () => {
    it('should get all help menu from repository', async () => {
      helpMenuRepo.getHelpMenus.mockResolvedValue(paginatedHelpMenu);
      const result = await helpMenuService.getHelpMenus(fetchParams);
      expect(helpMenuRepo.getHelpMenus).toHaveBeenCalledWith(fetchParams);
      expect(result).toEqual(paginatedHelpMenu);
    });
  });

  describe('getHelpMenuById', () => {
    const helpMenuId = 'wUkYbsSKDp-9IFy0yT3G';
    it('should return help menu', async () => {
      helpMenuRepo.getHelpMenuById.mockResolvedValue(helpMenuData);
      const fetched = await helpMenuService.getHelpMenuById(helpMenuData.id);

      expect(helpMenuRepo.getHelpMenuById).toHaveBeenCalledTimes(1);
      expect(fetched).toEqual(helpMenuData);
    });
    it(`Should throw helpmenu not found`, async () => {
      try {
        helpMenuRepo.getHelpMenuById.mockResolvedValue(null);
        await helpMenuService.getHelpMenuById(helpMenuId);
      } catch (error) {
        expect(error).toEqual(
          IsamErrorEntityNotFound(HELP_MENU_NOT_FOUND, { helpMenuId }),
        );
      }
    });
  });

  describe('updateHelpMenuById', () => {
    const request = (props?: HelpMenuPatchProps) =>
      ({
        title,
        displayOrder: 1,
        link,
        ...props,
      } as HelpMenuPatchProps);
    beforeEach(() => {
      helpMenuRepo.getHelpMenuById.mockResolvedValue(helpMenuData);
      helpMenuRepo.save.mockResolvedValue(helpMenuData);
      helpMenuRepo.isHelpMenuExistsByTitleAndId.mockResolvedValue(false);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it(`should throw ${HELP_MENU_NOT_FOUND}`, async () => {
      try {
        helpMenuRepo.getHelpMenuById.mockResolvedValueOnce(null);
        await helpMenuService.updateHelpMenuById(helpMenuData.id, request());
      } catch (error) {
        expect(helpMenuRepo.getHelpMenuById).toHaveBeenCalledTimes(1);
        expect(error).toEqual(
          IsamErrorEntityNotFound(HELP_MENU_NOT_FOUND, {
            id: helpMenuData.id,
          }),
        );
      }
    });
    it(`Should throw ${TITLE_CANNOT_BE_EMPTY}`, async () => {
      try {
        await helpMenuService.updateHelpMenuById(
          helpMenuData.id,
          request({ title: null }),
        );
      } catch (error) {
        expect(error).toEqual(
          IsamErrorInvalidParameter(TITLE_CANNOT_BE_EMPTY, { title }),
        );
      }
    });
    it(`Should throw ${HELP_MENU_ALREADY_EXISTS}`, async () => {
      try {
        helpMenuRepo.isHelpMenuExistsByTitleAndId.mockResolvedValueOnce(true);
        await helpMenuService.updateHelpMenuById(
          helpMenuData.id,
          request({ title: 'Help Center' }),
        );
      } catch (error) {
        expect(error).toEqual(
          IsamErrorInvalidParameter(HELP_MENU_ALREADY_EXISTS, { title }),
        );
      }
    });
    it(`Should throw ${DISPLAY_ORDER_SHOULD_BE_NUMBER}`, async () => {
      try {
        await helpMenuService.updateHelpMenuById(
          helpMenuData.id,
          request({ displayOrder: null }),
        );
      } catch (error) {
        expect(error).toEqual(
          IsamErrorInvalidParameter(DISPLAY_ORDER_SHOULD_BE_NUMBER),
        );
      }
    });
    it(`Should call update display order`, async () => {
      const req = request({ displayOrder: 1 });
      const result = await helpMenuService.updateHelpMenuById(
        helpMenuData.id,
        req,
      );
      expect(helpMenuRepo.save).toBeCalledWith(helpMenuData);
      expect(helpMenuRepo.isHelpMenuExistsByTitleAndId).toBeCalledWith(
        req.title,
        helpMenuData.id,
      );
      expect(helpMenuRepo.updateDisplayOrder).toBeCalledWith(
        helpMenuData.id,
        helpMenuData.displayOrder,
        req.displayOrder,
      );
      expect(result).toBeInstanceOf(HelpMenu);
    });
    it(`Shouldn't call updateDisplayOrder because displayOrder not in input props.`, async () => {
      const req = request();
      delete req.displayOrder;
      const result = await helpMenuService.updateHelpMenuById(
        helpMenuData.id,
        req,
      );
      expect(helpMenuRepo.save).toBeCalledWith(helpMenuData);
      expect(helpMenuRepo.isHelpMenuExistsByTitleAndId).toBeCalledWith(
        req.title,
        helpMenuData.id,
      );
      expect(helpMenuRepo.updateDisplayOrder).not.toBeCalled();
      expect(result).toBeInstanceOf(HelpMenu);
    });
  });

  describe('deleteHelpMenuById', () => {
    it('should delete helpMenu', async () => {
      helpMenuRepo.getHelpMenuById.mockResolvedValue(helpMenuData);
      await helpMenuService.deleteHelpMenuById(helpMenuData.id);
      expect(helpMenuRepo.delete).toHaveBeenCalledWith(helpMenuData.id);
    });
  });
});
