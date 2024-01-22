import { Container } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserPage, PostPage, Home, Auth, UpdateProfile } from "./Pages";
import { CreatePost, Header, LogoutButton } from "./Components";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
const App = () => {
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW={"620px"}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/updateProfile"
            element={
              user ? (
                <>
                  <UpdateProfile />
                </>
              ) : (
                <Navigate to={"/auth"} />
              )
            }
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pId" element={<PostPage />} />
          <Route
            path="/auth"
            element={user ? <Navigate to={"/"} /> : <Auth />}
          />
        </Routes>
      </BrowserRouter>
      {user && <LogoutButton />}
    </Container>
  );
};

export default App;
