import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './CreateTaskModal.module.scss';
import {FaTimes} from 'react-icons/fa';
import { useCreateTaskMutation } from '../../tasks.service';
import useFormInput from '../../../../hooks/useFormInput';

type Props = {
  open: boolean,
  onClose: () => void
}

const CreateTaskModal = ({open, onClose}: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [task, taskAttribs, resetTask] = useFormInput(useState(''));
  
  if (!open) return null;

  const canSave = task && !isLoading;

  const onAddTaskClicked = async () => {
    if (canSave) {
      try {
        await createTask(task).unwrap();

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
          <label htmlFor='task'>New task:</label>
          <input 
            type='text'
            id='task'
            {...taskAttribs}
            autoComplete='off'
          />
          <button type='button' className='btnDark' disabled={!canSave} onClick={onAddTaskClicked}>Add</button>
          <FaTimes onClick={onClose} />
        </form>
      </div>
    </>,
    document.getElementById('portal') as HTMLElement
  )
}

export default CreateTaskModal