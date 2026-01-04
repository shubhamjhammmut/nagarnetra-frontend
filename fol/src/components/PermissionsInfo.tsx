import { Shield, AlertCircle, CheckCircle, Info, User as UserIcon } from 'lucide-react';

interface User {
  role: 'citizen' | 'admin';
}

interface PermissionsInfoProps {
  user: User;
}

export function PermissionsInfo({ user }: PermissionsInfoProps) {
  const citizenPermissions = [
    { label: 'Report civic issues', granted: true },
    { label: 'Track own issues', granted: true },
    { label: 'View own issue status', granted: true },
    { label: 'Upload photos of issues', granted: true },
    { label: 'View all issues area-wise', granted: false },
    { label: 'Access admin dashboard', granted: false },
    { label: 'Manage all issues', granted: false },
    { label: 'View analytics', granted: false },
  ];

  const adminPermissions = [
    { label: 'Track all issues area-wise', granted: true },
    { label: 'View all public issues', granted: true },
    { label: 'Access admin dashboard', granted: true },
    { label: 'Manage all issues', granted: true },
    { label: 'View analytics & reports', granted: true },
    { label: 'Assign issues to teams', granted: true },
    { label: 'Update issue status', granted: true },
    { label: 'View issue reporter details', granted: true },
    { label: 'Report new issues', granted: false },
    { label: 'Upload photos', granted: false },
  ];

  const permissions = user.role === 'admin' ? adminPermissions : citizenPermissions;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        {user.role === 'admin' ? (
          <div className="bg-blue-100 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
        ) : (
          <div className="bg-green-100 p-3 rounded-lg">
            <UserIcon className="w-6 h-6 text-green-600" />
          </div>
        )}
        <div>
          <h3 className="text-gray-900">
            {user.role === 'admin' ? 'Administrator' : 'Citizen'} Permissions
          </h3>
          <p className="text-sm text-gray-500">
            Your current access level and capabilities
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {permissions.map((permission, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              permission.granted
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {permission.granted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span
              className={`text-sm ${
                permission.granted ? 'text-green-900' : 'text-gray-500'
              }`}
            >
              {permission.label}
            </span>
          </div>
        ))}
      </div>

      {user.role === 'citizen' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 mb-1">
              <strong>Need Admin Access?</strong>
            </p>
            <p className="text-xs text-blue-700">
              Contact your local government office to request administrator privileges. 
              For demo purposes, you can logout and login with the admin demo account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}