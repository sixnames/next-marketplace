import { phoneToRaw, phoneToReadable } from '../phoneUtils';

describe('Utils', () => {
  it('Should format phones', async () => {
    const rawInitial = '+79998884433';
    const readableInitial = '+7 999 888-44-33';

    const raw = phoneToRaw(readableInitial);
    const readable = phoneToReadable(rawInitial);

    expect(raw).toEqual(rawInitial);
    expect(readable).toEqual(readableInitial);
  });
});
