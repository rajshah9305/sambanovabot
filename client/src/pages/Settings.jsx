import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiSun, FiMoon } from 'react-icons/fi';

// Profile form validation schema
const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});

// Password form validation schema
const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Settings = () => {
  const { user, updateProfile, changePassword, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Handle profile update
  const onProfileSubmit = async (data) => {
    setIsProfileLoading(true);
    setProfileSuccess(false);
    
    const success = await updateProfile(data);
    
    setIsProfileLoading(false);
    if (success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    setPasswordSuccess(false);
    
    const success = await changePassword(data.currentPassword, data.newPassword);
    
    setIsPasswordLoading(false);
    if (success) {
      setPasswordSuccess(true);
      resetPasswordForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'password'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'appearance'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Profile Information
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
                  <FiAlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiUser className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...registerProfile('name')}
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                        profileErrors.name ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.name.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiMail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...registerProfile('email')}
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                        profileErrors.email ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{profileErrors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProfileLoading}
                >
                  {isProfileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Change Password
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
                  <FiAlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                  Password changed successfully!
                </div>
              )}

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...registerPassword('currentPassword')}
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                        passwordErrors.currentPassword ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...registerPassword('newPassword')}
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                        passwordErrors.newPassword ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...registerPassword('confirmPassword')}
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                        passwordErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Appearance
              </h2>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      theme === 'light'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <FiSun className="w-6 h-6 text-gray-800 mb-2" />
                      <span className="text-sm font-medium text-gray-800">Light</span>
                    </div>
                  </button>

                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`flex items-center justify-center p-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <FiMoon className="w-6 h-6 text-gray-800 dark:text-gray-200 mb-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Dark
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
