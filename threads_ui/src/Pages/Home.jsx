import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Post } from "../Components";
const Home = () => {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setPost(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPost();
  }, [showToast]);
  return (
    <>
      {!loading && posts.length === 0 && <h1>No post found inside of feed</h1>}
      {loading && (
        <Flex justify={"center"}>
          <Spinner />
        </Flex>
      )}
      {posts.map((post) => {
        return <Post key={post._id} post={post} postedBy={post.postedBy} />;
      })}
    </>
  );
};

export default Home;
