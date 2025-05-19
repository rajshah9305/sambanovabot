import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiDatabase,
  FiSettings,
  FiX,
  FiPlus,
  FiZap,
  FiBook,
  FiHelpCircle
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  // Navigation items
  const mainNavItems = [
    { path: '/', icon: <FiHome className="w-5 h-5" />, label: 'Dashboard', exact: true },
    { path: '/agents', icon: <FiUsers className="w-5 h-5" />, label: 'Agents' },
    { path: '/conversations', icon: <FiMessageSquare className="w-5 h-5" />, label: 'Conversations' },
    { path: '/knowledge-bases', icon: <FiDatabase className="w-5 h-5" />, label: 'Knowledge Bases' },
  ];

  const secondaryNavItems = [
    { path: '/settings', icon: <FiSettings className="w-5 h-5" />, label: 'Settings' },
    { path: '/documentation', icon: <FiBook className="w-5 h-5" />, label: 'Documentation' },
    { path: '/help', icon: <FiHelpCircle className="w-5 h-5" />, label: 'Help & Support' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 z-30 flex-shrink-0 w-64 overflow-y-auto bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 md:static md:block transition-all duration-300 ease-in-out ${
        isOpen ? 'left-0' : '-left-64 md:left-0'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header - Mobile only */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <NavLink to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white mr-2">
              <span className="font-bold">S</span>
            </div>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              SambaNova AI
            </span>
          </NavLink>
          <button
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                  }`
                }
              >
                <span className={`mr-3 transition-colors duration-200 ${
                  item.path === location.pathname
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-1">
              <NavLink
                to="/conversations/new"
                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all duration-200 group"
              >
                <span className="mr-3 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                  <FiZap className="w-5 h-5" />
                </span>
                <span>New Conversation</span>
              </NavLink>
              <NavLink
                to="/agents/create"
                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all duration-200 group"
              >
                <span className="mr-3 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                  <FiPlus className="w-5 h-5" />
                </span>
                <span>Create Agent</span>
              </NavLink>
            </div>
          </div>

          {/* Secondary navigation */}
          <div className="mt-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Support
              </h3>
            </div>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                    }`
                  }
                >
                  <span className={`mr-3 transition-colors duration-200 ${
                    item.path === location.pathname
                      ? 'text-neutral-700 dark:text-neutral-300'
                      : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
