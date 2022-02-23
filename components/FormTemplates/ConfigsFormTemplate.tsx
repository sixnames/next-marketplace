import { ConfigModel } from 'db/dbModels';
import { EventRubricInterface, RubricInterface } from 'db/uiInterfaces';
import * as React from 'react';
import ConfigsAssetInput from '../FormElements/FormikConfigAssetInput';
import FormikConfigInput from '../FormElements/FormikConfigInput';
import WpNotification from '../WpNotification';

export interface ConfigsFormTemplateInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
  rubrics?: RubricInterface[];
  eventRubrics?: EventRubricInterface[];
}

const ConfigsFormTemplate: React.FC<ConfigsFormTemplateInterface> = ({
  assetConfigs,
  normalConfigs,
  rubrics,
  eventRubrics,
}) => {
  return (
    <React.Fragment>
      {assetConfigs.map((config) => {
        const { slug } = config;
        const isSvg = slug !== 'pageDefaultPreviewImage';
        return (
          <ConfigsAssetInput
            key={`${config._id}`}
            config={config}
            isSvg={isSvg}
            format={isSvg ? 'svg' : 'jpg'}
          />
        );
      })}

      {normalConfigs.length > 0 ? (
        <div className='mb-8 max-w-[980px]'>
          <WpNotification
            variant={'warning'}
            title={'Внимание!'}
            message={`Каждая настройка содержит города и языки созданные в базе данных.
              Обязательны к заполнению только основной город и основной язык.
              Если пользователь войдёт на сайт не основного города или будет использовать
              не основной язык и настройка не будет заполнена по этим параметрам,
              то значение настройки будет взято из основных полей.`}
          />
        </div>
      ) : null}

      {normalConfigs.map((config) => {
        return (
          <FormikConfigInput
            eventRubrics={eventRubrics}
            key={`${config._id}`}
            config={config}
            rubrics={rubrics}
          />
        );
      })}
    </React.Fragment>
  );
};

export default ConfigsFormTemplate;
