import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreview from "../hooks/usePreview";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    Bio: user.Bio,
    password: "",
  });
  const [update, setUpdate] = useState(false);
  const fileRef = useRef(null);
  const { handleImageChange, imageUrl } = usePreview();
  const showToast = useShowToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (update) return;
    setUpdate(true);
    try {
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...input, profilePicture: imageUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Your profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-thread", JSON.stringify(data));
    } catch (error) {
      showToast("error", error.message, "error");
    } finally {
      setUpdate(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={imageUrl || user.profilePicture}
                  boxShadow={"md"}
                ></Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="full name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Input
                placeholder="Bio"
                _placeholder={{ color: "gray.500" }}
                type="text"
                value={input.Bio}
                onChange={(e) => setInput({ ...input, Bio: e.target.value })}
              />
            </FormControl>
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"blue.400"}
              type="submit"
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              isLoading={update}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
