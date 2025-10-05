import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/upload/branches");
        setBranches(res.data);
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Select Your Branch
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <button
              key={branch._id}
              onClick={() => navigate(`/years/${branch._id}`)}
              className="w-full px-6 py-4 bg-white rounded-xl shadow hover:shadow-lg text-gray-800 font-medium transition"
            >
              {branch.branchName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};