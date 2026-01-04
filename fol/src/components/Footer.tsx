import { MapPin, Mail, Phone } from 'lucide-react';
import logoImage from "../assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logoImage}
                alt="NagarNetra Logo"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div>
                <div className="text-white">NagarNetra</div>
                <div className="text-xs text-gray-400">AI-Powered Civic Reporting</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered civic issue reporting platform helping citizens and authorities work together for better communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>nagarnetra10@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91-551-CIVIC-AI</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Municipal Corporation Office, Gorakhpur, Uttar Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 NagarNetra. All rights reserved.</p>
            <p className="text-xs text-gray-600">
              Government Transparency Initiative • Powered by AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}