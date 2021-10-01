import { getModuleDefinition } from 'test/utils';

import { HelpMenuModule } from './help-menu.module';

describe('HelpMenuModule', () => {
  it('matches snapshot', () => {
    const module = getModuleDefinition(HelpMenuModule);
    expect(module).toMatchInlineSnapshot(`
      Object {
        "controllers": Array [
          [Function HelpMenuController],
        ],
        "exports": Array [
          [Function HelpMenuService],
        ],
        "imports": Array [
          Object {
            "exports": Array [
              Object {
                "inject": Array [
                  [Function Sequelize],
                ],
                "provide": "HelpMenuModelRepository",
                "useFactory": [Function useFactory],
              },
            ],
            "module": [Function SequelizeModule],
            "providers": Array [
              Object {
                "inject": Array [
                  [Function Sequelize],
                ],
                "provide": "HelpMenuModelRepository",
                "useFactory": [Function useFactory],
              },
            ],
          },
        ],
        "providers": Array [
          [Function HelpMenuRepository],
          [Function HelpMenuService],
          [Function HelpMenuResolver],
        ],
      }
    `);
  });
});
