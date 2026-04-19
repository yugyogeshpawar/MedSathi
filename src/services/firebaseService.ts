import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const getAuthToken = async () => {
  const user = auth?.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export const secureFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
};

export const addDoctorBooking = async (data: { name: string, phone: string, doctorName: string, doctorId: string, date: string, time: string }) => {
  try {
    const res = await secureFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ ...data, type: "doctor" })
    });
    const result = await res.json();
    return { success: result.success, id: result.data?.id };
  } catch (error) {
    console.error("Error booking doctor:", error);
    return { success: false, error };
  }
};

export const addLabBooking = async (data: { name: string, phone: string, testType: string, homeCollection: boolean, date: string }) => {
  try {
    const res = await secureFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ ...data, type: "lab" })
    });
    const result = await res.json();
    return { success: result.success, id: result.data?.id };
  } catch (error) {
    console.error("Error booking lab test:", error);
    return { success: false, error };
  }
};

export const uploadFile = async (file: File) => {
  const fileRef = ref(storage, `prescriptions/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const addMedicineOrder = async (data: { phone: string, address: string, prescriptionFile: File }) => {
  try {
    // 1. Upload the file first
    const prescriptionUrl = await uploadFile(data.prescriptionFile);
    
    // 2. Submit order to API
    const res = await secureFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        phone: data.phone,
        address: data.address,
        prescriptionUrl,
        type: "medicine",
        name: "Order" // Standard name for medicine orders if not provided
      })
    });
    const result = await res.json();
    return { success: result.success, id: result.data?.id };
  } catch (error) {
    console.error("Error ordering medicine:", error);
    return { success: false, error };
  }
};

export interface MergedBooking {
  id: string;
  type: "doctor" | "lab" | "medicine";
  name: string;
  phone: string;
  date: string;
  status: string;
  raw: any;
  createdAtTS: number;
}

export const getAllBookingsMerged = async (): Promise<MergedBooking[]> => {
  try {
    const res = await secureFetch("/api/bookings");
    const json = await res.json();
    if (json.success) return json.data;
    return [];
  } catch (error) {
    console.error("API error fetching bookings:", error);
    return [];
  }
};

export const updateBookingStatus = async (id: string, type: "doctor" | "lab" | "medicine", status: string) => {
  try {
    const res = await secureFetch(`/api/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ type, status })
    });
    return await res.json();
  } catch (error) {
    console.error("API Error updating status:", error);
    return { success: false, error };
  }
};

export const deleteBooking = async (id: string, type: string) => {
  try {
    const res = await secureFetch(`/api/bookings/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ type })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error };
  }
}
