import LogFilter from "@/components/LogsFiltered";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const exportToCSV = () => {
    const headers = ['Action Type', 'Timestamp', 'User ID', 'Role'];
    const csvRows = logs.map(log => [
      log.actionType,
      new Date(log.timestamp).toLocaleString(),
      log.userId,
      log.role,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n'; 
    csvContent += csvRows.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'logs.csv');
    document.body.appendChild(link); 
    link.click();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login"); // Redirect to login if not authenticated
        }

        const { data: userProfile } = await axios.get(
          `${BACKEND_URL}/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userProfile);
        const { data } = await axios.get(`${BACKEND_URL}/logs?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredLogs(data.logs);
        console.log(data);
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching logs:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      }
    };
    fetchLogs();
  }, [page]);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const handleDeleteUser = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BACKEND_URL}/auth/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        router.push("/register"); // Redirect after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);
  return (
    <>
      <div className="container mx-auto">
        {user && (
          <div className="bg-white shadow-md p-4 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-2">Profile</h2>
            <p className="mb-2">Username: {user.username}</p>
            <p className="mb-2">Role: {user.role}</p>
            <div className="flex space-x-4">
              <button
                onClick={handleEditProfile}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Account
              </button>
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">User Logs</h1>
        <LogFilter logs={logs} setFilteredLogs={setFilteredLogs} />
        <button onClick={exportToCSV} className="bg-red-500 text-white my-1 px-1 py-1 rounded">Export to CSV</button>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Action Type</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs
              ? filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="border px-4 py-2">{log.userId}</td>
                    <td className="border px-4 py-2">{log.actionType}</td>
                    <td className="border px-4 py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{log.role}</td>
                    <td className="border px-4 py-2">{log.metadata.message}</td>
                  </tr>
                ))
              : logs.map((log) => (
                  <tr key={log._id}>
                    <td className="border px-4 py-2">{log.userId}</td>
                    <td className="border px-4 py-2">{log.actionType}</td>
                    <td className="border px-4 py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{log.role}</td>
                    <td className="border px-4 py-2">{log.metadata.message}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
