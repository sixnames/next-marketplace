import WpButton from 'components/button/WpButton';
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
      if (window.matchMedia(`(min-width: ${640}px)`).matches) {
        setVideoSize({
          width: 500,
          height: 500,
        });
      } else {
        setVideoSize({
          width: 328,
          height: 200,
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
      {code ? null : (
        <div className='relative'>
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
          <div className='barcode-line' />
        </div>
      )}

      {code ? (
        <div className='flex flex-col sm:flex-row gap-6 mt-6'>
          <WpButton
            onClick={() => {
              setValue(code);
              setCode('');
            }}
          >
            Применить код {code}
          </WpButton>
          <WpButton theme={'secondary'} onClick={() => setCode('')}>
            Сбросить
          </WpButton>
        </div>
      ) : null}
    </div>
  );
};

export default BarcodeReader;
