const metricTranslations = {
  metric: {
    create: {
      duplicate: {
        ru: 'Тип измерения с таким именем уже существует.',
        en: 'Metric with same name is already exists.',
      },
      error: {
        ru: 'Ошибка создания типа измерения.',
        en: 'Metric creation error.',
      },
      success: {
        ru: 'Тип измерения создан.',
        en: 'Metric created.',
      },
    },
    update: {
      duplicate: {
        ru: 'Тип измерения с таким именем уже существует.',
        en: 'Metric with same name is already exists.',
      },
      error: {
        ru: 'Ошибка обновления типа измерения.',
        en: 'Metric update error.',
      },
      success: {
        ru: 'Тип измерения обновлён.',
        en: 'Metric updated.',
      },
    },
    delete: {
      used: {
        ru: 'Тип измерения используется в атрибутах, его нельзя удалить.',
        en: `Metric is used in attributes. You can't delete it.`,
      },
      error: {
        ru: 'Ошибка удаления типа измерения.',
        en: 'Metric delete error.',
      },
      success: {
        ru: 'Тип измерения удалён.',
        en: 'Metric deleted.',
      },
    },
  },
};

export default metricTranslations;
