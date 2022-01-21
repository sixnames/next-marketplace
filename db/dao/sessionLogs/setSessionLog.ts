import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';
import { getDomain } from 'tldts';
import { ONE_DAY, SESSION_COOKIE_KEY } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from '../../../lib/sessionHelpers';
import { IpInfoInterface } from '../../../types/clientTypes';
import { COL_SESSION_LOGS } from '../../collectionNames';
import {
  ObjectIdModel,
  SessionLogEventModel,
  SessionLogModel,
  SessionLogPayloadModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface SessionLogMakeAnOrderProductEventInputModel {
  summaryId: string;
  shopProductId: string;
  shopId: string;
  amount: number;
}

export interface SessionLogMakeAnOrderEventInputModel {
  variant: 'makeAnOrderClick';
  asPath: string;
  orderProducts: SessionLogMakeAnOrderProductEventInputModel[];
}

export interface SessionLogAddToCartEventInputModel {
  variant: 'addToCartClick';
  asPath: string;
  productId: string;
}

export interface SessionNavLogEventInputModel {
  variant: 'visit' | 'leave';
  asPath: string;
}

type SessionLogEventInputModel =
  | SessionNavLogEventInputModel
  | SessionLogAddToCartEventInputModel
  | SessionLogMakeAnOrderEventInputModel;

export interface SetSessionLogInputInterface {
  ipInfo: IpInfoInterface;
  event: SessionLogEventInputModel;
}

interface GetSessionLogEvenInterface {
  event: SessionLogEventInputModel;
  context: { req: NextApiRequest; res: NextApiResponse };
}

function getSessionLogEven({
  event,
  context,
}: GetSessionLogEvenInterface): SessionLogEventModel | null {
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });
  const url = `https://${domain}${event.asPath}`;

  let payload: SessionLogEventModel | null = null;
  if (event.variant === 'leave' || event.variant === 'visit') {
    payload = {
      _id: new ObjectId(),
      variant: event.variant,
      url,
      createdAt: new Date(),
    };
  }
  if (event.variant === 'addToCartClick') {
    payload = {
      _id: new ObjectId(),
      variant: event.variant,
      productId: new ObjectId(event.productId),
      url,
      createdAt: new Date(),
    };
  }
  if (event.variant === 'makeAnOrderClick') {
    payload = {
      _id: new ObjectId(),
      variant: event.variant,
      url,
      orderProducts: event.orderProducts.map((orderProductInput) => {
        return {
          _id: new ObjectId(),
          amount: orderProductInput.amount,
          shopId: new ObjectId(orderProductInput.shopId),
          shopProductId: new ObjectId(orderProductInput.shopProductId),
          summaryId: new ObjectId(orderProductInput.shopProductId),
        };
      }),
      createdAt: new Date(),
    };
  }

  return payload;
}

interface CreateNewSessionLogInterface {
  input: SetSessionLogInputInterface;
  sessionId: ObjectIdModel;
  userRoleId: ObjectIdModel;
  userId?: ObjectIdModel;
  locale: string;
  citySlug: string;
  companySlug: string;
  context: { req: NextApiRequest; res: NextApiResponse };
}

async function createNewSessionLog({
  input,
  citySlug,
  companySlug,
  locale,
  sessionId,
  userId,
  userRoleId,
  context,
}: CreateNewSessionLogInterface): Promise<Boolean> {
  const { db } = await getDatabase();
  const sessionLogsCollection = db.collection<SessionLogModel>(COL_SESSION_LOGS);
  const event = getSessionLogEven({
    event: input.event,
    context,
  });

  if (event) {
    const createdLogResult = await sessionLogsCollection.insertOne({
      _id: sessionId,
      locale,
      citySlug,
      companySlug,
      userRoleId,
      userId,
      ipInfo: input.ipInfo,
      events: [event],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdLogResult.acknowledged;
  }
  return false;
}

export async function setSessionLog({
  input,
  context,
}: DaoPropsInterface<SetSessionLogInputInterface>): Promise<SessionLogPayloadModel> {
  try {
    const { db } = await getDatabase();
    const cookies = nookies.get(context);
    const { locale, citySlug, companySlug } = await getRequestParams(context);
    const { user, role } = await getSessionRole(context);
    const sessionLogsCollection = db.collection<SessionLogModel>(COL_SESSION_LOGS);

    // check cookies
    if (!cookies) {
      return {
        success: true,
        message: 'no cookies found',
      };
    }

    // check if user is company or site staff
    if (role.isStaff || role.isCompanyStaff) {
      return {
        success: true,
        message: 'staff',
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input provided',
      };
    }

    // check input ipInfo
    if (!input.ipInfo) {
      return {
        success: false,
        message: 'no ip info provided',
      };
    }

    // get session log
    let sessionIdCookie = cookies[SESSION_COOKIE_KEY];
    const newSessionId = new ObjectId();

    // set session log cookie if not exits
    const cookieOptions = {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    };
    if (!sessionIdCookie) {
      sessionIdCookie = newSessionId.toHexString();
      nookies.set(context, SESSION_COOKIE_KEY, sessionIdCookie, cookieOptions);
    }

    // get log
    const sessionId = sessionIdCookie ? new ObjectId(sessionIdCookie) : newSessionId;
    const log = await sessionLogsCollection.findOne({
      _id: sessionId,
    });

    // create new log if not exits
    if (!log) {
      const createdLogResult = await createNewSessionLog({
        context,
        userRoleId: role._id,
        userId: user?._id,
        sessionId,
        locale,
        companySlug,
        citySlug,
        input,
      });
      if (!createdLogResult) {
        return {
          success: false,
          message: 'log create error',
        };
      }
      return {
        success: true,
        message: 'success',
      };
    }

    // check log date
    const currentDate = new Date().getTime();
    const createdAt = new Date(log.createdAt).getTime();
    const dateDiff = currentDate - createdAt;
    const isStale = dateDiff > ONE_DAY;

    // create new log if stale
    if (isStale) {
      const freshSessionId = new ObjectId();
      const createdLogResult = await createNewSessionLog({
        context,
        userRoleId: role._id,
        userId: user?._id,
        sessionId: freshSessionId,
        locale,
        companySlug,
        citySlug,
        input,
      });
      if (!createdLogResult) {
        return {
          success: false,
          message: 'log create error',
        };
      }
      nookies.set(context, SESSION_COOKIE_KEY, freshSessionId.toHexString(), cookieOptions);
      return {
        success: true,
        message: 'success',
      };
    }

    // update existing log
    const event = getSessionLogEven({
      event: input.event,
      context,
    });
    if (event) {
      await sessionLogsCollection.findOneAndUpdate(
        {
          _id: log._id,
        },
        {
          $push: {
            events: event,
          },
          $set: {
            updatedAt: new Date(),
          },
        },
      );
    }

    return {
      success: true,
      message: 'success',
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
