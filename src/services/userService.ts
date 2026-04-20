import { secureFetch } from "./firebaseService";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "admin" | "subadmin";
  createdAt: number;
}

export const getAllUsers = async (): Promise<UserRecord[]> => {
  try {
    const res = await secureFetch("/api/users");
    const json = await res.json();
    if (json.success) return json.data;
    return [];
  } catch (error) {
    console.error("API error fetching users:", error);
    return [];
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await secureFetch(`/api/users/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  } catch (error) {
    console.error("API Error deleting user:", error);
    return { success: false, error };
  }
};

export const createSubadmin = async (data: { name: string, email: string, password?: string, permissions?: string[] }) => {
  try {
    const res = await secureFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error("API Error creating subadmin:", error);
    return { success: false, error };
  }
};

export const updateUser = async (id: string, data: { name?: string, permissions?: string[] }) => {
  try {
    const res = await secureFetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error("API Error updating user:", error);
    return { success: false, error };
  }
};
