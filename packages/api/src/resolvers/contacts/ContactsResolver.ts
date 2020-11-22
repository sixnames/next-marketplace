import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Contacts } from '../../entities/Contacts';
import { FormattedPhone } from '../../entities/FormattedPhone';
import { phoneToRaw, phoneToReadable } from '@yagu/shared';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => Contacts)
export class ContactsResolver {
  @FieldResolver((_returns) => [FormattedPhone])
  async formattedPhones(@Root() contacts: DocumentType<Contacts>): Promise<FormattedPhone[]> {
    const { phones } = contacts;
    return phones.map((phone) => {
      return {
        raw: phoneToRaw(phone),
        readable: phoneToReadable(phone),
      };
    });
  }
}
