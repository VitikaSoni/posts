// pages/Profile.tsx
import React, { useState } from "react";

const Profile: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
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
    </div>
  );
};

export default Profile;
