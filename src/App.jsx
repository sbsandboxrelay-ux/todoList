import React from "react";
import supabase from "./supabase-client.js";
const App = () => {
  const [tasks, setTasks] = React.useState([]);
  const [task, setTask] = React.useState("");
  const [editingId, setEditingId] = React.useState(null);
  const [editedName, setEditedName] = React.useState("");

  React.useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("todo_list").select("*");
      setTasks(data || []);
    };

    fetchTasks();
  }, []);

  const addTasks = async () => {
    // console.log("Adding task:", task);
    const newTodoData = {
      name: task,
      isCompleted: false,
    };

    const { data, error } = await supabase
      .from("todo_list")
      .insert([newTodoData])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
    } else {
      setTasks((prev) => [...prev, data]);
      setTask(""); // Clear the input field after adding the task
      console.log(tasks);
      console.log("Task added successfully:", data);
    }
  };

  const editTask = async (id, newName) => {
    if (!newName.trim()) return;
    const { data, error } = await supabase
      .from("todo_list")
      .update({ name: newName })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks((prev) => prev.map((item) => (item.id === id ? data : item)));

      setEditingId(null);
      setEditedName("");
    }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("todo_list")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks((prev) => prev.filter((item) => item.id !== id));
      alert("Task deleted successfully");
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    const { data, error } = await supabase
      .from("todo_list")
      .update({ isCompleted: !currentStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling task completion:", error);
    } else {
      setTasks((prev) => prev.map((item) => (item.id === id ? data : item)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-5">ToDo-List</h1>

        {/* input box */}
        <div className="flex gap-2">
          <input
            onChange={(e) => setTask(e.target.value)}
            value={task}
            type="text"
            placeholder="Add a task"
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={addTasks}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* list section */}
        <div className="mt-5 ">
          <ul className="space-y-2 max-h-80 overflow-y-auto ">
            {tasks.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm"
              >
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 bg-white border-blue-400 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
                      autoFocus
                    />
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => editTask(item.id, editedName)}
                        className="bg-green-600 hover:bg-green-700 px-2.5 py-1 rounded-lg text-white cursor-pointer"
                      >
                        save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-400 hover:bg-slate-500 px-2.5 py-1 rounded-lg text-white cursor-pointer"
                      >
                        cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 flex-1">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() =>
                          toggleComplete(item.id, item.isCompleted)
                        }
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span
                        className={
                          item.isCompleted
                            ? "line-through text-slate-400"
                            : "text-slate-700"
                        }
                      >
                        {item.name}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditedName(item.name);
                        }}
                        className="bg-gray-400 hover:bg-gray-600 px-2.5 py-1 rounded-lg text-white cursor-pointer"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteTask(item.id)}
                      className="bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg text-white cursor-pointer"
                      >Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
