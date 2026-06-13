'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import type { UploadKind } from '@adulis/shared';
import { uploadToR2 } from '@/lib/upload';
import { useToast } from '@/lib/toast';

interface ImageUploadFieldProps {
  label: string;
  kind: UploadKind;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helpText?: string;
}

export default function ImageUploadField({
  label,
  kind,
  value,
  onChange,
  placeholder,
  helpText,
}: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file.', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast('Image must be under 8 MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const { publicUrl } = await uploadToR2(file, kind);
      onChange(publicUrl);
      toast('Image uploaded.', 'success');
    } catch (err) {
      console.error(err);
      toast('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-black/70 font-mono uppercase tracking-wider text-[10px] mb-1.5">
        {label}
      </label>

      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-black/50" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'https://...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-black/10 rounded-xl focus:border-sky-500 focus:outline-none text-black text-xs font-mono"
          />
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-500 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer transition disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-2 py-2 bg-black/5 hover:bg-black/5 border border-black/10 text-black/70 rounded-xl text-[11px] font-bold cursor-pointer transition"
            title="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      </div>

      {helpText && <p className="text-[10px] text-black/50 mt-1.5 font-sans">{helpText}</p>}

      {value && (
        <div className="mt-2 h-20 w-20 rounded-xl overflow-hidden border border-black/10 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
