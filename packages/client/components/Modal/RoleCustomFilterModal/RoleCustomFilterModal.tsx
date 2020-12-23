import React, { useState } from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { SetRoleOperationCustomFilterInput } from '../../../generated/apolloComponents';
import ModalButtons from '../ModalButtons';
import Button from '../../Buttons/Button';
import ModalText from '../ModalText';
import JsonEditor from '../../JSONEditor/JSONEditor';
import { ROLE_EMPTY_CUSTOM_FILTER } from '@yagu/shared';

export interface RoleCustomFilterModalInterface {
  customFilter: string;
  confirm: (values: Omit<SetRoleOperationCustomFilterInput, 'roleId' | 'operationId'>) => void;
}

const RoleCustomFilterModal: React.FC<RoleCustomFilterModalInterface> = ({
  customFilter = ROLE_EMPTY_CUSTOM_FILTER,
  confirm,
}) => {
  const [state, setState] = useState(JSON.parse(customFilter));
  const notValid = !state;

  return (
    <ModalFrame testId={'role-custom-filter-modal'}>
      <ModalTitle>Введите фильтр в формате JSON</ModalTitle>
      <ModalText>
        <p>
          ID авторизованного пользователя можно получить через значение{' '}
          <span>__authenticatedUser</span>
        </p>
        <p>Пример:</p>
        <code>{`{ author: "__authenticatedUser" }`}</code>
      </ModalText>

      <JsonEditor
        initialState={state}
        onChange={(value) => {
          setState(value.jsObject);
        }}
      />

      {notValid && (
        <ModalText>
          <p>
            <span>
              Фильтр не может быть пустым. Минимальное значение фильтра &quot;{`{}`}&quot;
            </span>
          </p>
        </ModalText>
      )}

      <ModalButtons>
        <Button
          disabled={notValid}
          onClick={() => confirm({ customFilter: JSON.stringify(state) })}
        >
          Сохранить
        </Button>
      </ModalButtons>
    </ModalFrame>
  );
};

export default RoleCustomFilterModal;
