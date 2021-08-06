import ButtonCross from 'components/ButtonCross';
import InputLine from 'components/FormElements/Input/InputLine';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import Image from 'next/image';
import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd';

interface AssetItem {
  url: string;
  index: number;
}

interface OnRemoveInterface {
  assetNewIndex: number;
  assetUrl: string;
}

interface AssetsManagerInterface {
  initialAssets: AssetItem[];
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
  const [assets, setAssets] = React.useState<AssetItem[]>([]);
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
              {assets.map(({ url, index }, draggableIndex) => (
                <Draggable key={url} draggableId={url} index={draggableIndex}>
                  {(draggableProvided) => (
                    <div
                      key={url}
                      className='w-40 h-40 relative'
                      data-cy={`asset-preview-${draggableIndex}`}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                    >
                      <Image
                        src={url}
                        alt={assetsTitle}
                        title={assetsTitle}
                        layout='fill'
                        objectFit='contain'
                      />
                      {draggableIndex === 0 ? null : (
                        <ButtonCross
                          iconSize={'smaller'}
                          size={'smaller'}
                          className='absolute top-0 right-0 z-30'
                          onClick={() => {
                            showModal<ConfirmModalInterface>({
                              variant: CONFIRM_MODAL,
                              props: {
                                message: `Вы уверены, что хотите удалить изображение?`,
                                confirm: () => {
                                  onRemoveHandler(index);
                                },
                              },
                            });
                          }}
                          testId={`asset-preview-remove-${draggableIndex}`}
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