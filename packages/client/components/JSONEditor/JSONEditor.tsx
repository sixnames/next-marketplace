import React, { useEffect, useRef, useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

interface EditorValueInterface {
  error: boolean;
  jsObject: { [key: string]: any };
  json: string;
  lines: number;
  markupText: string;
  plaintext: string;
}

interface JsonEditorInterface {
  onChange: (value: EditorValueInterface) => void;
  initialState: { [key: string]: any };
  id?: string;
  height?: number;
}

const JsonEditor: React.FC<JsonEditorInterface> = ({
  initialState,
  onChange,
  id = 'json-editor',
  height = 300,
}) => {
  const childrenRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function resizeWindow() {
      if (childrenRef && childrenRef.current) {
        const { clientWidth = 200 } = childrenRef.current!;
        setWidth(clientWidth);
      }
    }

    resizeWindow();

    window.addEventListener('resize', resizeWindow);

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [childrenRef]);

  return (
    <div ref={childrenRef}>
      {width > 0 && (
        <JSONInput
          id={id}
          placeholder={initialState}
          onChange={onChange}
          locale={locale}
          width={width}
          height={`${height}px`}
        />
      )}
    </div>
  );
};

export default JsonEditor;
