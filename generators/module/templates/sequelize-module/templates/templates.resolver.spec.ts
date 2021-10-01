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
import { HelpMenuMap } from './help-menu.datamapper';
import { UpdateHelpMenuInput } from './help-menu.graphql';
import { HelpMenuResolver } from './help-menu.resolver';
import { HelpMenuService } from './help-menu.service';

describe('HelpMenuResolver', () => {
  let helpMenuResolver: HelpMenuResolver;
  let helpMenuService: HelpMenuService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelpMenuResolver,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: HelpMenuService,
          useValue: {
            getHelpMenuById: jest.fn(),
            createHelpMenu: jest.fn(),
            updateHelpMenuById: jest.fn(),
            deleteHelpMenuById: jest.fn(),
            getHelpMenus: jest.fn(),
          },
        },
        {
          provide: IsamLogger,
          useValue: {
            info: jest.fn(),
          },
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

    helpMenuResolver = module.get<HelpMenuResolver>(HelpMenuResolver);
    helpMenuService = module.get<HelpMenuService>(HelpMenuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(helpMenuResolver).toBeDefined();
  });

  describe('UpdateHelpMenu', () => {
    it('Update help menu', async () => {
      const expected = HelpMenuMap.toGql(helpMenuData);
      const input = {
        title: 'Help Center',
      } as UpdateHelpMenuInput;
      (helpMenuService.updateHelpMenuById as jest.Mock).mockResolvedValue(
        helpMenuData,
      );
      const response = await helpMenuResolver.updateHelpMenu(
        helpMenuData.id,
        input,
      );
      expect(helpMenuService.updateHelpMenuById).toBeCalledWith(
        helpMenuData.id,
        input,
      );
      expect(response).toEqual(expected);
    });
  });

  describe('getHelpMenuById', () => {
    it('should return GraphQL help menu by id', async () => {
      (helpMenuService.getHelpMenuById as jest.Mock).mockResolvedValue(
        helpMenuData,
      );
      const fetched = await helpMenuResolver.getHelpMenuById(helpMenuData.id);
      expect(helpMenuService.getHelpMenuById).toHaveBeenCalledWith('mock-id');
      expect(fetched).toEqual(HelpMenuMap.toGql(helpMenuData));
    });
  });

  describe('createHelpMenu', () => {
    it('should return HelpMenuGql', async () => {
      (helpMenuService.createHelpMenu as jest.Mock).mockResolvedValue(
        helpMenuData,
      );
      const fetched = await helpMenuResolver.createHelpMenu(
        helpMenuCreateProps,
      );
      expect(helpMenuService.createHelpMenu).toHaveBeenCalledWith(
        helpMenuCreateProps,
      );
      expect(fetched).toEqual(HelpMenuMap.toGql(helpMenuData));
    });
  });

  describe('DeleteHelpMenu', () => {
    it('Delete help menu', async () => {
      (helpMenuService.deleteHelpMenuById as jest.Mock).mockResolvedValue(
        undefined,
      );
      const response = await helpMenuResolver.deleteHelpMenu(helpMenuData.id);
      expect(helpMenuService.deleteHelpMenuById).toBeCalledWith(
        helpMenuData.id,
      );
      expect(response).toEqual(true);
    });
  });

  describe('getHelpMenus', () => {
    it('should return GraphQL Help Menus ', async () => {
      (helpMenuService.getHelpMenus as jest.Mock).mockResolvedValue(
        paginatedHelpMenu,
      );
      const helpMenuGqls = HelpMenuMap.toPaginateGql(paginatedHelpMenu);
      const result = await helpMenuResolver.getHelpMenus(fetchParams);
      expect(result).toEqual(helpMenuGqls);
    });
  });
});
