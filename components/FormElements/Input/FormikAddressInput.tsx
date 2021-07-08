import * as React from 'react';
import { useLocaleContext } from 'context/localeContext';
import { get } from 'lodash';
import Input, { InputPropsInterface } from './Input';
import { Field, FieldProps } from 'formik';
import classes from './FormikAddressInput.module.css';
import Spinner from 'components/Spinner';
import { useDebounce } from 'use-debounce';
import { GeocodeResultInterface, ReverseGeocodePayload } from 'lib/geocode';

type AddressInputType = Omit<InputPropsInterface, 'autoComplete' | 'type'>;

interface FormikAddressInputConsumerInterface extends AddressInputType {
  notValid: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  fieldValue?: GeocodeResultInterface | null;
  showInlineError?: boolean;
  error?: any;
}

const FormikAddressInputConsumer: React.FC<FormikAddressInputConsumerInterface> = ({
  notValid,
  setFieldValue,
  name,
  fieldValue,
  disabled,
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
        const settings = `language=${locale}&result_type=street_address`;
        // const settings = `language=${locale}&location_type=ROOFTOP&result_type=street_address`;
        const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${address}&${settings}&${apiKey}`;
        const res = await fetch(url);
        const json: ReverseGeocodePayload = await res.json();
        const results = json.results.map(({ formatted_address, geometry }) => {
          return {
            formattedAddress: formatted_address,
            point: {
              lat: geometry.location.lat,
              lng: geometry.location.lng,
            },
          };
        });
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
    <div className={classes.inputHolder}>
      <Input
        {...props}
        disabled={disabled}
        name={name}
        className={classes.input}
        value={fieldValue ? fieldValue.formattedAddress : string}
        onChange={(e) => setString(e.target.value)}
        onClear={disabled ? clearInputHandler : null}
        autoComplete={'off'}
        notValid={notValid}
        low={true}
      />
      {isOpen ? (
        <div className={`${classes.list}`}>
          {loading ? <Spinner isNested /> : null}
          {!loading
            ? results.map((result, index) => {
                const { formattedAddress } = result;
                return (
                  <div
                    data-cy={`address-result-${index}`}
                    onClick={() => setFieldValue(name, result)}
                    className={`${classes.listItem}`}
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
          <div
            className={`${classes.frame} ${low ? classes.low : ''} ${frameClass ? frameClass : ''}`}
          >
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
