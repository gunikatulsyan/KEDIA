import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

// Reads a file, downscales to max 900px, returns base64 data URI via onChange
const ImageUpload = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width > height) { height = Math.round((height * max) / width); width = max; }
          else { width = Math.round((width * max) / height); height = max; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        onChange(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 w-full h-40">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
                  className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-white/90 flex items-center justify-center text-slate-600 hover:text-red-500 shadow">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[#17b877] hover:text-[#17b877] transition-colors">
          <Upload className="h-6 w-6 mb-2" />
          <span className="text-[13.5px] font-medium">Upload image</span>
          <span className="text-[11.5px]">from computer or phone</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
             onChange={(e) => handleFile(e.target.files?.[0])} />
      {error && <p className="mt-1.5 text-[12.5px] text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
