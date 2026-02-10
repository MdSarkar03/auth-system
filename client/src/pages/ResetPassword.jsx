import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl, userData } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map((e) => e.value).join("");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        { email, otp: otpValue },
      );
      if (data.success) {
        toast.success(data.message);
        setOtp(otpValue);
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
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

      {/* Email input form */}
      {!isEmailSent && (
        <div className="bg-slate-900 rounded-lg shadow-lg p-10 w-full sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-gray-200 text-center mb-3">
            Reset password
          </h2>
          <p className="text-center mb-6 text-sm">
            Enter your registered email address
          </p>

          <form onSubmit={onSubmitEmail}>
            <div className="flex items-center gap-3 mb-6 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" className="" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-indigo-100 text-lg"
                type="email"
                placeholder="Email id"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-800 text-white font-medium text-lg cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Otp input form */}
      {!isOtpSubmitted && isEmailSent && (
        <div className="bg-slate-900 rounded-lg shadow-lg p-10 w-full sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-gray-200 text-center mb-3">
            Reset password OTP
          </h2>
          <p className="text-center mb-6 text-sm">
            We have sent you a reset password OTP on your email
          </p>

          <form onSubmit={onSubmitOtp}>
            <div className="flex justify-between mb-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    className="w-12 h-12 bg-[#333A5C] text-indigo-100 text-center text-lg rounded-md"
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
              Submit
            </button>
          </form>
        </div>
      )}

      {/* New password input form */}
      {isEmailSent && isOtpSubmitted && (
        <div className="bg-slate-900 rounded-lg shadow-lg p-10 w-full sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-gray-200 text-center mb-3">
            New password
          </h2>
          <p className="text-center mb-6 text-sm">Enter the new password</p>

          <form onSubmit={onSubmitNewPassword}>
            <div className="flex items-center gap-3 mb-6 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="" className="" />
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="bg-transparent outline-none text-indigo-100 text-lg "
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-800 text-white font-medium text-lg cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
