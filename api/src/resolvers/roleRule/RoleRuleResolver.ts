import { FieldResolver, Resolver, Root } from 'type-graphql';
import { RoleRule, RoleRuleOperation, RoleRuleOperationModel } from '../../entities/RoleRule';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => RoleRule)
export class RoleRuleResolver {
  @FieldResolver((_) => [RoleRuleOperation])
  async operations(@Root() roleRule: DocumentType<RoleRule>): Promise<RoleRuleOperation[]> {
    return RoleRuleOperationModel.find({ _id: { $in: roleRule.operations } });
  }
}
