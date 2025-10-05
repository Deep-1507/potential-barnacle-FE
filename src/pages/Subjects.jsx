import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";

export const Subjects = () => {
  const { branchId, yearId, subjectId, subjectName } = useParams();
  const [articles, setArticles] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [newArticle, setNewArticle] = useState("");
  const [file, setFile] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  const [isFaculty, setIsFaculty] = useState(false);

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
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/upload/subject-Content`,
          { branchId, yearId, subjectId },
          { headers: { "Content-Type": "application/json" } }
        );
        setArticles(res.data.articles);
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };
    fetchContent();
  }, [branchId, yearId, subjectId]);

  const handleArticleUpload = async () => {
    if (!newArticle.trim()) return;
    try {
      setUploading(true);

      await axios.post(
        `${BACKEND_URL}api/upload/branches/${branchId}/upload`,
        {
          data: JSON.stringify({
            yearId,
            subjectId,
            type: "article",
            content: newArticle,
            postedByName: "John Doe",
            postedByBranch: "Computer Science",
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ✅ JSON request
          },
        }
      );

      setNewArticle("");
      window.location.reload();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!fileInput) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileInput); // ✅ multer handles this
      formData.append(
        "data", // ✅ must be stringified JSON
        JSON.stringify({
          file,
          yearId,
          subjectId,
          type: "file",
          postedByName: "John Doe",
          postedByBranch: "Computer Science",
        })
      );

      await axios.post(
        `${BACKEND_URL}/api/upload/branches/${branchId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ Don't set Content-Type manually here, axios sets it
          },
        }
      );

      setFileInput(null);
      window.location.reload();
    } catch (err) {
      console.error("File upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-10">
        {/* Subject Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center border-b border-gray-800 pb-4">
          {subjectName}
        </h2>

        {isFaculty && (
          <>
            <div className="bg-white shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">Add Article</h3>
              <textarea
                value={newArticle}
                onChange={(e) => setNewArticle(e.target.value)}
                placeholder="Write your article here..."
                className="w-full p-3 border rounded-lg focus:ring focus:ring-gray-200"
                rows={4}
              ></textarea>
              <button
                onClick={handleArticleUpload}
                disabled={uploading}
                className="mt-3 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Post Article"}
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-3">Upload File</h3>
              {/* File name or description (optional) */}
              <input
                type="text"
                value={file}
                onChange={(e) => setFile(e.target.value)}
                placeholder="Enter file description"
                className="mb-3 border rounded p-2 w-full"
              />

              {/* Actual file input */}
              <input
                type="file"
                onChange={(e) => setFileInput(e.target.files[0])}
                className="mb-3"
              />

              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </>
        )}

        {/* Articles Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Articles
          </h2>
          <div className="space-y-3">
            {articles.length > 0 ? (
              articles.map((article) => (
                <button
                  key={article._id}
                  onClick={() => {
                    setSelectedItem(article);
                    setModalType("article");
                  }}
                  className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700 font-medium"
                >
                  {article.article.length > 50
                    ? article.article.substring(0, 50) + "..."
                    : article.article}
                  <span className="block text-sm text-gray-500 mt-1">
                    by {article.postedByName} ({article.postedByBranch})
                  </span>
                </button>
              ))
            ) : (
              <p className="text-gray-500">No articles available.</p>
            )}
          </div>
        </div>

        {/* Files Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Files</h2>
          <div className="space-y-3">
            {files.length > 0 ? (
              files.map((file) => (
                <button
                  key={file._id}
                  onClick={() => {
                    setSelectedItem(file);
                    setModalType("file");
                  }}
                  className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700 font-medium flex justify-between items-center"
                >
                  <span>{file.file}</span>
                  <span className="text-sm text-gray-500">
                    by {file.postedByName}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-gray-500">No files available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black bg-opacity-25 pointer-events-auto"></div>
          <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-lg pointer-events-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              ×
            </button>

            {modalType === "article" && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {selectedItem.article}
                </h3>
                <p className="text-gray-600 mb-2">
                  Posted by: {selectedItem.postedByName} (
                  {selectedItem.postedByBranch})
                </p>
                <p className="text-gray-500 text-sm">
                  Created at:{" "}
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            {modalType === "file" && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {selectedItem.file}
                </h3>
                <p className="text-gray-600 mb-3">
                  Uploaded by: {selectedItem.postedByName} (
                  {selectedItem.postedByBranch})
                </p>
                <a
                  href={selectedItem.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
