import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Icon from 'components/Icon/Icon';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import * as React from 'react';

export interface OptionsModalOptionInterface extends Record<string, any> {
  _id: any;
  slug: string;
  name: string;
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
}

export interface OptionsModalInterface extends OptionsModalCommonPropsInterface {
  alphabet?: OptionsModalLetterInterface[] | null;
  loading?: boolean | null;
  error?: any | null;
}

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
}) => {
  const [state, setState] = React.useState<OptionsModalLetterInterface[]>([]);
  const [search, setSearch] = React.useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<OptionsModalOptionInterface[]>([]);

  const isCheckbox = React.useMemo(() => optionVariant === 'checkbox', [optionVariant]);
  const inputIcon = React.useMemo(() => {
    return isCheckbox ? (
      <Icon className='absolute w-[10px] h-[10px] top-[2px] left-[2px]' name={'check'} />
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

  React.useEffect(() => {
    if (!search) {
      setState(alphabet || []);
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
  }, [alphabet, search]);

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

  return (
    <ModalFrame size={'midWide'}>
      {title ? <ModalTitle>{title}</ModalTitle> : null}

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'options'}
        withReset
        onReset={() => setSearch(null)}
      />

      {state.map(({ letter, docs }) => {
        if (docs.length < 1) {
          return null;
        }

        return (
          <div className='mb-12 pb-12 border-b-2 border-secondary-background' key={letter}>
            <div className='mb-6 font-medium text-xl uppercase'>{letter}</div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4'>
              {docs.map((option) => {
                const { _id, name } = option;
                const isSelected = selectedOptions.some((option) => _id === option._id);
                return (
                  <div
                    onClick={() => onOptionClickHandler(option)}
                    className='transition duration-150 flex cursor-pointer hover:text-theme pt-3 pb-3'
                    key={`${_id}`}
                  >
                    <div
                      className={`relative mr-2 w-[18px] h-[18px] flex-shrink-0 bg-secondary-background border-2 border-border-color text-theme ${
                        isCheckbox ? checkboxClassName : radioClassName
                      }`}
                    >
                      {isSelected ? inputIcon : null}
                    </div>

                    <div>{name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <FixedButtons>
        <Button onClick={() => onSubmit(selectedOptions)}>{buttonText}</Button>
      </FixedButtons>
    </ModalFrame>
  );
};

export default OptionsModal;
