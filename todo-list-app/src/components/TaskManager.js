// USE STATE, USE EFFECT, USE MEMO, USE CALLBACK, USE REF
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTaskContext } from "../context/TaskContext";
import "../../src/App.css";

const TaskManager = () => {
  const { state: tasks, dispatch } = useTaskContext();
  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      savedTasks.forEach((task) =>
        dispatch({ type: "ADD_TASK", payload: task })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(() => {
    if (!taskText.trim()) {
      alert("Please enter a task!");
      return;
    }

    const newTask = { id: Date.now(), text: taskText, completed: false };
    dispatch({ type: "ADD_TASK", payload: newTask });
    setTaskText("");
    inputRef.current.focus();
  }, [dispatch, taskText]);

  const deleteTask = useCallback(
    (id) => {
      dispatch({ type: "DELETE_TASK", payload: { id } });
    },
    [dispatch]
  );

  const filteredTasks = useMemo(() => {
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    } else if (filter === "incomplete") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const completeTask = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE_TASK", payload: { id } });
    },
    [dispatch]
  );

  return (
    <div className="task-manager">
      <h1 className="header">To-Do List</h1>
      <div className="flex">
        <input
          className="input-text "
          ref={inputRef}
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="add-button" onClick={addTask}>
          Add Task
        </button>
      </div>
      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "incomplete" ? "active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
            <div className="flex">
              {!task.completed && (
                <button
                  className="complete-button"
                  onClick={() => completeTask(task.id)}
                >
                  Complete
                </button>
              )}
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
