import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
import { clientServer, BASE_URL } from "@/config";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

const fmtMonthYear = (d) => {
  if (!d) return "";
  try {
    const date = new Date(d);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  } catch {
    return d;
  }
};

const SectionCard = ({ title, children }) => (
  <div className="bg-white border rounded-lg p-4 mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

export default function PublicProfile({ token }) {
  const router = useRouter();
  const { username } = router.query;

  const [info, setInfo] = useState(null); // { user, profile }
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const [profRes, postsRes] = await Promise.all([
          clientServer.get(`/user/public_profile/${username}`),
          clientServer.get(`/posts/by_user/${username}`),
        ]);
        setInfo(profRes.data);
        setPosts(postsRes.data.posts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const pastWork = useMemo(() => info?.profile?.pastWork || [], [info]);
  const education = useMemo(() => info?.profile?.education || [], [info]);

  if (loading) {
    return (
      <UserLayout token={token}>
        <DashboardLayout token={token}>
          <div className="max-w-4xl mx-auto p-4">Loading...</div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  if (!info?.user) {
    return (
      <UserLayout token={token}>
        <DashboardLayout token={token}>
          <div className="max-w-4xl mx-auto p-4">User not found.</div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  const u = info.user;
  const p = info.profile || {};

  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="max-w-4xl mx-auto p-0 md:p-4">
          {/* Header card */}
          <div className="bg-white border rounded-lg mb-4 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400" />
            <div className="p-4 pt-0">
              <div className="flex -mt-10 items-start gap-4">
                <img
                  src={`${BASE_URL}/${u.profilePicture}`}
                  alt={u.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
                <div className="flex  flex-1">
                  <div className="flex-1">
                  <h1 className="text-2xl font-bold">
                    {u.name || `@${u.username}`}
                  </h1>
                  <p className="text-gray-600">@{u.username}</p>
                  {u.email && (
                    <p className="text-gray-500 text-sm">{u.email}</p>
                  )}
                  {p.currentPost && (
                    <p className="mt-1 text-[15px]">{p.currentPost}</p>
                  )}
                  {p.bio && (
                    <p className="mt-2 text-[15px] text-gray-700">{p.bio}</p>
                  )}
                  </div>
                  <div className="flex gap-2 mt-12   items-end ms-12 ">
                    <button className="h-max px-2 py-2 rounded-full border text-sm hover:bg-gray-50 cursor-pointer">
                      Message
                    </button>
                    <button className="h-max px-2 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {p.bio && (
            <SectionCard title="About">
              <p className="leading-relaxed">{p.bio}</p>
            </SectionCard>
          )}

          {/* Experience */}
          <SectionCard title="Experience">
            {pastWork.length === 0 ? (
              <p className="text-gray-500">No experience added.</p>
            ) : (
              <div className="space-y-4">
                {pastWork.map((w, idx) => (
                  <div key={w._id || idx} className="flex gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Logo</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{w.title || "Role"}</p>
                      <p className="text-gray-700">{w.company || "Company"}</p>
                      <p className="text-gray-500 text-sm">
                        {fmtMonthYear(w.startDate)} -{" "}
                        {w.current ? "Present" : fmtMonthYear(w.endDate)}
                        {w.location ? ` • ${w.location}` : ""}
                      </p>
                      {w.description && (
                        <p className="mt-1 text-[15px] text-gray-700">
                          {w.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education">
            {education.length === 0 ? (
              <p className="text-gray-500">No education added.</p>
            ) : (
              <div className="space-y-4">
                {education.map((e, idx) => (
                  <div key={e._id || idx} className="flex gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Logo</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{e.school || "School"}</p>
                      <p className="text-gray-700">
                        {e.degree || "Degree"}
                        {e.field ? `, ${e.field}` : ""}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {e.startYear || ""} - {e.endYear || ""}
                      </p>
                      {e.description && (
                        <p className="mt-1 text-[15px] text-gray-700">
                          {e.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Activity (Posts) */}
          <SectionCard title="Activity">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="border rounded-lg">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt={post.userId.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{post.userId.name}</p>
                          <p className="text-xs text-gray-500">
                            @{post.userId.username}
                          </p>
                        </div>
                      </div>
                      <p className="mb-2">{post.body}</p>
                      {post.media && (
                        <img
                          src={`${BASE_URL}/${post.media}`}
                          alt="media"
                          className="w-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="px-3 pb-3 text-sm text-gray-600">
                      {post.likes} likes • {post.comments?.length || 0} comments
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
