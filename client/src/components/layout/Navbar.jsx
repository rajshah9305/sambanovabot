import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
  FiUser,
  FiPlus,
  FiMessageSquare,
  FiSearch
} from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const Navbar = ({ toggleSidebar, isScrolled }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md shadow-md'
          : 'bg-white dark:bg-neutral-800'
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6 mx-auto">
        <div className="flex items-center">
          {/* Mobile hamburger */}
          <button
            className="p-2 mr-3 rounded-lg md:hidden hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <FiMenu className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white mr-2">
              <span className="font-bold">S</span>
            </div>
            <span className="text-lg font-bold text-neutral-900 dark:text-white hidden md:block">
              SambaNova AI
            </span>
          </Link>
        </div>

        {/* Search bar */}
        <div className={`hidden md:flex relative mx-4 flex-1 max-w-md transition-all duration-200 ${
          searchFocused ? 'scale-105' : ''
        }`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </div>
            <input
              type="search"
              className="w-full py-2 pl-10 pr-4 text-sm bg-neutral-100 dark:bg-neutral-700/50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
              placeholder="Search conversations..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Quick actions */}
          <div className="hidden md:flex items-center mr-2">
            <Link
              to="/conversations/new"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors duration-200 flex items-center"
              title="New Conversation"
            >
              <FiMessageSquare className="w-5 h-5" />
            </Link>
            <Link
              to="/agents/create"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors duration-200 flex items-center"
              title="Create Agent"
            >
              <FiPlus className="w-5 h-5" />
            </Link>
          </div>

          {/* Theme toggle */}
          <button
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
            onClick={toggleTheme}
            aria-label="Toggle color mode"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5 text-neutral-200" />
            ) : (
              <FiMoon className="w-5 h-5 text-neutral-700" />
            )}
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center p-1 rounded-full hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-neutral-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-200'
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <FiUser className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-200'
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <FiSettings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1 border-t border-neutral-200 dark:border-neutral-700">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-200'
                        } group flex items-center w-full px-4 py-2 text-sm`}
                      >
                        <FiLogOut className="w-4 h-4 mr-3" />
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
