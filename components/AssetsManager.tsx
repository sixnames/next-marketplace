import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';
import { CONFIRM_MODAL } from '../lib/config/modalVariants';
import ButtonCross from './button/ButtonCross';
import { useAppContext } from './context/appContext';
import InputLine from './FormElements/Input/InputLine';
import { ConfirmModalInterface } from './Modal/ConfirmModal';
import WpImage from './WpImage';

interface OnRemoveInterface {
  assetNewIndex: number;
  assetUrl: string;
}

interface AssetsManagerInterface {
  initialAssets: string[];
  onRemoveHandler: (assetIndex: number) => void;
  onReorderHandler: (args: OnRemoveInterface) => void;
  assetsTitle: string;
}

const AssetsManager: React.FC<AssetsManagerInterface> = ({
  initialAssets,
  assetsTitle,
  onReorderHandler,
  onRemoveHandler,
}) => {
  const [assets, setAssets] = React.useState<string[]>([]);
  const { showModal } = useAppContext();
  resetServerContext();

  React.useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  const onDragEnd = React.useCallback(
    (result: DragUpdate) => {
      if (!result.destination || assets.length <= 1) {
        return;
      }

      const reorderedData = [...assets];
      const [removed] = reorderedData.splice(result.source.index, 1);
      reorderedData.splice(result.destination.index, 0, removed);
      setAssets(reorderedData);

      onReorderHandler({
        assetNewIndex: result.destination.index,
        assetUrl: result.draggableId,
      });
    },
    [assets, onReorderHandler],
  );

  return (
    <InputLine label={'Текущие изображения'} labelTag={'div'}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'assets'} direction='horizontal'>
          {(provided) => (
            <div
              className='flex flex-wrap gap-8'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {assets.map((url, draggableIndex) => (
                <Draggable key={url} draggableId={url} index={draggableIndex}>
                  {(draggableProvided) => (
                    <div
                      key={url}
                      className='relative h-40 w-40'
                      data-cy={`asset-preview-${draggableIndex}`}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                    >
                      <WpImage
                        className='t-0 l-0 absolute h-full w-full object-contain'
                        url={url}
                        width={80}
                        alt={assetsTitle}
                        title={assetsTitle}
                      />

                      {draggableIndex === 0 ? null : (
                        <ButtonCross
                          iconSize={'smaller'}
                          size={'smaller'}
                          className='absolute top-0 right-0 z-30'
                          testId={`asset-preview-remove-${draggableIndex}`}
                          onClick={() => {
                            showModal<ConfirmModalInterface>({
                              variant: CONFIRM_MODAL,
                              props: {
                                message: `Вы уверены, что хотите удалить изображение?`,
                                confirm: () => {
                                  onRemoveHandler(draggableIndex);
                                },
                              },
                            });
                          }}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </InputLine>
  );
};

export default AssetsManager;
