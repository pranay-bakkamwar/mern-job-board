import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
      <p className="text-blue-600 font-medium mb-2">{job.employer?.company || 'Company'}</p>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
        {job.location}
      </div>
      <p className="text-gray-700 font-semibold mb-4">{job.salary}</p>
      <Link 
        to={`/jobs/${job._id}`} 
        className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;