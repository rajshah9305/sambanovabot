import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-gray-200 hidden md:block"
        >
          SambaNova AI
        </Link>

        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            className="rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleTheme}
            aria-label="Toggle color mode"
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5 text-gray-300" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* User menu */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none">
                <span className="mr-2">{user?.name}</span>
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <FiSettings className="w-5 h-5 mr-2" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <FiLogOut className="w-5 h-5 mr-2" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
