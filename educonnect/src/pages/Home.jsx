import { Link } from 'react-router-dom';
import { FiBook, FiCode, FiZap, FiKey, FiUser, FiFileText, FiInstagram, FiYoutube } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Accelerate Your<br />
              <span className="text-cyan-400">Tech Journey</span><br />
              to <span className="text-lime-400">Success</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Welcome to EduConnect — where your coding journey takes off! Practice DSA problems, build System Designs expertise, and level up for your dream tech role.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
              <FiBook className="text-xl" /> Start Learning
            </Link>
          </div>

          {/* Right - Code Editor Simulation */}
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative">
            {/* macOS dots */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="flex-1 text-center text-gray-400 text-sm font-mono">success.js</span>
            </div>
            
            <div className="p-6 relative">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  <span className="text-blue-400">class</span> <span className="text-yellow-300">TechJourney</span> {'{'}
                  {`\n  `}<span className="text-cyan-400">constructor</span>() {'{'}
                  {`\n    `}<span className="text-gray-500">this</span>.skills = [];
                  {`\n  `}{'}'}
                  {`\n\n  `}<span className="text-cyan-400">masterDSA</span>() {'{'}
                  {`\n    `}<span className="text-purple-400">return</span> <span className="text-orange-300">'Problem Solving Skills'</span>;
                  {`\n  `}{'}'}
                  {`\n\n  `}<span className="text-cyan-400">designSystems</span>() {'{'}
                  {`\n    `}<span className="text-purple-400">return</span> <span className="text-orange-300">'Architecture Excellence'</span>;
                  {`\n  `}{'}'}
                  {`\n\n  `}<span className="text-cyan-400">achieveSuccess</span>() {'{'}
                  {`\n    `}<span className="text-purple-400">return</span> <span className="text-orange-300">'Dream Job Unlocked!'</span>;
                  {`\n  `}{'}'}
                  {`\n`}{'}'}
                </code>
              </pre>
              <FiZap className="absolute top-4 right-4 text-purple-500 text-3xl opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-2 rounded-full bg-red-500"></div>
                  <div className="w-8 h-2 rounded-full bg-cyan-500"></div>
                  <div className="w-8 h-2 rounded-full bg-green-500"></div>
                </div>
                <span className="text-white font-bold text-xl">EduConnect</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/login" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-white transition">
                  <FiInstagram className="text-gray-400 hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-white transition">
                  <FiYoutube className="text-gray-400 hover:text-white" />
                </a>
              </div>
              <p className="text-gray-400 text-sm">Join our community for coding tips, tutorials, and updates!</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2025 EduConnect. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
