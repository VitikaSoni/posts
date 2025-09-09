// pages/Profile.tsx
import { logout } from "@/store/authSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store";
// import { changePassword, logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store";
import ROUTES from "@/configs/routes";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    //   e.preventDefault();
    //   try {
    //     await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
    //     setMessage("Password changed successfully!");
    //     setOldPassword("");
    //     setNewPassword("");
    //   } catch (err: any) {
    //     setMessage(err.message || "Failed to change password");
    //   }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
