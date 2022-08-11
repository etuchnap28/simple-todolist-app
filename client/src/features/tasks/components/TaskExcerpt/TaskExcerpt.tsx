import { EntityId } from '@reduxjs/toolkit';
import styles from './TaskExcerpt.module.scss';
import { useAppSelector } from '../../../../app/hooks';
import { selectTaskById, useDeleteTaskMutation, useUpdateStatusMutation } from '../../tasks.service';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import React, { useState } from 'react';
import EditTaskModal from '../EditTaskModal/EditTaskModal';


type Props = {
  taskId: EntityId
}

const TaskExcerpt = ({taskId}: Props) => {
  const task = useAppSelector(state => selectTaskById(state, taskId));
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClicked = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    deleteTask(taskId);
  }

  return (
    <>
      <article className={styles.excerpt} onClick={() => setIsOpen(true)}>
        <label className={styles.checkboxContainer} onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={task?.done} onChange={() => updateStatus({taskId: taskId as string, done: !task?.done})}/>
          <FaCheck />
        </label>
        <label>{task?.task}</label>
        <FaTrashAlt onClick={handleDeleteClicked} />
      </article>
      <EditTaskModal taskId={taskId} open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default TaskExcerpt