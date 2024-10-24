import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BACKEND_URL } from '@/config/config';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [error,setError]=useState(null)
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile info for pre-filling the form
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token){
            router.push("/login")
        }
        const { data } = await axios.get(`${BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ username: data.username, password: '', role: data.role });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/');
      alert("Profile Updated")
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error?.response?.data?.error)
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
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
          Save Changes
        </button>
      <p>  {error}</p>
      </form>
    </div>
  );
}
