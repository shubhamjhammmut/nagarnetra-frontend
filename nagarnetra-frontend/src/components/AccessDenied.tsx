import { Shield, ShieldCheck } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Administrator privileges are required.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-900 mb-1">
                <strong>Need Admin Access?</strong>
              </p>
              <p className="text-xs text-yellow-700">
                Contact your system administrator or use the admin demo account from the login page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
