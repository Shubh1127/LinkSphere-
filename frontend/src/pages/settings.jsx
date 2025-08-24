import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clientServer, BASE_URL } from "@/config";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";

export default function Settings({ token }) {
  const auth = useSelector((s) => s.auth || {});
  const user = auth?.user?.userId || {};
  const profile = auth?.user?.profile || {};
  const router = useRouter();
  const dispatch = useDispatch();

  // Form states
  const [bio, setBio] = useState(profile?.bio || "");
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicUploading, setProfilePicUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Work/Education
  const [work, setWork] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    location: "",
    description: "",
  });
  const [education, setEducation] = useState({
    school: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    description: "",
  });

  // Feedback
  const [message, setMessage] = useState("");

  // Handlers
  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await clientServer.post("/user/update_basic_profile", {
        name,
        username,
        email,
        bio,
      }, { withCredentials: true });
      setMessage("Profile updated!");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await clientServer.post("/user/update_password", {
        oldPassword,
        newPassword,
      }, { withCredentials: true });
      setMessage("Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage("Failed to update password.");
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("token", token);

      await clientServer.post("/update_profile_picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage("Profile picture updated!");
      window.location.reload();
    } catch (err) {
      setMessage("Failed to upload profile picture.");
    } finally {
      setProfilePicUploading(false);
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    try {
      await clientServer.post("/user/add_work_history", { work }, { withCredentials: true });
      setMessage("Work history added!");
      setWork({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        location: "",
        description: "",
      });
    } catch (err) {
      setMessage("Failed to add work history.");
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await clientServer.post("/user/add_education", { education }, { withCredentials: true });
      setMessage("Education added!");
      setEducation({
        school: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    } catch (err) {
      setMessage("Failed to add education.");
    }
  };

  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="max-w-2xl mx-auto w-full p-4 space-y-8">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          {message && <div className="mb-4 text-blue-600">{message}</div>}

          {/* Profile Picture */}
          <section className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <img
                src={`${BASE_URL}/${user?.profilePicture || "default.jpg"}`}
                alt={user?.username}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => fileInputRef.current.click()}
                disabled={profilePicUploading}
              >
                {profilePicUploading ? "Uploading..." : "Change"}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
            </div>
          </section>

          {/* Basic Info */}
          <form className="bg-white border rounded-lg p-4 mb-4" onSubmit={handleBasicProfileUpdate}>
            <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="border rounded px-3 py-2"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="text"
                className="border rounded px-3 py-2"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <input
                type="email"
                className="border rounded px-3 py-2"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <textarea
                className="border rounded px-3 py-2"
                placeholder="Bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Update Profile
              </button>
            </div>
          </form>

          {/* Password */}
          <form className="bg-white border rounded-lg p-4 mb-4" onSubmit={handlePasswordUpdate}>
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                className="border rounded px-3 py-2"
                placeholder="Old Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                className="border rounded px-3 py-2"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Add Work History */}
          <form className="bg-white border rounded-lg p-4 mb-4" onSubmit={handleAddWork}>
            <h2 className="text-lg font-semibold mb-2">Add Work History</h2>
            <div className="flex flex-col gap-3">
              <input type="text" className="border rounded px-3 py-2" placeholder="Title" value={work.title} onChange={e => setWork({ ...work, title: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="Company" value={work.company} onChange={e => setWork({ ...work, company: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="Location" value={work.location} onChange={e => setWork({ ...work, location: e.target.value })} />
              <input type="date" className="border rounded px-3 py-2" placeholder="Start Date" value={work.startDate} onChange={e => setWork({ ...work, startDate: e.target.value })} />
              <input type="date" className="border rounded px-3 py-2" placeholder="End Date" value={work.endDate} onChange={e => setWork({ ...work, endDate: e.target.value })} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={work.current} onChange={e => setWork({ ...work, current: e.target.checked })} />
                Current
              </label>
              <textarea className="border rounded px-3 py-2" placeholder="Description" value={work.description} onChange={e => setWork({ ...work, description: e.target.value })} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Add Work</button>
            </div>
          </form>

          {/* Add Education */}
          <form className="bg-white border rounded-lg p-4 mb-4" onSubmit={handleAddEducation}>
            <h2 className="text-lg font-semibold mb-2">Add Education</h2>
            <div className="flex flex-col gap-3">
              <input type="text" className="border rounded px-3 py-2" placeholder="School" value={education.school} onChange={e => setEducation({ ...education, school: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="Degree" value={education.degree} onChange={e => setEducation({ ...education, degree: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="Field" value={education.field} onChange={e => setEducation({ ...education, field: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="Start Year" value={education.startYear} onChange={e => setEducation({ ...education, startYear: e.target.value })} />
              <input type="text" className="border rounded px-3 py-2" placeholder="End Year" value={education.endYear} onChange={e => setEducation({ ...education, endYear: e.target.value })} />
              <textarea className="border rounded px-3 py-2" placeholder="Description" value={education.description} onChange={e => setEducation({ ...education, description: e.target.value })} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Add Education</button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}