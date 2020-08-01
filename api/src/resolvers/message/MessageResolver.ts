import { Arg, Query, Resolver } from 'type-graphql';
import { Message, MessageModel } from '../../entities/Message';

@Resolver((_of) => Message)
export class MessageResolver {
  @Query((_returns) => Message)
  async getMessage(@Arg('key', (_type) => String) key: string): Promise<Message | null> {
    return MessageModel.findOne({ key });
  }

  @Query((_returns) => [Message])
  async getMessagesByKeys(@Arg('keys', (_type) => [String]) keys: string[]): Promise<Message[]> {
    return MessageModel.find({ key: { $in: keys } });
  }
}
