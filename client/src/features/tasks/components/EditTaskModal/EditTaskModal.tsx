import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './EditTaskModal.module.scss';
import {FaTimes} from 'react-icons/fa';
import { selectTaskById, useUpdateTaskMutation } from '../../tasks.service';
import useFormInput from '../../../../hooks/useFormInput';
import { EntityId } from '@reduxjs/toolkit';
import { useAppSelector } from '../../../../app/hooks';

type Props = {
  taskId: EntityId,
  open: boolean,
  onClose: () => void
}

const EditTaskModal = ({taskId, open, onClose}: Props) => {
  const taskObj = useAppSelector(state => selectTaskById(state, taskId))
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [task, taskAttribs, resetTask] = useFormInput(useState(taskObj?.task as string));
  
  if (!open) return null;

  const canSave = task && !isLoading;

  const onAddTaskClicked = async () => {
    if (canSave) {
      try {
        await updateTask({taskId, task}).unwrap();

        resetTask();
        onClose();
      } catch (err) {
        console.log(err);
      }
    }
  }

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.createTaskModal}>
        <form className={styles.addTaskForm}>
          <label htmlFor='task'>Edit task:</label>
          <input 
            type='text'
            id='task'
            {...taskAttribs}
            autoComplete='off'
          />
          <button type='button' className='btnDark' disabled={!canSave} onClick={onAddTaskClicked}>Save</button>
          <FaTimes onClick={onClose} />
        </form>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  )
}

export default EditTaskModal