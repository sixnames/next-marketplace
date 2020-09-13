import { DEFAULT_PRIORITY } from '../config';
import { ReturnModelType } from '@typegoose/typegoose';
import { CityCounter } from '../entities/common';

export interface ExtendedCityCounter extends CityCounter {
  [key: string]: any;
}

export interface DocumentInterface {
  views: ExtendedCityCounter[];
}

export interface UpdateModelViewsInterface {
  model: ReturnModelType<any>;
  document: Record<string, any> & DocumentInterface;
  city: string;
  additionalCityCounterData?: {
    [key: string]: any;
  };
}

export async function updateModelViews({
  document,
  model,
  city,
  additionalCityCounterData = {},
}: UpdateModelViewsInterface) {
  const { views = [] } = document;
  const currentView = views.find(({ key }) => key === city);
  if (!currentView) {
    await model.findByIdAndUpdate(document.id, {
      $push: {
        views: {
          key: city,
          counter: DEFAULT_PRIORITY,
          ...additionalCityCounterData,
        },
      },
    });
  } else {
    await model.findByIdAndUpdate(
      document.id,
      {
        $inc: {
          'views.$[view].counter': 1,
        },
      },
      {
        arrayFilters: [{ 'view.key': { $eq: city } }],
      },
    );
  }
}
