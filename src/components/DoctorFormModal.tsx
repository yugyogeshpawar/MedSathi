"use client";

import { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

export default function DoctorFormModal({ isOpen, onClose, initialData, onSave, getToken }: any) {
  const [formData, setFormData] = useState<any>({
    name: "", specialty: "Cardiologist", experience: "", clinicName: "", location: "", phone: "", availableSlots: "", status: "Active", image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreview(initialData.image || "");
    } else {
      setFormData({ name: "", specialty: "Cardiologist", experience: "", clinicName: "", location: "", phone: "", availableSlots: "", status: "Active", image: "" });
      setPreview("");
    }
    setImageFile(null);
  }, [initialData, isOpen]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 300; // Small 300x300 constraint for avatars
          let { width, height } = img;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Canvas export failed"));
            const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg", lastModified: Date.now() });
            resolve(compressed);
          }, "image/jpeg", 0.7); // 70% quality compression
        };
        img.onerror = () => reject(new Error("Image parsing failed"));
      };
    });
  };

  if (!isOpen) return null;

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        toast.error("Image compression failed. Using original.");
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      if (imageFile) {
        const payload = new FormData();
        payload.append("file", imageFile);
        
        const token = await getToken();
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token },
          body: payload
        });
        
        const uploadData = await uploadRes.json();
        if(!uploadRes.ok) throw new Error(uploadData.error || "Failed file upload");
        finalImageUrl = uploadData.url;
      }

      const submissionPayload = { ...formData, image: finalImageUrl };
      await onSave(submissionPayload);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">{initialData ? "Edit Doctor" : "Add New Doctor"}</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-full transition-all">
             <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          <div className="flex flex-col items-center justify-center w-full mb-6 relative">
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary rounded-full cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors overflow-hidden group">
              {preview ? (
                <img src={preview} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <p className="text-xs font-semibold">Avatar</p>
                </div>
              )}
              <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="Dr. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialty</label>
              <select required value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary">
                <option>Cardiologist</option>
                <option>Neurologist</option>
                <option>Pediatrician</option>
                <option>Orthopedist</option>
                <option>General Physician</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience (Years)</label>
              <input required type="number" min="0" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="15" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="+91 9000000000" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinic Name</label>
              <input required value={formData.clinicName} onChange={(e) => setFormData({...formData, clinicName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="Apollo Hospital" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinic Location</label>
              <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="New Delhi, India" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Slots</label>
              <input required value={formData.availableSlots} onChange={(e) => setFormData({...formData, availableSlots: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary" placeholder="Mon, Wed, Fri" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
             <button 
              type="submit" 
              disabled={isUploading}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center"
            >
              {isUploading ? "Processing..." : "Save Doctor Identity"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
