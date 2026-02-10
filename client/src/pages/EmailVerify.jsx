import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { userData, backendUrl, isLoggedIn, getUserData } =
    useContext(AppContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleDeleteInput = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp },
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendVerifyOtp = async () => {
    if (cooldown > 0) return;

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
      );

      if (data.success) {
        toast.success("OTP resent to your email");
        setCooldown(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // cooldown timer for resend otp
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // redirect to home if user is logged in and account is verified
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

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
          Verify your email
        </h2>
        <p className="text-center mb-6 text-sm">
          We have sent you a verification OTP on your email id:{" "}
          <span className="text-indigo-200">{userData && userData.email}</span>
        </p>

        <form onSubmit={onSubmitHandler}>
          <div className="flex justify-between mb-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-lg rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleDeleteInput(e, index)}
                  onPaste={handlePaste}
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-800 text-white font-medium text-lg cursor-pointer"
          >
            Verify
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-center text-sm">
          Didn't receive OTP?{" "}
          <span
            onClick={() => {
              if (loading || cooldown > 0) return;
              resendVerifyOtp();
            }}
            className={`underline ${
              loading || cooldown > 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-indigo-500 cursor-pointer"
            }`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
