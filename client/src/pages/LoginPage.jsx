import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";


const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      if (!fullName || !email || !password) return;
      setIsDataSubmitted(true);
      return;
    }

    let success = false;

    try {
      if (currState === "Login") {
        success = await login?.("login", { email, password });
      } else {
        success = await login?.("signup", {
          fullName,
          email,
          password,
          bio,
        });
      }

      if (success) navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-10 max-sm:flex-col px-4">

      {/* LOGO */}
     <img
  src={assets.convonobg}
  alt="logo"
  className="w-[min(45vw,420px)] object-contain drop-shadow-lg"
/>
      {/* FORM */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white/10 backdrop-blur-lg text-white p-8 rounded-xl border border-white/20 shadow-xl w-[320px] flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          {currState}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            className="border border-white/30 bg-transparent text-white placeholder-gray-300 p-2 rounded outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              className="border border-white/30 bg-transparent text-white placeholder-gray-300 p-2 rounded outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />

            <input
              className="border border-white/30 bg-transparent text-white placeholder-gray-300 p-2 rounded outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            className="border border-white/30 bg-transparent text-white placeholder-gray-300 p-2 rounded outline-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter bio..."
            required
          />
        )}

        <button className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded hover:scale-105 transition">
          {currState === "Sign up"
            ? isDataSubmitted
              ? "Submit"
              : "Create Account"
            : "Login"}
        </button>

        <p className="text-sm text-center text-gray-300">
          {currState === "Sign up" ? (
            <>
              Already have an account?
              <span
                className="text-purple-300 cursor-pointer ml-1"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Create account
              <span
                className="text-purple-300 cursor-pointer ml-1"
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;