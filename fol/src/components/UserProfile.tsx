import { User as UserIcon, Mail, Shield, Calendar, MapPin } from 'lucide-react';
import { PermissionsInfo } from './PermissionsInfo';

interface User {
  email: string;
  name: string;
  role: 'citizen' | 'admin';
}

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              user.role === 'admin' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {user.role === 'admin' ? (
                <Shield className="w-12 h-12 text-blue-600" />
              ) : (
                <UserIcon className="w-12 h-12 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-gray-900">{user.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  user.role === 'admin'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {user.role === 'admin' ? '🛡️ Administrator' : '👤 Citizen'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {user.role === 'admin'
                  ? 'Full system access with management capabilities'
                  : 'Registered citizen with reporting capabilities'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Member since Dec 2024</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Downtown District</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats for Citizens */}
          {user.role === 'citizen' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Issues Reported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-green-600 mb-1">1</div>
                <div className="text-sm text-gray-600">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-yellow-600 mb-1">2</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          )}

          {/* Stats for Admin */}
          {user.role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-1">6</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-yellow-600 mb-1">2</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-green-600 mb-1">2</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-orange-600 mb-1">2</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Section */}
        <PermissionsInfo user={user} />
      </div>
    </div>
  );
}