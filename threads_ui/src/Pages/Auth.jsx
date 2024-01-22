import { LoginCard, SignupCard } from "../Components";
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/AuthAtom";
const Auth = () => {
  const authScreenPage = useRecoilValue(authScreenAtom);
  return (
    <div>{authScreenPage === "login" ? <LoginCard /> : <SignupCard />}</div>
  );
};

export default Auth;
