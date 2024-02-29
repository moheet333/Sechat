import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/appContext";
import { Navigate, useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
};

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);

  const { user, register, isLoading, showAlert, isAuthenticated } =
    useGlobalContext();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password } = values;
    if (!email || !username || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    const response = await register({ username, email, password });

    if (response.success) {
      toast.success(`Welcome ${username}`);
      navigate("/dashboard");
    } else {
      toast.error(`The username or email is already in use.`);
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
          The username or email is already in use.
        </p>
      )}
      {isAuthenticated && <Navigate to="/" />}
      <div className="App">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={values.email}
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

export default Register;
