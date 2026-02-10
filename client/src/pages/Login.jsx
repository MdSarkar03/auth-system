import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success("Welcome! Your account has been created");
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success("Welcome back!");
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:p-0 bg-linear-to-br from-sky-100 to-sky-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 rounded-lg shadow-lg p-10 w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-gray-200 text-center mb-3">
          {state === "Sign up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center mb-6 text-sm">
          {state === "Sign up"
            ? "Create your account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign up" && (
            <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" className="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-indigo-100 "
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-indigo-100"
              type="email"
              placeholder="Email id"
              required
            />
          </div>

          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-indigo-100"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-800 text-white font-medium text-lg cursor-pointer"
          >
            {state}
          </button>
        </form>

        {state === "Sign up" ? (
          <p className="text-gray-400 mt-4 text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-indigo-500 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 mt-4 text-center text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-indigo-500 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
