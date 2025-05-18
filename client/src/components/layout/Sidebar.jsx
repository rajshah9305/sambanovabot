import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiMessageSquare, FiDatabase, FiSettings, FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-30 flex-shrink-0 w-64 overflow-y-auto bg-white dark:bg-gray-800 md:static md:block transition-all duration-300 ease-in-out ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 py-2 md:hidden">
            <NavLink to="/" className="text-lg font-bold text-gray-800 dark:text-gray-200">
              SambaNova AI
            </NavLink>
            <button
              className="p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar links */}
          <nav className="mt-6">
            <div className="px-6 py-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                end
              >
                <FiHome className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/agents"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiUsers className="w-5 h-5 mr-3" />
                <span>Agents</span>
              </NavLink>

              <NavLink
                to="/conversations"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiMessageSquare className="w-5 h-5 mr-3" />
                <span>Conversations</span>
              </NavLink>

              <NavLink
                to="/knowledge-bases"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiDatabase className="w-5 h-5 mr-3" />
                <span>Knowledge Bases</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <FiSettings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </NavLink>
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="px-6 my-6">
            <NavLink
              to="/agents/create"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-primary-600 border border-transparent rounded-lg active:bg-primary-700 hover:bg-primary-700 focus:outline-none focus:shadow-outline-purple"
            >
              Create New Agent
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
