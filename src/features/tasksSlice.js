import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: [
    {
      id: 'board-1',
      title: 'Board 1',
      tasks: []
    },
  ]
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
    addTask: (state, action) => {
      const { boardId, task } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        board.tasks.push(task);
      }
    },
    updateTask: (state, action) => {
      const { boardId, taskId, newText } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        const task = board.tasks.find(task => task.id === taskId);
        if (task) {
          task.text = newText;
        }
      }
    },
    deleteTask: (state, action) => {
      const { boardId, taskId } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        board.tasks = board.tasks.filter(task => task.id !== taskId);
      }
    },
    reorderTasks: (state, action) => {
      const { boardId, sourceIndex, destinationIndex } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        const [movedTask] = board.tasks.splice(sourceIndex, 1);
        board.tasks.splice(destinationIndex, 0, movedTask);
      }
    },
    moveTask: (state, action) => {
      const { sourceBoardId, destinationBoardId, taskId, destinationIndex } = action.payload;
      const sourceBoard = state.boards.find(board => board.id === sourceBoardId);
      const destinationBoard = state.boards.find(board => board.id === destinationBoardId);
      if (sourceBoard && destinationBoard) {
        const [movedTask] = sourceBoard.tasks.splice(sourceBoard.tasks.findIndex(task => task.id === taskId), 1);
        destinationBoard.tasks.splice(destinationIndex, 0, movedTask);
      }
    },
    addSubtask: (state, action) => {
      const { boardId, taskId, subtask } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        const task = board.tasks.find(task => task.id === taskId);
        if (task) {
          task.subtasks.push(subtask);
        }
      }
    },
    reorderSubtasks: (state, action) => {
      const { boardId, taskId, sourceIndex, destinationIndex } = action.payload;
      const board = state.boards.find(board => board.id === boardId);
      if (board) {
        const task = board.tasks.find(task => task.id === taskId);
        if (task) {
          const [movedSubtask] = task.subtasks.splice(sourceIndex, 1);
          task.subtasks.splice(destinationIndex, 0, movedSubtask);
        }
      }
    },
    moveSubtask: (state, action) => {
      const { sourceBoardId, sourceTaskId, destinationBoardId, destinationTaskId, subtaskId, destinationIndex } = action.payload;
      const sourceBoard = state.boards.find(board => board.id === sourceBoardId);
      const destinationBoard = state.boards.find(board => board.id === destinationBoardId);
      if (sourceBoard && destinationBoard) {
        const sourceTask = sourceBoard.tasks.find(task => task.id === sourceTaskId);
        const destinationTask = destinationBoard.tasks.find(task => task.id === destinationTaskId);
        if (sourceTask && destinationTask) {
          const [movedSubtask] = sourceTask.subtasks.splice(sourceTask.subtasks.findIndex(subtask => subtask.id === subtaskId), 1);
          destinationTask.subtasks.splice(destinationIndex, 0, movedSubtask);
        }
      }
    }
  }
});

export const { setBoards, addTask, updateTask, deleteTask, reorderTasks, moveTask, addSubtask, reorderSubtasks, moveSubtask } = tasksSlice.actions;
export default tasksSlice.reducer;
