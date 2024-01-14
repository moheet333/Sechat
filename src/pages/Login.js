import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/appContext";
import { Navigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
};

function Login() {
  const [values, setValues] = useState(initialState);

  const { username, register, isLoading, showAlert } = useGlobalContext();

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
    register({ username, email, password });
  };

  return (
    <>
      {username && <Navigate to="/" />}
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Login;
