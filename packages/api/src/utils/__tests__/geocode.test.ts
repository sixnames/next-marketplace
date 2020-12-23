import { DEFAULT_LANG, MOCK_ADDRESS_A } from '@yagu/shared';
import { reverseGeocode } from '../geocode';

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
