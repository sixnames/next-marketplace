import * as React from 'react';

export interface ErrorBoundaryFallbackInterface {
  statusCode?: number;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackInterface> = ({ statusCode }) => {
  return (
    <div className='flex h-[100vh] w-full items-center justify-center bg-primary py-12 px-8 text-center text-xl font-bold text-red-500'>
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
