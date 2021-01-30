import { IncomingMessage, ServerResponse } from 'http';

interface ApiRequest extends IncomingMessage {
  cookies: Record<string, any>;
}

export interface NexusContext {
  req: ApiRequest;
  res: ServerResponse;
  locale?: string;
}
