// USE CONTEXT
import React, { createContext, useContext, useReducer } from "react";
import taskReducer from "../hooks/taskReducer";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);

export { TaskProvider, useTaskContext };
