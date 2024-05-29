import React from 'react'
import { useState, useEffect } from 'react'
import task from '../task'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'



const Home = () => {
    console.log("Inside the Home.jsx file")
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    
    useEffect(() => {
        fetchTasks();
    }, [selectedDate]);

    const fetchTasks = async () => {
        try {
            const response = await task.get(`/tasks/?date=${selectedDate.toISOString().split('T')[0]}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            // Handle errors appropriately here, e.g., set an error state, show a message, etc.
        }
    };

    // const fetchTasks = () => {
    //     task.get(`/tasks/?date=${selectedDate.toISOString().split('T')[0]}`)
    //     .then((res) => res.data)
    //     .then((data) => setTasks(data))
    //     .catch((err) => alert(`Failed to fetch tasks: ${err}`));
    // }

    // const fetchTasks = async () => {
    //     const response = await axios.get(`http://localhost:8000/tasks/?date=${selectedDate.toISOString().split('T')[0]}`);
    //     setTasks(response.data);
    // };


    const addTask = async () => {
        if (newTaskName.trim()) {
            const taskData = {
                title: newTaskName,
                completed: false,
                important: false,
                date_created: selectedDate.toISOString().split('T')[0] // Format the date to YYYY-MM-DD
            };
            try {
                await task.post('/tasks/', taskData);
                setNewTaskName(''); // Reset input after adding
                fetchTasks(); // Refresh the tasks list
            } catch (err) {
                console.error('Error adding task:', err);
                // Optionally, handle the error with user feedback
            }
        }
    };

    // const addTask = async () => {
    //     if (newTaskName.trim()) {
    //         const taskData = {
    //             title: newTaskName,
    //             completed: false,
    //             important: false,
    //             date_created: selectedDate.toISOString().split('T')[0] // Format the date to YYYY-MM-DD
    //         };
    //         await axios.post('http://localhost:8000/tasks/', taskData);
    //         setNewTaskName(''); // Reset input after adding
    //         fetchTasks(); // Refresh the tasks list
    //     }
    // };

    const deleteTask = async (id) => {
        try {
            await task.delete(`/tasks/${id}/`);
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
            // Optionally, handle the error with user feedback
        }
    };
    
    const toggleCompleted = async (task_instance) => {
        try {
            await task.patch(`/tasks/${task_instance.id}/`, { completed: !task_instance.completed });
            fetchTasks();
        } catch (err) {
            console.error('Error toggling task completion:', err);
            // Optionally, handle the error with user feedback
        }
    };
    
    const toggleImportant = async (task_instance) => {
        try {
            await task.patch(`/tasks/${task_instance.id}/`, { important: !task_instance.important });
            fetchTasks();
        } catch (err) {
            console.error('Error toggling task importance:', err);
            // Optionally, handle the error with user feedback
        }
    };

    // const deleteTask = async (id) => {
    //     await axios.delete(`http://localhost:8000/tasks/${id}/`);
    //     fetchTasks();
    // };

    // const toggleCompleted = async (task) => {
    //     await axios.patch(`http://localhost:8000/tasks/${task.id}/`, { completed: !task.completed });
    //     fetchTasks();
    // };

    // const toggleImportant = async (task) => {
    //     await axios.patch(`http://localhost:8000/tasks/${task.id}/`, { important: !task.important });
    //     fetchTasks();
    // };

    const StarIcon = ({ filled }) => (
        <svg
            className={`h-6 w-6 ${filled ? 'text-yellow-400' : 'text-gray-400'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            {filled ? (
                <path d="M12 .587l3.668 7.425 8.332 1.209-6.001 5.842 1.415 8.267L12 18.896l-7.414 3.896 1.415-8.267-6.001-5.842 8.332-1.209L12 .587z" />
            ) : (
                <path d="M12 4.248L14.142 9.66l5.858 0.85-4.243 4.134 1.002 5.845L12 18.018l-5.259 2.471 1.002-5.845-4.243-4.134 5.858-0.85L12 4.248M12 2l-3.162 6.4L2 8.847l4.909 4.78L7.236 22 12 19.276 16.764 22l-0.673-8.373L21 8.847l-6.838-0.447L12 2z" />

            )}
        </svg>
    );
    

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>

            <div className="mb-4 flex justify-between items-center">
                <div className="flex-1 mr-2">
                    <input 
                        type="text" 
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Enter task name"
                        className="w-full p-2 border border-gray-300 rounded shadow"
                    />
                    <button 
                        onClick={() => addTask()}
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Task
                    </button>
                </div>
                <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border border-gray-300 rounded shadow"
                />
            </div>

            {tasks.map(task_instance => (
                <div key={task_instance.id} className="flex items-center justify-between bg-gray-100 p-3 rounded mb-2">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={task_instance.completed} 
                            onChange={() => toggleCompleted(task_instance)} 
                            className="mr-2"
                        />
                        <span className={task_instance.completed ? "line-through" : ""}>
                            {task_instance.title}
                        </span>
                    </div>

                    <div className='flex items-center'>
                        <button
                            onClick={() => toggleImportant(task_instance)}
                            
                        >
                            <StarIcon filled={task_instance.important} />
                        </button>

                        <button 
                            onClick={() => deleteTask(task_instance.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        >
                            Delete
                        </button>


                    </div>
                    
                </div>
            ))}
        </div>
    );

}

export default Home;


// function App() {
//     const [tasks, setTasks] = useState([]);
//     const [newTaskName, setNewTaskName] = useState('')
//     const [selectedDate, setSelectedDate] = useState(new Date())
    
//     useEffect(() => {
//         fetchTasks();
//     }, [selectedDate]);

//     const fetchTasks = async () => {
//         const response = await axios.get(`http://localhost:8000/tasks/?date=${selectedDate.toISOString().split('T')[0]}`);
//         setTasks(response.data);
//     };

//     const addTask = async () => {
//         if (newTaskName.trim()) {
//             const taskData = {
//                 title: newTaskName,
//                 completed: false,
//                 important: false,
//                 date_created: selectedDate.toISOString().split('T')[0] // Format the date to YYYY-MM-DD
//             };
//             await axios.post('http://localhost:8000/tasks/', taskData);
//             setNewTaskName(''); // Reset input after adding
//             fetchTasks(); // Refresh the tasks list
//         }
//     };

//     const deleteTask = async (id) => {
//         await axios.delete(`http://localhost:8000/tasks/${id}/`);
//         fetchTasks();
//     };

//     const toggleCompleted = async (task) => {
//         await axios.patch(`http://localhost:8000/tasks/${task.id}/`, { completed: !task.completed });
//         fetchTasks();
//     };

//     const toggleImportant = async (task) => {
//         await axios.patch(`http://localhost:8000/tasks/${task.id}/`, { important: !task.important });
//         fetchTasks();
//     };

//     const StarIcon = ({ filled }) => (
//         <svg
//             className={`h-6 w-6 ${filled ? 'text-yellow-400' : 'text-gray-400'}`}
//             fill="currentColor"
//             viewBox="0 0 24 24"
//         >
//             {filled ? (
//                 <path d="M12 .587l3.668 7.425 8.332 1.209-6.001 5.842 1.415 8.267L12 18.896l-7.414 3.896 1.415-8.267-6.001-5.842 8.332-1.209L12 .587z" />
//             ) : (
//                 <path d="M12 4.248L14.142 9.66l5.858 0.85-4.243 4.134 1.002 5.845L12 18.018l-5.259 2.471 1.002-5.845-4.243-4.134 5.858-0.85L12 4.248M12 2l-3.162 6.4L2 8.847l4.909 4.78L7.236 22 12 19.276 16.764 22l-0.673-8.373L21 8.847l-6.838-0.447L12 2z" />

//             )}
//         </svg>
//     );

//     return (
//         <div className="max-w-4xl mx-auto p-5">
//             <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>

//             <div className="mb-4 flex justify-between items-center">
//                 <div className="flex-1 mr-2">
//                     <input 
//                         type="text" 
//                         value={newTaskName}
//                         onChange={(e) => setNewTaskName(e.target.value)}
//                         placeholder="Enter task name"
//                         className="w-full p-2 border border-gray-300 rounded shadow"
//                     />
//                     <button 
//                         onClick={() => addTask()}
//                         className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                     >
//                         Add Task
//                     </button>
//                 </div>
//                 <DatePicker
//                     selected={selectedDate}
//                     onChange={date => setSelectedDate(date)}
//                     dateFormat="yyyy-MM-dd"
//                     className="p-2 border border-gray-300 rounded shadow"
//                 />
//             </div>

//             {tasks.map(task => (
//                 <div key={task.id} className="flex items-center justify-between bg-gray-100 p-3 rounded mb-2">
//                     <div className="flex items-center">
//                         <input 
//                             type="checkbox" 
//                             checked={task.completed} 
//                             onChange={() => toggleCompleted(task)} 
//                             className="mr-2"
//                         />
//                         <span className={task.completed ? "line-through" : ""}>
//                             {task.title}
//                         </span>
//                     </div>

//                     <div className='flex items-center'>
//                         <button
//                             onClick={() => toggleImportant(task)}
                            
//                         >
//                             <StarIcon filled={task.important} />
//                         </button>

//                         <button 
//                             onClick={() => deleteTask(task.id)}
//                             className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//                         >
//                             Delete
//                         </button>


//                     </div>
                    
//                 </div>
//             ))}
//         </div>
//     );
    
// }

// export default App;