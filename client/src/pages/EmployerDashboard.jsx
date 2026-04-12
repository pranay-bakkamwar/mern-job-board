import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full-time',
  });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        API.get('/users/profile'),
        API.get('/jobs'),
      ]);
      setProfile(profileRes.data);
      const myJobs = jobsRes.data.filter(job => job.employer?._id === user._id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Error fetching employer data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    try {
      await API.post('/jobs', formData);
      setSubmitSuccess('Job posted successfully!');
      setFormData({ title: '', description: '', location: '', salary: '', type: 'Full-time' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to post job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  if (loading) return <div className="container mx-auto p-6">Loading dashboard...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
          {submitError && <p className="text-red-500 mb-3">{submitError}</p>}
          {submitSuccess && <p className="text-green-600 mb-3">{submitSuccess}</p>}
          <form onSubmit={handlePostJob} className="space-y-4">
            <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
            <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows="4" required />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="salary" placeholder="Salary (e.g., 10-15 LPA)" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" />
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Post Job</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Company Profile</h2>
        <p><span className="font-medium">Company:</span> {profile?.company}</p>
        <p><span className="font-medium">Contact Email:</span> {profile?.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Jobs Posted by You</h2>
        {jobs.length === 0 ? (
          <p className="p-6 text-gray-500">You haven't posted any jobs yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Location</th>
                <th className="text-left p-4">Posted On</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t">
                  <td className="p-4">
                    <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                      {job.title}
                    </Link>
                  </td>
                  <td className="p-4">{job.location}</td>
                  <td className="p-4">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;