import * as React from 'react';
import { get } from 'lodash';
import { useLocaleContext } from '../../../context/localeContext';
import { GeocodeResultInterface, ReverseGeocodePayload } from '../../../lib/geocode';
import Spinner from '../../Spinner';
import WpInput, { WpInputPropsInterface } from './WpInput';
import { Field, FieldProps } from 'formik';
import { useDebounce } from 'use-debounce';

type AddressInputType = Omit<WpInputPropsInterface, 'autoComplete' | 'type'>;

interface FormikAddressInputConsumerInterface extends AddressInputType {
  notValid: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  fieldValue?: GeocodeResultInterface | null;
  showInlineError?: boolean;
  onAddressSelect?: (result: GeocodeResultInterface) => void;
  error?: any;
}

const FormikAddressInputConsumer: React.FC<FormikAddressInputConsumerInterface> = ({
  notValid,
  setFieldValue,
  name,
  fieldValue,
  disabled,
  onAddressSelect,
  ...props
}) => {
  const { locale } = useLocaleContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [string, setString] = React.useState<string | null>(null);
  const [value] = useDebounce(string, 1000);
  const [results, setResults] = React.useState<GeocodeResultInterface[]>([]);

  React.useEffect(() => {
    const getGeoResult = async (value: string) => {
      try {
        const address = `address=${value}`;
        const settings = `language=${locale}&location_type=ROOFTOP&result_type=street_address`;
        const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${address}&${settings}&${apiKey}`;
        const res = await fetch(url);
        const json: ReverseGeocodePayload = await res.json();
        const results: GeocodeResultInterface[] = json.results.map(
          ({ formatted_address, geometry, address_components }) => {
            return {
              formattedAddress: formatted_address,
              point: {
                lat: geometry.location.lat,
                lng: geometry.location.lng,
              },
              addressComponents: address_components.map((component) => {
                return {
                  shortName: component.short_name,
                  longName: component.long_name,
                  types: component.types,
                };
              }),
            };
          },
        );
        setLoading(false);
        setResults(results);
      } catch (e) {
        setLoading(false);
      }
    };

    if (value && value.length > 0) {
      setResults([]);
      setLoading(true);

      getGeoResult(value).catch(() => {
        setIsOpen(false);
        setLoading(false);
        setResults([]);
      });
    } else {
      setIsOpen(false);
      setLoading(false);
      setResults([]);
    }
  }, [locale, value]);

  React.useEffect(() => {
    if ((loading || results.length > 0) && !fieldValue) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [fieldValue, results, loading]);

  function clearInputHandler() {
    setFieldValue(name, null);
    setIsOpen(false);
    setLoading(false);
    setString('');
    setResults([]);
  }

  return (
    <div className='relative z-10'>
      <WpInput
        {...props}
        disabled={disabled}
        name={name}
        className='relative z-10'
        value={fieldValue ? fieldValue.formattedAddress : string}
        onChange={(e) => setString(e.target.value)}
        onClear={disabled ? clearInputHandler : null}
        autoComplete={'off'}
        notValid={notValid}
        low={true}
      />
      {isOpen ? (
        <div className='absolute top-full left-0 z-20 w-full divide-y divide-border-200 rounded-md bg-secondary py-4 shadow-lg'>
          {loading ? <Spinner isNested /> : null}
          {!loading
            ? results.map((result, index) => {
                const { formattedAddress } = result;
                return (
                  <div
                    data-cy={`address-result-${index}`}
                    onClick={() => {
                      if (onAddressSelect) {
                        onAddressSelect(result);
                      }
                      setFieldValue(name, result);
                    }}
                    className='flex min-h-[2rem] cursor-pointer items-center px-4 py-2 transition-all duration-200 hover:text-theme'
                    key={`${formattedAddress}-${index}`}
                  >
                    {formattedAddress}
                  </div>
                );
              })
            : null}
        </div>
      ) : null}
    </div>
  );
};

export interface FormikAddressInputInterface extends AddressInputType {
  frameClass?: string;
  showInlineError?: boolean;
  onAddressSelect?: (result: GeocodeResultInterface) => void;
}

const FormikAddressInput: React.FC<FormikAddressInputInterface> = ({
  name,
  isRequired,
  showInlineError,
  frameClass,
  low,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const error = get(errors, `${name}`);
        const addressError = get(errors, `${name}.formattedAddress`);
        const finalError = addressError || get(error, 'formattedAddress');
        const notValid = Boolean(finalError);
        const fieldValue = field.value;

        return (
          <div className={`relative z-50 ${low ? '' : 'mb-8'} ${frameClass ? frameClass : ''}`}>
            <FormikAddressInputConsumer
              setFieldValue={setFieldValue}
              notValid={notValid}
              name={name}
              fieldValue={fieldValue}
              disabled={fieldValue}
              error={error}
              showInlineError={showInlineError}
              {...props}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FormikAddressInput;
