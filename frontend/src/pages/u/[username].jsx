import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
import { clientServer } from "@/config";
import { BASE_URL } from "@/config";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

export default function PublicProfile({ token }) {
  const router = useRouter();
  const { username } = router.query;

  const [info, setInfo] = useState(null); // { user, profile }
  const [posts, setPosts] = useState([]);

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
      }
    })();
  }, [username]);

  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="max-w-4xl mx-auto p-4">
          {!info?.user ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex items-center gap-4 border-b pb-4 mb-4">
                <img
                  src={`${BASE_URL}/${info.user.profilePicture}`}
                  alt={info.user.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold">@{info.user.username}</h1>
                  <p className="text-gray-600">{info.user.name}</p>
                  {info?.profile?.bio && <p className="mt-1">{info.profile.bio}</p>}
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3">Posts</h2>
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="border rounded-lg mb-4">
                    <div className="p-3">
                      <p className="mb-2">{post.body}</p>
                      {post.media && (
                        <img
                          src={`${BASE_URL}/${post.media}`}
                          alt="media"
                          className="w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="px-3 pb-3 text-sm text-gray-600">
                      {post.likes} likes • {post.comments?.length || 0} comments
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}