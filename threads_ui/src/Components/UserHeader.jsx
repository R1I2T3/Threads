import { VStack, Box, Flex, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {
  Menu,
  MenuButton,
  Portal,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import PropTypes from "prop-types";
import useShowToast from "../hooks/useShowToast";
const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user?.followers?.includes(currentUser._id)
  );
  const toast = useToast();
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({ description: "Copied to Clipboard" });
    });
  };
  const handleFollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/user/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (following) {
        showToast(
          "Success",
          `UnFollowed successfully ${user.username}`,
          "success"
        );
        user.followers.pop();
      } else {
        showToast(
          "Success",
          `Followed successfully ${user.username}`,
          "success"
        );
        user.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name || ""}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePicture ? (
            <Avatar
              name={user?.name}
              src={user?.profilePicture}
              size={{ base: "md", md: "xl" }}
            />
          ) : (
            <Avatar name={user?.name} />
          )}
        </Box>
      </Flex>
      <Text>{user?.Bio}</Text>
      {currentUser?._id === user?._id && (
        <Link to="/updateProfile">
          <Button>Update profile</Button>
        </Link>
      )}
      {currentUser?._id !== user?._id && (
        <Button onClick={handleFollow} isLoading={updating}>
          {following ? "unfollow" : "follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers?.length} followers</Text>
          <Box w={"1"} h={"1"} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          cursor={"pointer"}
          pb={3}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          cursor={"pointer"}
          pb={3}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

UserHeader.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string,
    profilePicture: PropTypes.string,
    Bio: PropTypes.string,
    followers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
export default UserHeader;
