import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      setError('Only candidates can apply for jobs.');
      return;
    }
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }
    setApplyLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      await API.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Application submitted successfully!');
      setCoverLetter('');
      setResumeFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;
  if (!job) return <div className="container mx-auto p-6">Job not found.</div>;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-lg text-gray-700 mb-1">{job.employer?.company}</p>
        <p className="text-gray-600 mb-1">{job.location}</p>
        <p className="text-gray-800 font-medium mb-4">{job.salary} • {job.type}</p>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        {user?.role === 'candidate' && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Apply for this position</h3>
            {success && <p className="text-green-600 mb-3">{success}</p>}
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Cover Letter (Optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Resume (PDF/DOCX) *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={applyLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="mt-6 border-t pt-6 text-center">
            <p className="mb-3">Please login as a candidate to apply.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;