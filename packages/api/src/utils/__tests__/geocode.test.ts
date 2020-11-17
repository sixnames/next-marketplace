import { DEFAULT_LANG } from '@yagu/config';
import { reverseGeocode } from '@yagu/shared';
import { MOCK_ADDRESS_A } from '@yagu/mocks';

describe('Geocode', () => {
  it('Should return address by coordinates', async () => {
    const { status, results } = await reverseGeocode({
      ...MOCK_ADDRESS_A.point,
      language: DEFAULT_LANG,
    });
    const currentResult = results[0];
    expect(status).toEqual('OK');
    expect(currentResult.formatted_address).toEqual(MOCK_ADDRESS_A.formattedAddress);
  });
});
