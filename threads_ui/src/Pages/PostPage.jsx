import {
  Flex,
  Avatar,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Actions, Comment } from "../Components";
import { useEffect, useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const PostPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const { user, loading } = useGetUserProfile();
  const navigate = useNavigate();
  const { pId } = useParams();
  const showToast = useShowToast();
  const [post, setPost] = useState(null);
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/post/${pId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data.post);
      } catch (error) {
        showToast("Error", "post not found", "error");
      }
    };
    getPost();
  }, [showToast, pId]);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!post) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Text>Post not found</Text>
      </Flex>
    );
  }
  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("are you sure about deleting this post")) return;
      const res = await fetch(`/api/post/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        true;
      }
      showToast("Success", "post deleted successfully", "success");
      navigate("/");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <>
      <Flex>
        <Flex w="full" alignItems={"center"}>
          <Avatar src={user?.profilePicture} size={"md"} name="Mark" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"} mx={3}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          {currentUser?._id === user?._id ? (
            <DeleteIcon size={20} onClick={handleDeletePost} />
          ) : null}
        </Flex>
      </Flex>
      <Text my={3}>{post?.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={post?.img} w={"full"}></Image>
      </Box>
      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>🤝</Text>
          <Text color={"gray.light"}>Get the app to like reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post?.replies?.map((reply) => (
        <Comment
          key={reply?._id}
          reply={reply}
          lastReply={reply._id === post.replies[post.replies.length - 1]._id}
        />
      ))}
    </>
  );
};
export default PostPage;
