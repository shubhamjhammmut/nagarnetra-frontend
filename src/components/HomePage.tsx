import { Camera, Search, Zap, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { WelcomeBanner } from './WelcomeBanner';
import logoImage from "../assets/logo.png";

type Page = 'home' | 'report' | 'track' | 'admin' | 'profile';

interface User {
  name: string;
  role: 'citizen' | 'admin';
}

interface HomePageProps {
  onNavigate: (page: Page) => void;
  user: User;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  return (
    <div className="w-full">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoImage}
                alt="NagarNetra Logo"
                className="h-16 w-16 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-white mb-0">
                  NagarNetra
                </h1>
                <p className="text-blue-200 text-sm">AI-Powered Civic Reporting</p>
              </div>
            </div>
            <h2 className="mb-4">
              {user.role === 'admin' ? 'Manage Civic Issues with AI' : 'Report Civic Issues Using AI'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {user.role === 'admin' 
                ? 'Monitor, prioritize, and resolve civic issues efficiently with AI-powered insights'
                : 'Upload a photo and let AI identify and prioritize civic problems'}
            </p>
            <div className="flex flex-wrap gap-4">
              {user.role === 'citizen' && (
                <button
                  onClick={() => onNavigate('report')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Report an Issue
                </button>
              )}
              {user.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('track')}
                  className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors border border-blue-500"
                >
                  Track Issues
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 hidden lg:block">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1764675107575-7a33cbdb7905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG1vZGVybnxlbnwxfHx8fDE3NjY1MjUzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="City skyline"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Powered by AI Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              NagarNetra uses advanced artificial intelligence to streamline civic issue reporting and resolution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">AI-Based Issue Identification</h3>
              <p className="text-gray-600">
                Upload a photo and let AI automatically detect and categorize the civic problem
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Automatic Duplicate Detection</h3>
              <p className="text-gray-600">
                AI identifies similar issues in the same area to prevent duplicate reports
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Urgency Prediction</h3>
              <p className="text-gray-600">
                Smart algorithms prioritize issues based on severity for faster resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-gray-600">Simple, fast, and effective civic reporting in three steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <div className="mb-4">
                <Camera className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="mb-2">Capture or Upload Photo</h3>
              <p className="text-gray-600">
                Take a photo of the civic issue or upload from your gallery
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <div className="mb-4">
                <Zap className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="mb-2">AI Analyzes the Issue</h3>
              <p className="text-gray-600">
                Our AI identifies the issue type and severity level automatically
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <div className="mb-4">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="mb-2">Authorities Take Action</h3>
              <p className="text-gray-600">
                Local authorities receive the report and work towards resolution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="mb-4">Make Your Community Better</h2>
          <p className="text-xl text-blue-100 mb-8">
            {user.role === 'admin' 
              ? 'Efficiently manage and resolve civic issues to improve your community'
              : 'Join thousands of citizens helping improve their neighborhoods through NagarNetra'}
          </p>
          {user.role === 'citizen' && (
            <button
              onClick={() => onNavigate('report')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Report Your First Issue
            </button>
          )}
        </div>
      </section>
    </div>
  );
}