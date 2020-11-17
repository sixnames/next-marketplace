import React, { useEffect } from 'react';
import { useLanguageContext } from '../../../context/languageContext';
import { debounce, get } from 'lodash';
import Input, { InputPropsInterface } from './Input';
import { Field, FieldProps } from 'formik';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';
import classes from './FormikAddressInput.module.css';
import Spinner from '../../Spinner/Spinner';
import { GeocodeResultInterface, ReverseGeocodePayload } from '@yagu/shared';
import fetch from 'node-fetch';

type AddressInputType = Omit<InputPropsInterface, 'autoComplete' | 'type'>;

interface FormikAddressInputConsumerInterface extends AddressInputType {
  notValid: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  fieldValue?: GeocodeResultInterface | null;
}

const FormikAddressInputConsumer: React.FC<FormikAddressInputConsumerInterface> = ({
  notValid,
  setFieldValue,
  name,
  fieldValue,
  disabled,
  ...props
}) => {
  const { lang } = useLanguageContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [string, setString] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<GeocodeResultInterface[]>([]);

  useEffect(() => {
    const getGeoResult = async (value: string) => {
      try {
        const address = `address=${value}`;
        const settings = `language=${lang}&location_type=ROOFTOP&result_type=street_address`;
        const apiKey = `key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${address}&${settings}&${apiKey}`;
        const res = await fetch(url);
        const json: ReverseGeocodePayload = await res.json();
        const results = json.results.map(({ formatted_address, geometry }) => {
          return {
            formattedAddress: formatted_address,
            coordinates: {
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

    if (string && string.length > 0) {
      setResults([]);
      setLoading(true);
      debounce(() => getGeoResult(string), 2000)();
    }
  }, [lang, string]);

  useEffect(() => {
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
                    key={formattedAddress}
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
        const error = get(errors, name);
        const notValid = Boolean(error);
        const showError = showInlineError && notValid;
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
              {...props}
            />
            {showError && <FieldErrorMessage name={name} />}
          </div>
        );
      }}
    </Field>
  );
};

export default FormikAddressInput;
