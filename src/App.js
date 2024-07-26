import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask, reorderTasks, moveTask, setBoards, addSubtask, reorderSubtasks, moveSubtask } from './features/tasksSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faHouse, faTableColumns, faUser, faMagnifyingGlass, faGear } from '@fortawesome/free-solid-svg-icons';
Modal.setAppElement('#root');

function App() {
  const boards = useSelector((state) => state.tasks.boards);
  const dispatch = useDispatch();

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState(null);

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const savedBoards = localStorage.getItem('boards');
    if (savedBoards) {
      dispatch(setBoards(JSON.parse(savedBoards)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  const handleAddTask = (boardId) => {
    setIsModalOpen(true);
    setCurrentBoardId(boardId);
  };

  const handleSaveTask = () => {
    if (newTaskText.length < 110 && newTaskText.trim()) {
      dispatch(addTask({ boardId: currentBoardId, task: { id: Date.now().toString(), text: newTaskText, subtasks: [] } }));
      setNewTaskText('');
      setIsModalOpen(false);
    } else if (newTaskText.length === 0) alert('enter a task');
  };

  const handleUpdateTask = (boardId, taskId) => {
    if (editedTaskText.length < 110 && editedTaskText.trim()) {
      dispatch(updateTask({ boardId, taskId, newText: editedTaskText }));
      setEditedTaskText('');
      setSelectedTask(null);
    } else if (editedTaskText.length === 0) alert('enter a task');
  };

  const handleDeleteTask = (boardId, taskId) => {
    dispatch(deleteTask({ boardId, taskId }));
  };

  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'task') {
      if (source.droppableId === destination.droppableId) {
        dispatch(reorderTasks({
          boardId: source.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index
        }));
      } else {
        dispatch(moveTask({
          sourceBoardId: source.droppableId,
          destinationBoardId: destination.droppableId,
          taskId: result.draggableId,
          destinationIndex: destination.index
        }));
      }
    } else if (type === 'subtask') {
      const sourceTaskId = source.droppableId;
      const destinationTaskId = destination.droppableId;
      if (sourceTaskId === destinationTaskId) {
        dispatch(reorderSubtasks({
          boardId: boards.find(board => board.tasks.some(task => task.id === sourceTaskId)).id,
          taskId: sourceTaskId,
          sourceIndex: source.index,
          destinationIndex: destination.index
        }));
      } else {
        dispatch(moveSubtask({
          sourceBoardId: boards.find(board => board.tasks.some(task => task.id === sourceTaskId)).id,
          sourceTaskId,
          destinationBoardId: boards.find(board => board.tasks.some(task => task.id === destinationTaskId)).id,
          destinationTaskId,
          subtaskId: result.draggableId,
          destinationIndex: destination.index
        }));
      }
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      width: '300px',
      textAlign: 'center',
    }
  };

  const handleEditTaskClick = (task) => {
    setSelectedTask(task.id);
    setEditedTaskText(task.text);
  };

  const handleAddSubtask = (boardId, taskId) => {
    if (newSubtaskText.length < 110 && newSubtaskText.trim()) {
      dispatch(addSubtask({ boardId, taskId, subtask: { id: Date.now().toString(), text: newSubtaskText } }));
      setNewSubtaskText('');
      setCurrentTaskId(null);
    } else if (editedTaskText.length === 0) alert('enter a subtask');
  };

  return (
    <>
      <div className='wrapper'>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="all-boards" direction="horizontal" type="board">
            {(provided) => (
              <div className="app" ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((board) => (
                  <div className="board-container" key={board.id}>
                    <div className="second-block">
                      <div className='left-wrapper'>
                        <div className='icon-wrapper'>
                          <p><FontAwesomeIcon className='icon-padding' icon={faHouse} style={{ color: "#b7b9bd", }} />Dashboard</p>
                          <p><FontAwesomeIcon className='icon-padding' icon={faTableColumns} style={{ color: "#b7b9bd", }} />Board</p>
                          <p><FontAwesomeIcon className='icon-padding' icon={faUser} style={{ color: "#b7b9bd", }} />Profile</p>
                          <p><FontAwesomeIcon className='icon-padding' icon={faMagnifyingGlass} style={{ color: "#b7b9bd", }} />Search</p>
                        </div>

                        <div className='user'>John Doe</div>
                      </div>

                      <div className='right-wrapper'>
                        <p className='settings'> <FontAwesomeIcon icon={faGear} style={{ color: "#b7b9bd", }} /></p>
                      </div>

                    </div>
                    <Droppable key={board.id} droppableId={board.id} type="task">
                      {(provided) => (
                        <div className="board" ref={provided.innerRef} {...provided.droppableProps}>
                          {board.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <>
                                <div
                                  className="task"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className='task-content'>
                                    {selectedTask === task.id ? (
                                      <>
                                        <input
                                          type="text"
                                          value={editedTaskText}
                                          onChange={(e) => setEditedTaskText(e.target.value)}
                                        />
                                        <button className='button-icon' onClick={() => handleUpdateTask(board.id, task.id)}>Save</button>
                                        <button className='button-icon' onClick={() => setSelectedTask(null)}>Cancel</button>

                                      </>
                                    ) : (
                                      <>
                                        <div className="task-text"><p>{task.text}</p></div>
                                        <div className="button-group">
                                          <button className='button-icon' onClick={() => handleEditTaskClick(task)}>
                                            <FontAwesomeIcon icon={faPen} />
                                          </button>
                                          <button className='button-icon' onClick={() => handleDeleteTask(board.id, task.id)}>
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "#ff0000" }} />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <Droppable droppableId={task.id} type="subtask">
                                  {(provided) => (
                                    <ul className="subtasks" ref={provided.innerRef} {...provided.droppableProps}>
                                      {task.subtasks.map((subtask, index) => (
                                        <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                          {(provided) => (
                                            <li
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              {subtask.text}
                                            </li>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                      {currentTaskId === task.id && (
                                        <>
                                          <input
                                            type="text"
                                            value={newSubtaskText}
                                            onChange={(e) => setNewSubtaskText(e.target.value)}
                                            placeholder='enter a subtask'
                                          />
                                          <button className='button-icon' onClick={() => handleAddSubtask(board.id, task.id)}>Save</button>
                                          <button className='button-icon' onClick={() => setCurrentTaskId(null)}>Cancel</button>
                                        </>
                                      )}
                                      <button className='button-icon' onClick={() => setCurrentTaskId(task.id)}>
                                        <FontAwesomeIcon icon={faPlus} /> Add Subtask
                                      </button>
                                    </ul>
                                  )}
                                </Droppable>
                                </>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <button className='button-icon' onClick={() => handleAddTask(board.id)}><FontAwesomeIcon icon={faPlus} /> Add a Card</button>
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Modal
        isOpen={isModalOpen}
        style={customStyles}
        contentLabel="Add Task"
      >
        <h1>Add a Task</h1>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter task description"
          className='modal-input'
        />
        <button className='button-modal-green' onClick={handleSaveTask}>Save Task</button>
        <button className='button-modal-red' onClick={() => setIsModalOpen(false) & setNewTaskText('')}>Cancel</button>
      </Modal>
    </>
  );
}

export default App;
