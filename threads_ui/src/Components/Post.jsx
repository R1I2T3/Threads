import { Link } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Actions } from "../Components";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import PostAtom from "../atoms/postAtom";
const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPost] = useRecoilState(PostAtom);
  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("are you sure about deleting this post")) return;
      const res = await fetch(`/api/post/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      showToast("Success", "Post deleted", "success");
      if (data.error) {
        showToast("Error", data.error, "error");
      }
      setPost(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [showToast, postedBy]);
  const id = post?._id;
  return (
    <Link to={`/${user?.username}/post/${id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.name}
            src={user?.profilePicture}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>😒</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name={post?.replies[0]?.username}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
                src={post?.replies[0].userProfilePic}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                position={"absolute"}
                name={post.replies[1]?.username}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name={post.replies[2].username}
                position={"absolute"}
                bottom={"0px"}
                src={post?.replies[2].userProfilePic}
                left={"5px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w="full" alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={4} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                w={20}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post?.createdAt))} ago
              </Text>
              {currentUser?._id === user?._id ? (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              ) : null}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post?.text}</Text>
          <Box borderRadius={6} overflow={"hidden"} border={"1px solid"}>
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Image src={post?.img} />
            </Flex>
          </Box>
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
    img: PropTypes.string,
    replies: PropTypes.arrayOf(PropTypes.object),
    likes: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }),
  postedBy: PropTypes.string,
};
export default Post;
