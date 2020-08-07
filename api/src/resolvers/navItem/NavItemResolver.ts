import { FieldResolver, Resolver, Root } from 'type-graphql';
import { NavItem, NavItemModel } from '../../entities/NavItem';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => NavItem)
export class NavItemResolver {
  @FieldResolver()
  async children(@Root() navItem: DocumentType<NavItem>): Promise<NavItem[]> {
    return NavItemModel.find({
      parent: navItem.id,
    });
  }
}
