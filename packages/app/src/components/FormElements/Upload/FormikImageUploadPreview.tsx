import React, { useEffect, useState } from 'react';
import classes from './FormikImageUploadPreview.module.css';
import ButtonCross from '../../Buttons/ButtonCross';
import { readImageBlob } from '../../../utils/assetHelpers';

interface FormikImageUploadPreviewInterface {
  file: any;
  removeImageHandler: (index?: number) => void;
  inline?: boolean;
  index?: number;
}

const FormikImageUploadPreview: React.FC<FormikImageUploadPreviewInterface> = ({
  file = null,
  removeImageHandler,
  inline,
  index,
}) => {
  const [thumb, setThumb] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    async function getImageThumb() {
      if (file && typeof file !== 'string') {
        const fileThumb = await readImageBlob(file);
        setThumb(fileThumb);
      } else {
        setThumb(file);
      }
    }

    getImageThumb();
  }, [file]);

  if (!file || !thumb) {
    return null;
  }

  const alt = file && file.name ? file.name : '';

  return (
    <div
      className={`${classes.frame} ${inline ? classes.inline : ''}`}
      data-cy={`file-preview-${index}`}
    >
      <div>
        <img src={`${thumb}`} alt={alt} width={150} height={150} />
      </div>

      <ButtonCross
        className={classes.remove}
        onClick={() => removeImageHandler(index)}
        testId={`file-preview-remove-${index}`}
      />
    </div>
  );
};

export default FormikImageUploadPreview;
