import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";

export const Years = () => {
  const { id } = useParams(); // branch id from route
  const [branch, setBranch] = useState(null);
  const [openYear, setOpenYear] = useState(null); // dropdown toggle
  const [isFaculty, setIsFaculty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

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
  }, [token]);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/upload/branches/${id}`
        );
        setBranch(res.data);
      } catch (err) {
        console.error("Error fetching branch:", err);
      }
    };
    fetchBranch();
  }, [id]);

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    try {
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/upload/branches/${id}/subjects`,
        {
          yearId: selectedYear,
          subjectName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh branch data after adding subject
      const res = await axios.get(
        `${BACKEND_URL}/api/upload/branches/${id}`
      );
      setBranch(res.data);

      setShowModal(false);
      setSubjectName("");
    } catch (err) {
      console.error("Error adding subject:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!branch) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {branch.branchName}
        </h1>
        <h2 className="text-xl font-bold text-gray-600 mb-6 text-center border-b border-gray-400 pb-8">
          Click on the year's given below to view the subjects
        </h2>

        <div className="space-y-4">
          {branch.years.map((year) => (
            <div key={year._id} className="bg-white rounded-xl shadow p-4">
              {/* Year Header */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setOpenYear(openYear === year._id ? null : year._id)
                  }
                  className="flex-1 text-left text-lg font-semibold text-gray-800"
                >
                  {year.years_subfolders} Year
                  <span className="ml-2 text-gray-500">
                    {openYear === year._id ? "▲" : "▼"}
                  </span>
                </button>

                {isFaculty && (
                  <button
                    onClick={() => {
                      setSelectedYear(year._id);
                      setShowModal(true);
                    }}
                    className="ml-3 px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    + Add Subject
                  </button>
                )}
              </div>

              {/* Subjects Dropdown */}
              {openYear === year._id && (
                <div className="mt-3 pl-3 space-y-2">
                  {year.subjects.length > 0 ? (
                    year.subjects.map((subject) => (
                      <button
                        key={subject._id}
                        onClick={() =>
                          navigate(
                            `/subject/${id}/${year._id}/${subject._id}/${subject.name}`
                          )
                        }
                        className="block w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        {subject.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No subjects available
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Add Subject
            </h2>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              className="w-full border rounded px-3 py-2 mb-4 focus:ring focus:ring-gray-200"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                disabled={loading}
                className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};