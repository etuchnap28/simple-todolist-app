import React, { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { selectTaskIds, useGetTasksQuery } from '../../tasks.service'
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import TaskExcerpt from '../TaskExcerpt/TaskExcerpt';
import styles from './TasksList.module.scss';
import {FaPlus} from 'react-icons/fa';
import { selectUser } from '../../../auth/authSlice';
import { useGetUserQuery } from '../../../users/users.service';

const TasksList = () => {
  const {isLoading: tasksAreLoading} = useGetTasksQuery();
  const taskIds = useAppSelector(selectTaskIds);
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const {data: userData, isLoading: userIsLoading} = useGetUserQuery(user);

  const content = (
    <>
      <div className={styles.tasksList}>
        {userIsLoading ? <p>Loading...</p> : <h3>{userData?.name}'s Tasks: </h3>}
        {taskIds.map(id => <TaskExcerpt key={id} taskId={id} />)}
        <div className={styles.addTaskLink} onClick={() => setIsOpen(true)}>
          <FaPlus />
          <p>Add task</p>
        </div>
        <CreateTaskModal open={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  )

  return (
    <>
      {content}
    </>
  );
}

export default TasksList