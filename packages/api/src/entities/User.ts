import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import mongoosePaginate from 'mongoose-paginate-v2';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { Role } from './Role';
import { AutoIncrementID } from '@typegoose/auto-increment';
import getApiMessage from '../utils/translations/getApiMessage';
import { compare } from 'bcryptjs';
import { ContextInterface } from '../types/context';

type Request = ContextInterface['req'];

@ObjectType()
@index({ '$**': 'text' })
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class User extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  name: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  lastName?: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  secondName?: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  email: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  phone: string;

  @prop({ required: true, trim: true })
  password: string;

  @Field((_type) => Role)
  @prop({ ref: Role })
  role: string;

  @Field((_type) => String)
  readonly fullName: string;

  @Field((_type) => String)
  readonly shortName: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<User>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<User>>;

  static signedIn(req: Request) {
    return req.session && req.session.userId;
  }

  static ensureSignedOut(req: Request) {
    return !this.signedIn(req);
  }

  static async attemptSignIn(email: User['email'], password: User['password'], lang: string) {
    const emailErrorMessage = await getApiMessage({ key: `users.signIn.emailError`, lang });
    const passwordErrorMessage = await getApiMessage({ key: `users.signIn.passwordError`, lang });

    const user = await UserModel.findOne({ email });

    if (!user) {
      return {
        user: null,
        message: emailErrorMessage,
      };
    }

    const matches = await compare(password, user.password);

    if (!matches) {
      return {
        user: null,
        message: passwordErrorMessage,
      };
    }

    return {
      user,
      message: await getApiMessage({ key: `users.signIn.success`, lang }),
    };
  }

  static async attemptSignOut(req: Request) {
    return new Promise((resolve) => {
      if (req.session && req.session.destroy) {
        req.session.destroy((error) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  }
}

export const UserModel = getModelForClass(User);
