import { useEffect, useState } from "react";
import { Post, UserHeader } from "../Components";
import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import PostAtom from "../atoms/postAtom";
const UserPage = () => {
  const [posts, setPost] = useRecoilState(PostAtom);
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    if (loading) return;
    const getUserPost = async () => {
      try {
        const res = await fetch(`/api/user/posts/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserPost();
  }, [username, showToast, loading, setPost]);
  return (
    <div>
      {user ? (
        <div>
          <UserHeader user={user} />
          {posts?.length !== 0 ? (
            posts?.map((post) => (
              <Post key={post._id} post={post} postedBy={user._id} />
            ))
          ) : (
            <Text>No post is created by you</Text>
          )}
        </div>
      ) : (
        <h2>User not found</h2>
      )}
    </div>
  );
};

export default UserPage;
