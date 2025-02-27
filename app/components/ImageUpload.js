import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export default function ImageUpload({ onImageSelect, isProcessing, progress }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    disabled: isProcessing,
    multiple: false
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop it here!" : "Drag & Drop"}
            </p>
            <p className="text-sm text-gray-500">
              or click to select an image
            </p>
          </div>
        </div>
      </div>
      {preview && (
        <div className="mt-6">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      {isProcessing && (
        <div className="mt-6 space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Processing: {progress}%
          </p>
        </div>
      )}
    </div>
  );
}