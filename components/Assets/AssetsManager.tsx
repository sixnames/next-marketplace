import ButtonCross from 'components/Buttons/ButtonCross';
import InputLine from 'components/FormElements/Input/InputLine';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from 'config/modals';
import { useAppContext } from 'context/appContext';
import { CmsProductFragment } from 'generated/apolloComponents';
import Image from 'next/image';
import * as React from 'react';
import { DragDropContext, Draggable, DragUpdate, Droppable } from 'react-beautiful-dnd';
import classes from './AssetsManager.module.css';

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
  const [assets, setAssets] = React.useState<CmsProductFragment['assets']>([]);
  const { showModal } = useAppContext();

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
    [assets],
  );

  return (
    <InputLine label={'Текущие изображения'} labelTag={'div'}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'assets'} direction='horizontal'>
          {(provided) => (
            <div
              className={classes.assetPreviewsList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {assets.map(({ url, index }, draggableIndex) => (
                <Draggable key={url} draggableId={url} index={draggableIndex}>
                  {(draggableProvided) => (
                    <div
                      key={url}
                      className={classes.assetPreview}
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
                          className={classes.assetPreviewRemove}
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
