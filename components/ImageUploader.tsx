"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { useToast } from "./ToastProvider";

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
};

export default function ImageUploader({ images, onChange, maxImages = 4 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const uploadToCloudinary = async (files: File[]) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast({
        type: "warning",
        title: "Configuration missing",
        message: "Cloudinary credentials are not configured in .env.local",
      });
      return;
    }

    if (images.length + files.length > maxImages) {
      toast({
        type: "warning",
        title: "Limit reached",
        message: `You can only upload up to ${maxImages} images.`,
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
      
      toast({
        type: "success",
        title: "Upload complete",
        message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        type: "warning",
        title: "Upload failed",
        message: "There was an error uploading your images.",
      });
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        uploadToCloudinary(files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, maxImages]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      uploadToCloudinary(files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  return (
    <div className="image-uploader">
      {images.length > 0 && (
        <div className="image-uploader__preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {images.map((url, index) => (
            <div key={url} className="image-uploader__preview-item" style={{ position: 'relative', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <Image src={url} alt={`Preview ${index}`} fill style={{ objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--surface)', color: 'var(--text)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'var(--surface)', fontSize: '10px', padding: '2px 6px', borderRadius: '2px', fontWeight: 500 }}>
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          className={`image-uploader__dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--text)' : 'var(--border)'}`,
            borderRadius: '6px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'var(--wash)' : 'transparent',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            disabled={isUploading}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
            {isUploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <UploadCloud size={24} />
            )}
            <p style={{ margin: 0, fontSize: '14px' }}>
              {isUploading ? "Uploading..." : "Click or drag images here"}
            </p>
            {!isUploading && <span style={{ fontSize: '12px', opacity: 0.7 }}>Up to {maxImages} images</span>}
          </div>
        </div>
      )}
    </div>
  );
}
