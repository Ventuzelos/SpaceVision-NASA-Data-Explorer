import { useContext } from "react";
import AuthContext from "../context/authContext";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}

export default useAuth;