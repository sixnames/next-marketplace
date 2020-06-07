import React from 'react';
import FormikImageUploadPreview from './FormikImageUploadPreview';
import { DragDropContext, Draggable, DragUpdate, Droppable } from 'react-beautiful-dnd';
import classes from './FormikDropZonePreview.module.css';

interface FormikDropZonePreviewInterface {
  files: any[];
  removeImageHandler: (i?: number) => void;
  setFieldValue: (name: string, value: any) => void;
  name: string;
}

const FormikDropZonePreview: React.FC<FormikDropZonePreviewInterface> = ({
  files = [],
  removeImageHandler,
  setFieldValue,
  name,
}) => {
  if (files.length < 1) {
    return null;
  }

  function onDragEnd(result: DragUpdate) {
    if (!result.destination) {
      return;
    }

    const reorderedData = [...files];
    const [removed] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, removed);
    setFieldValue(name, reorderedData);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'files'} direction='horizontal'>
        {(provided) => (
          <div className={classes.frame} ref={provided.innerRef} {...provided.droppableProps}>
            {files.map((file, index) => (
              <Draggable key={file.name} draggableId={file.name} index={index}>
                {(draggableProvided) => (
                  <div
                    className={classes.item}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.dragHandleProps}
                    {...draggableProvided.draggableProps}
                  >
                    <FormikImageUploadPreview
                      key={file.name}
                      removeImageHandler={removeImageHandler}
                      file={file}
                      index={index}
                      inline
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FormikDropZonePreview;
