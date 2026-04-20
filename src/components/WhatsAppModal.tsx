"use client";

import { useState } from "react";
import { X, MessageSquare, Globe, Copy, Send, Check } from "lucide-react";
import toast from "react-hot-toast";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    name: string;
    phone: string;
    date: string;
    time?: string;
    type: string;
    doctorName?: string;
    amount?: string;
  };
}

const TEMPLATES = {
  booking_confirmation: {
    label: "Booking Confirmation",
    en: "Hello {name},\nYour booking is confirmed with MedSathi.\n\nDate: {date}\nTime: {time}\nService: {service}\n\nWe will contact you shortly.",
    hi: "नमस्ते {name},\nआपकी बुकिंग सफलतापूर्वक हो गई है।\n\nदिनांक: {date}\nसमय: {time}\nसेवा: {service}\n\nहम जल्द ही संपर्क करेंगे।"
  },
  doctor_confirmed: {
    label: "Doctor Confirmed",
    en: "Hello {name},\nYour doctor appointment is confirmed.\n\nDoctor: {doctor}\nDate: {date}\nTime: {time}",
    hi: "नमस्ते {name},\nआपका डॉक्टर अपॉइंटमेंट कन्फर्म हो गया है।\n\nडॉक्टर: {doctor}\nदिनांक: {date}\nसमय: {time}"
  },
  reminder: {
    label: "Reminder Message",
    en: "Hello {name},\nReminder: Your appointment is scheduled today.\n\nTime: {time}\n\nPlease be available.",
    hi: "नमस्ते {name},\nयाद दिलाना: आपका अपॉइंटमेंट आज है।\n\nसमय: {time}"
  },
  invoice: {
    label: "Invoice Message",
    en: "Hello {name},\nYour bill amount is ₹{amount}.\n\nThank you for choosing MedSathi.",
    hi: "नमस्ते {name},\nआपका बिल ₹{amount} है।\n\nधन्यवाद।"
  }
};

export default function WhatsAppModal({ isOpen, onClose, bookingData }: WhatsAppModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("booking_confirmation");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [customAmount, setCustomAmount] = useState("499");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawTemplate = TEMPLATES[selectedTemplate][lang];
  
  // Dynamic Replacement
  const message = rawTemplate
    .replace(/{name}/g, bookingData.name)
    .replace(/{date}/g, bookingData.date)
    .replace(/{time}/g, bookingData.time || "N/A")
    .replace(/{service}/g, bookingData.type.toUpperCase())
    .replace(/{doctor}/g, bookingData.doctorName || "Partner Doctor")
    .replace(/{amount}/g, customAmount);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Message copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    const cleanPhone = bookingData.phone.replace(/\D/g, "");
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Log the event
    try {
      await secureFetch("/api/logs/whatsapp", {
        method: "POST",
        body: JSON.stringify({
          template: TEMPLATES[selectedTemplate].label,
          patientName: bookingData.name,
          phone: bookingData.phone
        })
      });
    } catch (e) {
      console.error("Logging failed", e);
    }

    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="text-green-500" />
              Send WhatsApp
            </h2>
            <p className="text-slate-500 text-sm mt-1">To: <strong>{bookingData.name}</strong> ({bookingData.phone})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="grid grid-cols-2 gap-3">
             {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map(key => (
               <button
                 key={key}
                 onClick={() => setSelectedTemplate(key)}
                 className={`p-3 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all text-left ${
                   selectedTemplate === key 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200"
                 }`}
               >
                 {TEMPLATES[key].label}
               </button>
             ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
               <button onClick={() => setLang("en")} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>ENGLISH</button>
               <button onClick={() => setLang("hi")} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'hi' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}>हिन्दी</button>
            </div>
            {selectedTemplate === 'invoice' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Bill ₹</span>
                <input 
                  type="number" 
                  value={customAmount} 
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm font-bold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Preview Window */}
          <div className="relative">
            <div className="absolute top-4 right-4 flex gap-2">
               <button onClick={handleCopy} className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all text-slate-500">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
               </button>
            </div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Message Preview</label>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[160px]">
              {message}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              className="flex-[2] py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
