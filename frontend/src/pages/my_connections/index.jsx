import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserPage";
import { BASE_URL } from "@/config";
import {
  getMyConnectionRequests,
  getMyConnections,
  acceptConnectionRequest,
} from "@/config/redux/action/authAction";
import { Router } from "lucide-react";
import { useRouter } from "next/router";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

export default function MyConnections({ token }) {
  const router=useRouter();
  console.log("token in my connections:", token);
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const meId = auth?.user?.userId?._id;

  useEffect(()=>{
    if(!token){
      Router.push('/');
    }
  })

  const pending = auth.connectionRequest || [];
  const connections = auth.connections || [];
  const loading = auth.connectionUpdating === true;

  useEffect(() => {
    dispatch(getMyConnectionRequests());
    dispatch(getMyConnections());
  }, [dispatch]);

  const handleAction = (requestId, action_type) => {
    dispatch(acceptConnectionRequest({ requestId, action_type }))
      .unwrap()
      .then(() => {
        dispatch(getMyConnectionRequests());
        dispatch(getMyConnections());
      });
  };

  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="max-w-3xl mx-auto w-full p-4 space-y-6">
          <header className="border-b pb-3">
            <h1 className="text-2xl font-semibold">My Connections</h1>
          </header>

          {/* Pending Requests */}
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Connection Requests</h2>
              <span className="text-sm text-gray-600">
                {pending.length} pending
              </span>
            </div>

            {pending.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {pending.map((r) => {
                  const u = r.senderId; // The user who sent the request
                  return (
                    <div
                      key={r._id}
                      className="flex items-center gap-3 border rounded-lg p-3"
                    >
                      <img
                        src={`${BASE_URL}/${u?.profilePicture || "default.jpg"}`}
                        alt={u?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/u/${u?.username}`}
                          className="font-semibold hover:underline"
                        >
                          {u?.name || u?.username}
                        </Link>
                        <p className="text-gray-500 text-sm">@{u?.username}</p>
                      </div>
                      <button
                        className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                        disabled={loading}
                        onClick={() => handleAction(r._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 rounded-full border text-sm hover:bg-gray-50 disabled:opacity-60"
                        disabled={loading}
                        onClick={() => handleAction(r._id, "reject")}
                      >
                        Ignore
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Your Connections */}
          <section className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Your Connections</h2>
              <span className="text-sm text-gray-600">
                {connections.length} total
              </span>
            </div>

            {connections.length === 0 ? (
              <p className="text-gray-500">No connections yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connections.map((c) => {
                  // Show the "other" user in the connection
                  const a = c.senderId;
                  const b = c.receiverId;
                  const other =
                    meId && String(a?._id) === String(meId) ? b : a;

                  return (
                    <div
                      key={c._id}
                      className="flex items-center gap-3 border rounded-lg p-3"
                    >
                      <img
                        src={`${BASE_URL}/${other?.profilePicture || "default.jpg"}`}
                        alt={other?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/u/${other?.username}`}
                          className="font-semibold hover:underline"
                        >
                          {other?.name || other?.username}
                        </Link>
                        <p className="text-gray-500 text-sm">
                          @{other?.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
