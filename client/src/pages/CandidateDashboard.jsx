import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes] = await Promise.all([
          API.get('/users/profile'),
          API.get('/applications'),
        ]);
        setProfile(profileRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Loading dashboard...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <p><span className="font-medium">Name:</span> {profile?.name}</p>
          <p><span className="font-medium">Email:</span> {profile?.email}</p>
          <p><span className="font-medium">Role:</span> Candidate</p>
          {profile?.skills?.length > 0 && (
            <p><span className="font-medium">Skills:</span> {profile.skills.join(', ')}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Application Summary</h2>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
          <p className="text-gray-600">Total Applications</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Your Applications</h2>
        {applications.length === 0 ? (
          <p className="p-6 text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Job Title</th>
                <th className="text-left p-4">Company</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="p-4">{app.job?.title}</td>
                  <td className="p-4">{app.job?.employer?.company || 'N/A'}</td>
                  <td className="p-4 capitalize">{app.status}</td>
                  <td className="p-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;