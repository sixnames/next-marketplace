import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { NavItem } from '../../entities/NavItem';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';

@Resolver((_for) => NavItem)
export class NavItemResolver {
  @FieldResolver()
  async nameString(
    @Root() navItem: DocumentType<NavItem>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(navItem.name, ctx.req.lang);
  }
}
