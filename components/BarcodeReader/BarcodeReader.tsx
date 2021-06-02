import Button from 'components/Buttons/Button';
import * as React from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

interface BarcodeReaderInterface {
  setValue: (code: string) => void;
  isVisible: boolean;
}

const BarcodeReader: React.FC<BarcodeReaderInterface> = ({ isVisible, setValue }) => {
  const [code, setCode] = React.useState<string>('');

  if (!isVisible) {
    return null;
  }

  return (
    <React.Fragment>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (!err && result) {
            const resultCode = result.getText();
            setCode(resultCode);
          }
        }}
      />

      {code ? <Button onClick={() => setValue(code)}>Сохранить код {code}</Button> : null}
    </React.Fragment>
  );
};

export default BarcodeReader;
