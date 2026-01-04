import {
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoImage from "../assets/logo.png";

type Page = "home" | "report" | "track" | "admin" | "profile";

interface UserType {
  email: string;
  name: string;
  role: "citizen" | "admin";
}

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: UserType;
  onLogout: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  user,
  onLogout,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems: {
    label: string;
    page: Page;
    adminOnly?: boolean;
    citizenOnly?: boolean;
  }[] = [
    { label: "Home", page: "home" },
    { label: "Report Issue", page: "report", citizenOnly: true },
    { label: "Track Issues", page: "track" },
    { label: "Admin", page: "admin", adminOnly: true },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && user.role !== "admin") return false;
    if (item.citizenOnly && user.role !== "citizen") return false;
    return true;
  });

  // 🔒 Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <img
              src={logoImage}
              alt="NagarNetra Logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <div className="text-blue-600 text-xl tracking-tight">
                NagarNetra
              </div>
              <div className="text-xs text-gray-500 -mt-1">
                AI-Powered Civic Reporting
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {filteredNavItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`transition-colors ${
                  currentPage === item.page
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  {user.role === "admin" ? (
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate("profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={currentPage}
              onChange={(e) => onNavigate(e.target.value as Page)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {filteredNavItems.map((item) => (
                <option key={item.page} value={item.page}>
                  {item.label}
                </option>
              ))}
              <option value="profile">Profile</option>
            </select>
            <button onClick={onLogout} className="p-2 text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
