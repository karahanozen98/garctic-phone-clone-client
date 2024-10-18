import { useEffect } from "react";
import LoginCard from "./LoginCard";
import { useAuthSore } from "./store/authStore";
import Home from "./Home";
import { PageWrapper } from "./components/PageWrapper";

function App() {
  const user = useAuthSore((state) => state.user);
  const me = useAuthSore((state) => state.me);

  useEffect(() => {
    me();
  }, []);

  return (
    <PageWrapper>
      <div className="login">{!user ? <LoginCard /> : <Home />}</div>
    </PageWrapper>
  );
}

export default App;
