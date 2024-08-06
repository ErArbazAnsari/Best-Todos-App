import React, { useState, useEffect } from "react";
import "./todos.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

function Todos() {
    // Today Date & Time
    const date = new Date();
    const [todayDate, setTodayDate] = useState(date.toDateString());
    const [currentTime, setCurrentTime] = useState(date.toLocaleTimeString());

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Update date every day
    useEffect(() => {
        const interval = setInterval(() => {
            setTodayDate(new Date().toDateString());
        }, 86400000); // Update every day

        return () => clearInterval(interval);
    }, []);

    // Retrieve todos from local storage
    const getStoredTodos = () => {
        const storedTodos = localStorage.getItem("todos");
        return storedTodos ? JSON.parse(storedTodos) : [];
    };

    // Todos Input Section
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState(getStoredTodos());
    const [message, setMessage] = useState(""); // Message state for showing alerts

    // Save todos to local storage
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    // Function to handle adding new todo
    const handleAddTodo = () => {
        if (inputValue) {
            // Check if the todo already exists
            const todoExists = todos.some(
                (todo) => todo.text.toLowerCase() === inputValue.toLowerCase()
            );

            if (todoExists) {
                setMessage("Todo already present!");
            } else {
                setTodos([...todos, { text: inputValue, done: false }]);
                setInputValue("");
                setMessage(""); // Clear message
            }
        }
    };

    // Function to handle toggling the done state of a todo
    const handleTodoDone = (index) => {
        const updatedTodos = todos.map((todo, i) =>
            i === index ? { ...todo, done: !todo.done } : todo
        );
        setTodos(updatedTodos);
    };

    // Function to handle deleting a todo
    const handleTodoDelete = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    return (
        <div>
            <div className="todos-container">
                <header>
                    <h1>myTodos App</h1>
                </header>

                {/* Todos Date & Time Section */}
                <div className="todos-date-time flex flex-col gap-3 mt-5">
                    <h3 className="inline-block text-2xl">{todayDate}</h3>
                    <h3 className="inline-block text-2xl">{currentTime}</h3>
                </div>

                {/* Display message if any */}
                {message && <div className="message">{message}</div>}

                {/* Todos Input Section */}
                <section className="form">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTodo();
                        }}
                    >
                        <input
                            className="todo-input"
                            type="text"
                            id="input-data"
                            style={{ color: "black" }}
                            autoComplete="off"
                            placeholder="Add a new todo"
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="todo-btn">
                            Add Todo
                        </button>
                    </form>

                    {/* Todos List Section */}
                    <section className="todos-list">
                        {todos.length > 0 &&
                            todos.map((todo, index) => (
                                <div key={index} className="flex">
                                    <li
                                        className={`todo-item ${
                                            todo.done ? "done" : ""
                                        }`}
                                        style={{
                                            color: todo.done
                                                ? "green"
                                                : "black",
                                            textDecoration: todo.done
                                                ? "line-through"
                                                : "none",
                                        }}
                                    >
                                        {todo.text}
                                    </li>
                                    <span
                                        className={`check-btn ${
                                            todo.done ? "done" : ""
                                        }`}
                                        onClick={() => handleTodoDone(index)}
                                    >
                                        <FaRegCheckCircle />
                                    </span>
                                    <span
                                        className="delete-btn"
                                        onClick={() => handleTodoDelete(index)}
                                    >
                                        <MdOutlineDelete />
                                    </span>
                                </div>
                            ))}
                    </section>

                    {/* Clear All Todos Button */}
                    {todos.length > 0 && (
                        <button
                            className="clear-btn active:bg-red-400 mt-2"
                            onClick={() => {
                                setTodos([]);
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Todos;
