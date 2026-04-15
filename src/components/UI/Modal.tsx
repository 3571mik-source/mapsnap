'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-content">
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-4 border-b border-gray-200">
          <div className="modal-drag-handle" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
