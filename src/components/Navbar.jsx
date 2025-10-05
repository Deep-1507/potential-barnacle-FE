import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/BIET-Jhansi-Logo.webp"

export const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const [isFaculty, setIsFaculty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.facultyId) {
          setIsFaculty(true);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload()
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left - Logo + College Name */}
          <div className="flex items-center space-x-2">
            <img className="w-8 h-8 rounded-full" src={logo} alt="" />
            {/* <div className="w-8 h-8 bg-gray-800 rounded-full"></div> */}
            <span className="text-lg font-semibold text-gray-800">
              BIET Jhansi (College Community)
            </span>
          </div>

          {/* Center - Nav Links */}
          {/* <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            <a href="#" className="hover:text-gray-900">Home</a>
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Departments</a>
            <a href="#" className="hover:text-gray-900">Admissions</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div> */}

          {/* Right - Profile or Login */}
          <div className="flex items-center space-x-2">
            {isFaculty ? (
              <>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => navigate("/faculty")}
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-6 h-6 text-gray-700" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate("/auth")}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          {/* <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Nav */}
      {/* {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-4 py-2 space-y-2 text-gray-600">
            <a href="#" className="hover:text-gray-900">Home</a>
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Departments</a>
            <a href="#" className="hover:text-gray-900">Admissions</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      )} */}
    </nav>
  );
}