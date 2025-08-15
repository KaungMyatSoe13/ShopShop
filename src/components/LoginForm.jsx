import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

function LoginForm() {
  const [isSignup, setIsSignup] = useState(true);
  // State for sign up fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupAcceptPolicy, setSignupAcceptPolicy] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupPasswordTouched, setSignupPasswordTouched] = useState(false);

  // State for sign in fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password validation: min 8 chars, at least one letter and one number
  function isPasswordValid(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  }

  // Determine if sign up is enabled
  const isSignupEnabled =
    signupName.trim() &&
    signupEmail.trim() &&
    isPasswordValid(signupPassword) &&
    signupAcceptPolicy;

  // Handle sign up form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupAcceptPolicy) {
      alert("You must accept the Privacy Policy to sign up.");
      return;
    }
    if (!isPasswordValid(signupPassword)) {
      // Don't alert, just show error below input
      setSignupPasswordTouched(true);
      return;
    }
    setSignupLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Sign up successful! You can now sign in.");
        setIsSignup(true); // Switch to sign in form
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupAcceptPolicy(false);
        setSignupPasswordTouched(false);
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (err) {
      alert("Sign up failed: " + err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle sign in form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        setLoginEmail("");
        setLoginPassword("");
        navigate("/"); // Redirect to home page
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (err) {
      setLoginError("Login failed: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Moving Side Panel */}
      <div
        className={`hidden sm:flex fixed top-0 h-screen w-1/2 bg-gray-200 z-10 items-center justify-center transition-all duration-700 ease-in-out rounded-xl shadow-lg ${
          isSignup ? "left-1/2 translate-x-0" : "left-0"
        }`}
      >
        <div className="text-center px-6">
          <h1 className="text-[2rem] font-playfair font-bold">Welcome Back!</h1>
          <h2 className="text-[1.5rem] font-playfair text-primary">
            Log in and experience the full power of ShopShop.
          </h2>
          <p className="text-gray-600 font-normal mt-2">
            We’ve made it easy to find what you love, track your orders, and
            enjoy exclusive member perks all in one place. Whether you're here
            for a wardrobe refresh or to explore trending items, we’re excited
            to have you back. Log in to continue your journey with us — where
            convenience meets style.
          </p>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="mt-6 h-10 w-32 overflow-hidden rounded-full bg-red-200 text-black relative"
          >
            <div className="flex flex-col transition-all duration-300 ease-in-out">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 hover:cursor-pointer ${
                  isSignup ? "translate-y-0" : "-translate-y-full"
                }`}
              >
                Sign Up
              </span>
              <span
                className={`hover:cursor-pointer absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                  isSignup ? "translate-y-full" : "translate-y-0"
                }`}
              >
                Sign In
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row min-h-screen">
        {/* === Sign In Form === */}
        <div
          className={`${
            isSignup ? "flex" : "hidden"
          } h-screen flex-col items-center bg-color-bg justify-center sm:fixed sm:left-0 sm:top-0 sm:h-screen sm:w-1/2 sm:z-1 sm:rounded-xl sm:shadow-lg sm:flex`}
        >
          <div className="flex flex-col items-center">
            <img className="w-20" src="/images/logoWhite.png" alt="logo" />
            <div className="text-xl font-playfair text-primary mt-4">
              Welcome to ShopShop!
            </div>
          </div>

          <div className="mt-10 w-full flex flex-col items-center">
            <div className="font-playfair text-primary text-sm">Sign In</div>
            <form
              className="flex flex-col items-center mt-4"
              onSubmit={handleLogin}
            >
              <input
                type="text"
                placeholder="Phone/Email"
                className="mb-2 p-2 border border-black-300 rounded w-80"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <div className="relative w-80 mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="p-2 border border-black-300 rounded w-full pr-10"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3 text-sm text-gray-600 hover:cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {loginError && (
                <div className="mb-2 w-80 text-red-600 text-sm">
                  {loginError}
                </div>
              )}
              <label className="mt-2 flex items-center space-x-2 mr-auto">
                <input type="checkbox" className="w-4 h-4" />
                <span>Remember me</span>
              </label>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-300 w-80 mt-7 hover:cursor-pointer"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="mt-3 flex justify-end text-sm w-80">
                <a
                  href="/forgot-password"
                  className="text-gray-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center w-full my-6">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="px-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <span>Sign In With</span>
              <div className="flex flex-row justify-center w-80 h-20 gap-10">
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Apple.png" alt="Apple" />
                </button>
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Facebook.png" alt="Facebook" />
                </button>
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Google.png" alt="Google" />
                </button>
              </div>

              {/* Mobile toggle link */}
              <div className="mt-4 text-sm text-gray-600 sm:hidden">
                New User?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setIsSignup(false)}
                >
                  Sign Up!
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* === Sign Up Form === */}
        <div
          className={`${
            isSignup ? "hidden" : "flex"
          } h-screen flex-col items-center bg-color-bg justify-center sm:fixed sm:right-0 sm:top-0 sm:h-screen sm:w-1/2  sm:z-1 sm:rounded-xl sm:shadow-lg sm:flex`}
        >
          <div className="flex flex-col items-center">
            <img className="w-20" src="/images/logoWhite.png" alt="logo" />
            <div className="text-xl font-playfair text-primary mt-4">
              Welcome to ShopShop!
            </div>
          </div>

          <div className="mt-10 w-full flex flex-col items-center">
            <div className="font-playfair text-primary text-sm">Sign Up</div>
            <form
              className="flex flex-col items-center mt-4"
              onSubmit={handleSignup}
            >
              <input
                type="text"
                placeholder="Full Name"
                className="mb-2 p-2 border border-black-300 rounded w-80"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Phone Number"
                className="mb-2 p-2 border border-black-300 rounded w-80"
                // value={signupPhone}
                // onChange={e => setSignupPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                className="mb-2 p-2 border border-black-300 rounded w-80"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <div className="relative w-80 mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="p-2 border border-black-300 rounded w-full pr-10"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (!signupPasswordTouched) setSignupPasswordTouched(true);
                  }}
                  onBlur={() => setSignupPasswordTouched(true)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3 text-sm text-gray-600 hover:cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password error message */}
              {signupPasswordTouched && !isPasswordValid(signupPassword) && (
                <div className="mb-2 w-80 text-red-600 text-sm">
                  Password must be at least 8 characters long and contain at
                  least one letter and one number.
                </div>
              )}
              <label className="mt-2 flex items-center space-x-2 mr-auto">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={signupAcceptPolicy}
                  onChange={(e) => setSignupAcceptPolicy(e.target.checked)}
                />
                <span>By Continuing accept our Privacy Policy</span>
              </label>
              <button
                type="submit"
                className={`bg-primary text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-300 w-80 mt-7 hover:cursor-pointer ${
                  !isSignupEnabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={signupLoading || !isSignupEnabled}
              >
                {signupLoading ? "Signing Up..." : "Sign Up"}
              </button>

              <div className="flex items-center w-full my-6">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="px-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <span>Sign Up With</span>
              <div className="flex flex-row justify-center w-80 h-20 gap-10">
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Apple.png" alt="Apple" />
                </button>
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Facebook.png" alt="Facebook" />
                </button>
                <button className="w-10 hover:cursor-pointer">
                  <img src="/images/Google.png" alt="Google" />
                </button>
              </div>

              {/* Mobile toggle link */}
              <div className="mt-4 text-sm text-gray-600 sm:hidden">
                Already have an account?{" "}
                <span
                  className="text-blue-400 hover:cursor-pointer"
                  onClick={() => setIsSignup(true)}
                >
                  Sign In!
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
