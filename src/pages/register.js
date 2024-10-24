import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '@/config/config';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [error, setError]=useState(null)
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
      // Send form data to the backend to register a user
      await axios.post(`${BACKEND_URL}/auth/signup`, formData);
      router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error.response?.data?.message);
      setError(error?.response?.data?.error)
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
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
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>
        <p>You have a account <button className="bg-green-400 text-white px-4 py-2 rounded" onClick={()=>{
            router.push('/login')
            
        }}>Login</button></p>
        <p>{error}</p>
      </form>
    </div>
  );
}
