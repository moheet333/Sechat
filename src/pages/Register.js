import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/appContext";

const initialState = {
  username: "",
  email: "",
  password: "",
};

function Register() {
  const [values, setValues] = useState(initialState);

  const { register } = useGlobalContext();

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
  );
}

export default Register;
