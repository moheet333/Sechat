import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/appContext";
import { Navigate, useNavigate } from "react-router-dom";

const initialState = {
  identifier: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);

  const { user, login, isLoading, showAlert, isAuthenticated } =
    useGlobalContext();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { identifier, password } = values;
    if (!identifier || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    await login({ identifier, password });
    if (showAlert) {
      toast.error(`Invalid username/email or password`);
    } else {
      toast.success(`Welcome User`);
      user && navigate("/dashboard");
    }
  };

  return (
    <>
      {showAlert && (
        <p
          style={{
            color: "red",
          }}
        >
          Invalid username/email or password.
        </p>
      )}
      {isAuthenticated && <Navigate to="/" />}
      <div className="App">
        <form onSubmit={handleSubmit}>
          <label htmlFor="identifier">Username/Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <button type="submit" disabled={isLoading}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
