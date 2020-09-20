import { DEFAULT_PRIORITY } from '@yagu/config';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { CityCounter } from '../entities/common';

export interface ExtendedCityCounter extends CityCounter {
  [key: string]: any;
}

export interface DocumentInterface extends DocumentType<any> {
  views: ExtendedCityCounter[];
}

export interface UpdateModelViewsInterface {
  model: ReturnModelType<any>;
  document: DocumentInterface;
  city: string;
  additionalCityCounterData?: {
    [key: string]: any;
  };
  findCurrentView: (view: ExtendedCityCounter) => boolean;
}

export async function updateModelViews({
  document,
  model,
  city,
  additionalCityCounterData = {},
  findCurrentView,
}: UpdateModelViewsInterface) {
  const { views = [] } = document;
  const currentView = views.find(findCurrentView);

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
