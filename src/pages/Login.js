import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/appContext";
import { Navigate } from "react-router-dom";

const initialState = {
  identifier: "",
  password: "",
};

function Login() {
  const [values, setValues] = useState(initialState);

  const { username, login, isLoading, showAlert } = useGlobalContext();

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
    login({ identifier, password });
  };
  console.log(username);
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
      {username && <Navigate to="/" />}
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
