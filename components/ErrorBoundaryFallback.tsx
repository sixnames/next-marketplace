import * as React from 'react';

export interface ErrorBoundaryFallbackInterface {
  statusCode?: number;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackInterface> = ({ statusCode }) => {
  return (
    <div className='flex items-center justify-center h-[100vh] w-full py-12 px-8 bg-primary text-red-500 font-bold text-xl text-center'>
      <div>
        <p>УПС! Что-то пошло не так.</p>
        <p>Лог ошибки отправлен разработчикам.</p>
        <p>Просим прощения за неудобства!</p>
        {statusCode ? <p>{`Код ошибки ${statusCode}`}</p> : null}
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
