import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
const useGetUserProfile = () => {
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  useEffect(() => {
    try {
      const getUser = async () => {
        if (loading) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/user/profile/${username}`);
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setUser(data);
        } catch (error) {
          showToast("Error", error.message, "error");
        }
      };
      getUser();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, loading, username]);
  return { loading, user };
};

export default useGetUserProfile;
