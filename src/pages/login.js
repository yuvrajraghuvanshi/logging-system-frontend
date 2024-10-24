import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '@/config/config';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error,setError]=useState(null)
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BACKEND_URL}/auth/login`, formData);
      localStorage.setItem('token', data.token); // Store JWT in localStorage
      router.push('/');
      alert("Login Successful")
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error?.response?.data?.error)
      
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border"
            required
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <p>Don&apos;t have a account <button className="bg-green-400 text-white px-4 py-2 rounded" onClick={()=>{
            router.push('/register')
          
        }}>Register</button></p>
       <p> {error}</p>
      </form>
    </div>
  );
}
