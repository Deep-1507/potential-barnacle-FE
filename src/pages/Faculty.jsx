import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Faculty = () => {
  const [faculty, setFaculty] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [histogramData, setHistogramData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch faculty details
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/faculty/faculty-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFaculty(res.data.faculty);
      } catch (err) {
        console.error("Error fetching faculty:", err);
      }
    };
    fetchFaculty();
  }, [token]);

  // Fetch posts made by this faculty
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/upload/posts/faculty",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const results = res.data.results || [];
        const allPosts = [];

        results.forEach((branch) => {
          branch.articles?.forEach((article) => {
            allPosts.push({ ...article, type: "article" });
          });
          branch.files?.forEach((file) => {
            allPosts.push({ ...file, type: "file" });
          });
        });

        setPostsData(allPosts);

        // Build histogram data (posts per month)
        const monthCount = {};
        allPosts.forEach((post) => {
          const month = post.createdAt
            ? new Date(post.createdAt).toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            : "Unknown";
          monthCount[month] = (monthCount[month] || 0) + 1;
        });

        const histogramArray = Object.entries(monthCount).map(
          ([month, count]) => ({
            month,
            count,
          })
        );

        setHistogramData(histogramArray);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [token]);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Faculty Info */}
       <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Faculty ID</span>
      <h2 className="text-gray-800 truncate">{faculty._id || "No ID"}</h2>
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Name</span>
      <h2 className="text-gray-800 truncate">{faculty.name || "No Name"}</h2>
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Email</span>
      <p className="text-gray-800 truncate">{faculty.email || "N/A"}</p>
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Department</span>
      <p className="text-gray-800 truncate">{faculty.department || "N/A"}</p>
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Total Posts</span>
      <p className="text-gray-800">{postsData.length || "0"}</p>
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-gray-500">Created At</span>
      <p className="text-gray-800">
        {faculty.createdAt
          ? new Date(faculty.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  </div>
</div>


        {/* Histogram */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Posts Per Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={histogramData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Posts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {postsData.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No posts uploaded yet.
            </p>
          )}
          {postsData.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
              onClick={() => openModal(post)}
            >
              <h4 className="text-md font-semibold text-gray-800 mb-1">
                {post.type === "article" ? "Article" : "File"}
              </h4>
              <p className="text-gray-600 text-sm truncate">
                {post.type === "article"
                  ? post.article || "No Article Uploaded"
                  : post.file || "No File Uploaded"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Post Details */}
      {isOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              {selectedPost.type === "article" ? "Article" : "File"} Details
            </h3>
            <div className="text-gray-700 mb-4">
              {selectedPost.type === "article" ? (
                <p>{selectedPost.article || "No Article Uploaded"}</p>
              ) : (
                <div>
                  <p className="mb-2">
                    {selectedPost.file || "No File Uploaded"}
                  </p>
                  {selectedPost.fileUrl ? (
                    <a
                      href={selectedPost.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download File
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No file available to download
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-gray-700 font-bold cursor-pointer m-2"
              onClick={closeModal}
            >
              ✕
            </button>
            <button
              type="button"
              className="absolute bottom-2 right-2 bg-blue-600 text-white hover:text-black font-bold p-2 rounded cursor-pointer"
              onClick={closeModal}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
