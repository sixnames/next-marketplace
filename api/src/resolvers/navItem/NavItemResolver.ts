import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { NavItem, NavItemModel } from '../../entities/NavItem';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';
import { AuthCheckerConfigInterface } from '../../utils/auth/customAuthChecker';
import { OPERATION_TARGET_OPERATION, OPERATION_TYPE_READ, ROUTE_APP_NAV_GROUP } from '../../config';

@Resolver((_for) => NavItem)
export class NavItemResolver {
  @Authorized<AuthCheckerConfigInterface>([
    {
      operationType: OPERATION_TYPE_READ,
      entity: 'NavItem',
      target: OPERATION_TARGET_OPERATION,
    },
  ])
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
