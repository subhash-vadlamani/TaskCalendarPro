import {useState} from "react"
import task from '../task'
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function Form({route, method}){
    const [username, setUsername] = useState("")

    const[password, setPassword] = useState("")
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const fullUrl = `${task.defaults.baseURL}${route}`;

        try {

            console.log("Sending request to URL:", fullUrl); // Log the full URL
            console.log("API config:", task); // This will log the entire Axios instance configuration

            const res = await task.post(route, {username, password})
            console.log(res)
            if (method === 'login'){
                console.log("The access token is as follows: " + res.data.access)
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate('/')
            }
            else{
                navigate('/login')
            }
            
        } catch (error) {
            alert(error)
            
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center my-12 mx-auto p-5 rounded-lg shadow-md max-w-sm">
            <h1>{name}</h1>
            <input
                className="w-11/12 p-2.5 my-2 border border-gray-300 rounded-md" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
    
            <input
                className="w-11/12 p-2.5 my-2 border border-gray-300 rounded-md"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
    
            <button className="w-11/12 py-2.5 my-5 bg-blue-600 text-white rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-700" type="submit">
                {name}
            </button>
        </form>
    );
    

}

export default Form