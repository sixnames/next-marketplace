import Button from 'components/Buttons/Button';
import { debounce } from 'lodash';
import * as React from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

interface VideoSizeInterface {
  width: number;
  height: number;
}

interface BarcodeReaderInterface {
  setValue: (code: string) => void;
  isVisible: boolean;
}

const BarcodeReader: React.FC<BarcodeReaderInterface> = ({ isVisible, setValue }) => {
  const [code, setCode] = React.useState<string>('');
  const [videoSize, setVideoSize] = React.useState<VideoSizeInterface>({
    width: 500,
    height: 500,
  });

  React.useEffect(() => {
    function resizeHandler() {
      if (window.matchMedia(`(max-width: ${640}px)`).matches) {
        setVideoSize({
          width: 328,
          height: 200,
        });
      } else {
        setVideoSize({
          width: 500,
          height: 500,
        });
      }
    }

    const debouncedResizeHandler = debounce(resizeHandler, 250);
    resizeHandler();

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div>
      <div>
        <BarcodeScannerComponent
          width={videoSize.width}
          height={videoSize.height}
          onUpdate={(err, result) => {
            if (!err && result) {
              const resultCode = result.getText();
              setCode(resultCode);
            }
          }}
        />
      </div>

      {code ? (
        <div className='flex flex-col sm:flex-row gap-6 mt-6'>
          <Button
            onClick={() => {
              setValue(code);
              setCode('');
            }}
          >
            Применить код {code}
          </Button>
          <Button theme={'secondary'} onClick={() => setCode('')}>
            Сбросить
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default BarcodeReader;
