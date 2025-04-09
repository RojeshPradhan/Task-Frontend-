import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tasks, Task } from "../services/api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export default function Tasks() {
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasks.getAll();
      setTaskList(response);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch tasks");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setLoading(true);
    try {
      const response = await tasks.create(newTask.title, newTask.description);
      alert(response.message);
      setTaskList([...taskList, response.task]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message ?? "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await tasks.delete(id);
      setTaskList(taskList.filter((task) => task.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message ?? "Failed to delete task");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-800">Your Tasks</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          Add New Task
        </h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              required
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              rows={3}
              placeholder="Enter task description"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium transition duration-150"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {taskList.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md border border-indigo-100">
            <svg
              className="mx-auto h-12 w-12 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
          </div>
        ) : (
          taskList.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-lg shadow-md border border-indigo-100 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-indigo-800">
                  {task.title}
                </h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
              </div>
              <div className="flex space-x-3 ml-6">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-4 py-1.5 rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
