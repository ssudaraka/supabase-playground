import { useState, useEffect, useRef } from "react";
import { supabase } from "./utils/supabaseClient";

interface FileItem {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

function Storage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState("public");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [bucketName]);

  async function fetchFiles() {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        setError(`Failed to fetch files: ${error.message}`);
        console.error("Error fetching files:", error);
        return;
      }

      setFiles(
        (data || []).map((file) => ({
          name: file.name,
          id: file.id || file.name,
          created_at: file.created_at || "",
          updated_at: file.updated_at || "",
          last_accessed_at: file.last_accessed_at || "",
          metadata: {
            size: file.metadata?.size || 0,
            mimetype: file.metadata?.mimetype || "unknown",
          },
        })),
      );
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        setError(`Upload failed: ${error.message}`);
        console.error("Upload error:", error);
        return;
      }

      setSuccess(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh file list
      await fetchFiles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during upload",
      );
      console.error("Error:", err);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDownload(fileName: string) {
    try {
      setError(null);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fileName);

      if (error) {
        setError(`Download failed: ${error.message}`);
        console.error("Download error:", error);
        return;
      }

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`File "${fileName}" downloaded successfully!`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during download",
      );
      console.error("Error:", err);
    }
  }

  async function handleDelete(fileName: string) {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      setError(null);
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        setError(`Delete failed: ${error.message}`);
        console.error("Delete error:", error);
        return;
      }

      setSuccess(`File "${fileName}" deleted successfully!`);
      await fetchFiles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during deletion",
      );
      console.error("Error:", err);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

  function getFileIcon(mimetype: string) {
    if (mimetype.startsWith("image/")) {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (mimetype.includes("pdf")) {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Storage</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Upload, manage, and download files from your Supabase Storage buckets.
        </p>
      </div>

      {/* Bucket Selection */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <label
            htmlFor="bucket"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Storage Bucket
          </label>
          <input
            id="bucket"
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter bucket name (e.g., public)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the name of the storage bucket you want to access
          </p>
        </div>
        <button
          onClick={fetchFiles}
          disabled={isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="-ml-1 mr-3 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Files
            </>
          )}
        </button>
      </div>

      {/* Upload Section */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center text-2xl font-semibold text-gray-900">
            <svg
              className="mr-2 h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload File
          </h2>
          <p className="text-gray-600">
            Select a file from your device to upload to the storage bucket.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select File
            </label>
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedFile.name}</span> (
                {formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <svg
                  className="-ml-1 mr-3 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload File
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files List */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="mb-2 flex items-center text-2xl font-semibold text-gray-900">
            <svg
              className="mr-2 h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Files in Bucket
            {files.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({files.length} {files.length === 1 ? "file" : "files"})
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No files found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a file to get started, or check if the bucket name is
              correct.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-gray-400">
                    {getFileIcon(file.metadata.mimetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.metadata.size)}</span>
                      <span>{file.metadata.mimetype}</span>
                      {file.created_at && (
                        <span>
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="rounded-md p-2 text-gray-400 opacity-0 transition-colors hover:text-blue-600 group-hover:opacity-100"
                    title="Download file"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="rounded-md p-2 text-gray-400 opacity-0 transition-colors hover:text-red-600 group-hover:opacity-100"
                    title="Delete file"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            How it works
          </h3>
          <p className="text-sm text-gray-600">
            Supabase Storage allows you to upload, manage, and serve files. Enter
            a bucket name, upload files, and manage them through the interface.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Storage Features
          </h3>
          <p className="text-sm text-gray-600">
            Upload any file type, view metadata, download files, and delete them.
            All operations are performed securely through Supabase Storage API.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Storage;



