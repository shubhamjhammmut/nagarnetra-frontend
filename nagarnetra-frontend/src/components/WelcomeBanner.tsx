import { Shield, Info } from 'lucide-react';

interface User {
  name: string;
  role: 'citizen' | 'admin';
}

interface WelcomeBannerProps {
  user: User;
  onNavigate: (page: 'track' | 'admin' | 'profile') => void;
}

export function WelcomeBanner({ user, onNavigate }: WelcomeBannerProps) {
  if (user.role === 'admin') {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1">Welcome back, {user.name}</h2>
              <p className="text-blue-100 text-sm">
                You have administrator access. Manage and resolve all civic issues from the admin dashboard.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors hidden md:block"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1">Welcome, {user.name}</h2>
            <p className="text-green-100 text-sm">
              Help improve your community by reporting civic issues. Your reports help local authorities take action faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}