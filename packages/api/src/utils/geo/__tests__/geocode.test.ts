import { reverseGeocode } from '../geocode';
import { DEFAULT_LANG } from '@yagu/config';

describe('Geocode', () => {
  it('Should return address by coordinates', async () => {
    const { status, results } = await reverseGeocode({
      lat: 55.790229,
      lng: 37.549611,
      language: DEFAULT_LANG,
    });
    const expectedAddress = 'Ленинградский пр-т., 35 строение 5, Москва, Россия, 125284';
    const currentResult = results[0];
    expect(status).toEqual('OK');
    expect(currentResult.formatted_address).toEqual(expectedAddress);
  });
});
