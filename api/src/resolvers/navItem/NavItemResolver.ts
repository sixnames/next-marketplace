import { Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { NavItem, NavItemModel } from '../../entities/NavItem';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';
import { OPERATION_TYPE_READ, ROUTE_APP_NAV_GROUP } from '../../config';
import { AuthMethod } from '../../decorators/methodDecorators';

@Resolver((_for) => NavItem)
export class NavItemResolver {
  @AuthMethod({
    operationType: OPERATION_TYPE_READ,
    entity: 'NavItem',
  })
  @Query(() => [NavItem])
  async getAllAppNavItems(): Promise<NavItem[]> {
    return NavItemModel.find({
      parent: null,
      navGroup: ROUTE_APP_NAV_GROUP,
    })
      .sort({ order: 1 })
      .populate({
        path: 'children',
        model: NavItemModel,
        options: { sort: { order: 1 } },
        match: {
          navGroup: ROUTE_APP_NAV_GROUP,
        },
      });
  }

  @FieldResolver()
  async nameString(
    @Root() navItem: DocumentType<NavItem>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(navItem.name, ctx.req.lang);
  }
}