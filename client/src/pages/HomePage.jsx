import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import JobCard from '../components/JobCard';

const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await API.get('/jobs');
      setFeaturedJobs(data.slice(0, 4));
    };
    fetchJobs();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Find Your <span className="text-blue-600">Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities tailored just for you.
          </p>
          <Link to="/jobs" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            Explore Jobs →
          </Link>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            View All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;