import { useGlobalContext } from "../context/appContext";

function Landing() {
  const { isAuthenticated } = useGlobalContext();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div>
      Landing Page
      {isAuthenticated && <button onClick={handleSignOut}>Sign out</button>}
    </div>
  );
}

export default Landing;
