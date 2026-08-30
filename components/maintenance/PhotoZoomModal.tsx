import React from 'react';
import { X } from 'lucide-react';

interface PhotoZoomModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

export default function PhotoZoomModal({ photoUrl, onClose }: PhotoZoomModalProps) {
  if (!photoUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={photoUrl}
          alt="Dokumentasi Perbaikan HD"
          className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
