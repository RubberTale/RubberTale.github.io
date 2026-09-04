import React, { useCallback, useState } from 'react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传有效的图片文件 (JPG, PNG, WEBP等)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
        ${disabled 
          ? 'border-gray-800 bg-gray-900/30 cursor-not-allowed opacity-60' 
          : isDragOver
            ? 'border-purple-400 bg-purple-950/30 scale-[1.01]'
            : 'border-purple-500/60 bg-gray-900/40 hover:bg-gray-900/80 hover:border-purple-400 shadow-lg shadow-purple-950/20'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform ${isDragOver ? 'scale-110 bg-purple-500/20' : 'bg-purple-950/60'}`}>
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <p className="mb-2 text-sm text-gray-200">
            <span className="font-semibold text-purple-300">点击上传个人肖像</span> 或将照片拖拽至此处
          </p>
          <p className="text-xs text-gray-400">
            支持 JPG、PNG、WEBP 高清正脸或半身照片
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default UploadZone;
