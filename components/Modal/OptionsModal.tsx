import cyrillicToTranslit from 'cyrillic-to-translit-js';
import * as React from 'react';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FormikIndividualSearch from '../FormElements/Search/FormikIndividualSearch';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import WpIcon from '../WpIcon';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface OptionsModalOptionInterface extends Record<string, any> {
  _id: any;
  slug?: string;
  itemId?: string;
  name: string;
  options?: OptionsModalOptionInterface[] | null;
}

export interface OptionsModalLetterInterface {
  letter: string;
  docs: OptionsModalOptionInterface[];
}

export interface OptionsModalCommonPropsInterface {
  title?: string;
  onSubmit: (selectedOptions: OptionsModalOptionInterface[]) => void;
  optionVariant?: 'checkbox' | 'radio';
  buttonText?: string;
  initialEmptyListMessage?: string;
  testId?: string;
  notShowAsAlphabet?: boolean | null;
  disableNestedOptions?: boolean;
  initiallySelectedOptions?: OptionsModalOptionInterface[];
}

export interface OptionsModalInterface extends OptionsModalCommonPropsInterface {
  alphabet?: OptionsModalLetterInterface[] | null;
  loading?: boolean | null;
  error?: any | null;
}

const defaultEmptyListMessage = 'Список пуст';
const radioClassName = 'rounded-full';
const checkboxClassName = 'rounded';
const translit = new cyrillicToTranslit();

const OptionsModal: React.FC<OptionsModalInterface> = ({
  title,
  loading,
  optionVariant = 'checkbox',
  alphabet,
  error,
  onSubmit,
  buttonText = 'Применить',
  initialEmptyListMessage = defaultEmptyListMessage,
  notShowAsAlphabet,
  testId,
  initiallySelectedOptions = [],
  disableNestedOptions,
}) => {
  const [emptyListMessage, setEmptyListMessage] = React.useState<string | null>(null);
  const [state, setState] = React.useState<OptionsModalLetterInterface[] | null>(null);
  const [search, setSearch] = React.useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] =
    React.useState<OptionsModalOptionInterface[]>(initiallySelectedOptions);
  const isCheckbox = React.useMemo(() => optionVariant === 'checkbox', [optionVariant]);
  const inputIcon = React.useMemo(() => {
    return isCheckbox ? (
      <WpIcon className='absolute w-[10px] h-[10px] top-[2px] left-[2px]' name={'check'} />
    ) : (
      <div className='absolute w-[10px] h-[10px] top-[2px] left-[2px] rounded-full bg-theme' />
    );
  }, [isCheckbox]);

  const onOptionClickHandler = React.useCallback(
    (option: OptionsModalOptionInterface) => {
      setSelectedOptions((prevState) => {
        const exist = prevState.some(({ _id }) => _id === option._id);
        if (exist) {
          const filteredOptions = prevState.filter(({ _id }) => {
            return _id !== option._id;
          });
          return filteredOptions;
        }

        if (isCheckbox) {
          return [...prevState, option];
        }

        return [option];
      });
    },
    [isCheckbox],
  );

  const renderOption = React.useCallback(
    (option: OptionsModalOptionInterface) => {
      const { _id, name, options } = option;
      const isSelected = selectedOptions.some((option) => _id === option._id);

      if (options && options.length > 0 && !disableNestedOptions) {
        return (
          <div>
            <div
              onClick={() => onOptionClickHandler(option)}
              className='transition duration-150 flex cursor-pointer hover:text-theme pt-3 pb-3'
            >
              <div
                data-cy={`option-${name}`}
                className={`relative mr-2 w-[18px] h-[18px] flex-shrink-0 bg-secondary border-2 border-border-300 text-theme ${
                  isCheckbox ? checkboxClassName : radioClassName
                }`}
              >
                {isSelected ? inputIcon : null}
              </div>

              <div>{name}</div>
            </div>
            <div className='ml-6'>
              {options.map((child) => {
                return <div key={`${child._id}`}>{renderOption(child)}</div>;
              })}
            </div>
          </div>
        );
      }

      return (
        <div
          onClick={() => onOptionClickHandler(option)}
          className='transition duration-150 flex cursor-pointer hover:text-theme pt-3 pb-3'
        >
          <div
            data-cy={`option-${name}`}
            className={`relative mr-2 w-[18px] h-[18px] flex-shrink-0 bg-secondary border-2 border-border-300 text-theme ${
              isCheckbox ? checkboxClassName : radioClassName
            }`}
          >
            {isSelected ? inputIcon : null}
          </div>

          <div>{name}</div>
        </div>
      );
    },
    [disableNestedOptions, inputIcon, isCheckbox, onOptionClickHandler, selectedOptions],
  );

  React.useEffect(() => {
    if (!search) {
      const realAlphabet = alphabet || [];
      setState(realAlphabet);

      if (realAlphabet.length < 1 && !loading) {
        setEmptyListMessage(initialEmptyListMessage || defaultEmptyListMessage);
      } else {
        setEmptyListMessage(null);
      }
    } else {
      const searchOnLatin = translit.transform(search).toLowerCase();
      const searchOnCyrillic = translit.reverse(search).toLowerCase();

      const filteredAlphabet = (alphabet || []).map(({ letter, docs }) => {
        return {
          letter,
          docs: docs.filter(({ name }) => {
            const cyrillicIndex = name.toLowerCase().indexOf(searchOnCyrillic);
            const latinIndex = name.toLowerCase().indexOf(searchOnLatin);
            return cyrillicIndex > -1 || latinIndex > -1;
          }),
        };
      });
      setState(filteredAlphabet);
    }
  }, [alphabet, initialEmptyListMessage, loading, search]);

  if (loading && !alphabet) {
    return (
      <ModalFrame size={'midWide'}>
        {title ? <ModalTitle>{title}</ModalTitle> : null}
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (error) {
    return (
      <ModalFrame size={'midWide'}>
        {title ? <ModalTitle>{title}</ModalTitle> : null}
        <RequestError />
      </ModalFrame>
    );
  }

  if (emptyListMessage) {
    return (
      <ModalFrame size={'midWide'}>
        {title ? <ModalTitle>{title}</ModalTitle> : null}
        <RequestError message={emptyListMessage} />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={testId} size={'midWide'}>
      {title ? <ModalTitle>{title}</ModalTitle> : null}

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'options'}
        onReset={() => setSearch(null)}
      />

      {notShowAsAlphabet ? (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4'>
          {(state || []).map(({ docs }) => {
            if (docs.length < 1) {
              return null;
            }

            return docs.map((option) => {
              return <div key={`${option._id}`}>{renderOption(option)}</div>;
            });
          })}
        </div>
      ) : (
        (state || []).map(({ letter, docs }) => {
          if (docs.length < 1) {
            return null;
          }

          return (
            <div className='mb-12 pb-12 border-b-2 border-secondary' key={letter}>
              <div className='mb-6 font-medium text-xl uppercase'>{letter}</div>
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4'>
                {docs.map((option) => {
                  return <div key={`${option._id}`}>{renderOption(option)}</div>;
                })}
              </div>
            </div>
          );
        })
      )}

      {selectedOptions.length > 0 ? (
        <FixedButtons>
          <WpButton testId={`options-submit`} onClick={() => onSubmit(selectedOptions)}>
            {buttonText}
          </WpButton>
        </FixedButtons>
      ) : null}
    </ModalFrame>
  );
};

export default OptionsModal;
