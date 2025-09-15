import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthStyle.css";
import aircraftImage from "../Assets/undraw_aircraft_usu4.svg";
import luggageImage from "../Assets/undraw_luggage_k1gn.svg";
import ButtonAuth from "../Component/ButtonAuth";
import { baseURL, CREATEUSER, LOGIN } from "../Api/Api";
import Cookies from "js-cookie";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Handle OAuth success
  const handleAuthSuccess = (userData) => {
    console.log("=== Google OAuth Success ===");
    console.log("User Data:", userData);
    console.log("Token:", userData.token);
    console.log("Name:", userData.name);
    console.log("Email:", userData.email);
    console.log("============================");

    // Store user data in localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user_name", userData.name);
    localStorage.setItem("user_email", userData.email);
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("role", userData.role_id);
    // localStorage.setItem("user_type", "user");

    // Show success message
    toast.success("تم تسجيل الدخول بنجاح!", { position: "top-right" });

    // Redirect to home page
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // Check for OAuth callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const token = urlParams.get('token');
    const userName = urlParams.get('name');
    const userEmail = urlParams.get('email');
    const userId = urlParams.get('id');
    const userRole = urlParams.get('role_id');

    if (authSuccess === 'true' && token) {
      // Clear URL parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);

      handleAuthSuccess({
        token: token,
        name: decodeURIComponent(userName || ''),
        email: decodeURIComponent(userEmail || ''),
        id: userId,
        role_id: userRole
      });
    }
  }, []);


  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRegisterData({ ...registerData, role: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login attempt with:", loginData);

    // Validate input data
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending request to:", "http://127.0.0.1:8000/api/Login");
      const response = await axios.post(`${baseURL}/${LOGIN}`, {
        email: loginData.email,
        password: loginData.password,
      });

      console.log("Response received:", response.data);

      if (response.data.message === "Welcome") {
        // Extract user data from

        const token = response.data.token;
        const name = response.data.name;
        const role = response.data.role;
        const email = response.data.email;

        console.log("Token:", token);
        console.log("Name:", name);
        console.log("Role:", role);

        // // Save user data to localStorage
        // localStorage.setItem("token", token);
        // localStorage.setItem("name", name);
        // localStorage.setItem("role", role);
        if (rememberMe) {
          // إذا كبس تذكرني → نخزن بالـ localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
        } else {
          // افتراضي → نخزن بالكوكيز
          Cookies.set("token", token, { expires: 1 }); // يوم واحد
          Cookies.set("role", role, { expires: 1 });
          Cookies.set("name", name, { expires: 1 });
          Cookies.set("email", email, { expires: 1 });
        }
        // Show welcome notification
        toast.success(`Welcome ${name}!`);

        // Redirect user based on role
        // setTimeout(() => {
        //   switch (role) {
        //     case "admin":
        //       window.location.href = "/Admin/dashbord/requist";
        //       break;
        //     case "Vehicle Owner":
        //       window.location.href = "/VehiclyOwner/dashboard/vehiclys";
        //       break;
        //     case "Tourism Company":
        //       window.location.href = "/TourismCompany/dashboard/packages";
        //       break;
        //     case "User":
        //       window.location.href = "/";
        //       break;
        //     case "Airlines Company":
        //       window.location.href = "/Airlines Company/dashboard";
        //       break;
        //     default:
        //       window.location.href = "/Accommodation/dashboard";
        //       break;
        //   }
        // }, 1500);
        setTimeout(() => {
          switch (role) {
            case "admin":
              navigate("/Admin/dashboard/requist");
              break;
            case "Vehicle Owner":
              navigate("/VehiclyOwner/dashboard/vehiclys");
              navigate("/VehicleOwner/dashboard/vehiclys");
              break;
            case "Tourism Company":
              navigate("/TourismCompany/dashboard/packages");
              break;
            case "user":
              navigate("/");
              break;
            case "Airlines Company":
              navigate("/AirlinesCompany/dashboard");
              break;
            case "Activity Owner":
              navigate("/ActivityOwner/profile");
              break;
            default:
              navigate("/Accommodation/dashboard");
              break;
          }
        }, 1500);

      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server error
        const errorMessage =
          error.response.data.message || "Invalid email or password";
        toast.error(errorMessage);
      } else if (error.request) {
        // Connection error
        toast.error(
          "Cannot connect to server. Please check your internet connection"
        );
      } else {
        // Other error
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Register attempt with:", registerData);

    // Validate input data
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.phone ||
      !registerData.role
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Validate phone number
    if (registerData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Determine role_id based on selected role
      const role_id = registerData.role === "user" ? 3 : 4;

      console.log(
        "Sending registration request to:",
        `${baseURL}/${CREATEUSER}`
      );

      const response = await axios.post(`${baseURL}/${CREATEUSER}`, {
        name: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role_id: role_id,
        phone_number: registerData.phone,
      });

      console.log("Registration response:", response.data);

      // if (
      //   response.data.success ||
      //   response.data.message === "User Created Successfully"
      // ) {
      //   console.log(response.data)
      //   const token = response.data.token;
      //   const role = registerData.role;
      //   const name = registerData.username;
      //   const storage = rememberMe ? localStorage : sessionStorage;

      //   storage.setItem("token", token);
      //   storage.setItem("role", role);
      //   storage.setItem("name", name);
      //   storage.setItem("email", registerData.email);

      //   toast.success("Registration successful! Redirecting to verification...");

      //   setRegisterData({
      //     username: "",
      //     email: "",
      //     password: "",
      //     phone: "",
      //     role: "user",
      //   });

      //   setTimeout(() => {
      //     window.location.href = "/verification";
      //   }, 1500);
      // }
      if (
        response.data.success ||
        response.data.message === "User Created Successfully"
      ) {
        console.log(response.data)
        const token = response.data.token;
        const role = registerData.role;
        const name = registerData.username;

        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("name", name);
          localStorage.setItem("email", registerData.email);
        } else {
          Cookies.set("token", token, { expires: 1 });
          Cookies.set("role", role, { expires: 1 });
          Cookies.set("name", name, { expires: 1 });
          Cookies.set("email", registerData.email, { expires: 1 });
        }

        toast.success("Registration successful! Redirecting to verification...");

        setRegisterData({
          username: "",
          email: "",
          password: "",
          phone: "",
          role: "user",
        });

        setTimeout(() => {
          window.location.href = "/verification";
        }, 1500);
      }

      else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        // Server error
        const errorMessage =
          error.response.data.message || "Registration failed";
        toast.error(errorMessage);
      } else if (error.request) {
        // Connection error
        toast.error(
          "Cannot connect to server. Please check your internet connection"
        );
      } else {
        // Other error
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const Sociallogin = () => {
    // Store current URL to return to after OAuth
    localStorage.setItem('oauth_redirect', window.location.pathname);

    // Redirect to Google OAuth
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  return (
    <div className={`registercontainer ${isSignUp ? "sign-up-mode" : ""}`}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="form_container">
        <div className="signin_signup">
          {/* Login form */}
          <form className="sign_in_form" onSubmit={handleLogin}>
            <h2 className="title">Login</h2>

            <div className="wave-group">
              <input
                required
                type="email"
                className="inputregister"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Email".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
            </div>

            <div className="wave-group password-group">
              <input
                required
                type={showPasswordLogin ? "text" : "password"}
                className="inputregister"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Password".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
              <span
                className="eye-icon"
                onClick={() => setShowPasswordLogin((prev) => !prev)}
              >
                {showPasswordLogin ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </span>
            </div>

            <div className="forgot-password" style={{ marginBottom: "1.5rem" }}>
              <a href="/verificationpassword">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
              style={{
                width: "131px",
                height: "51px",
                border: "none",
                borderRadius: "15px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                background:
                  "linear-gradient(to bottom right, var(--color2) 0%, rgba(69, 87, 109, 0) 30%)",
                backgroundColor: "rgba(69, 87, 109, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  width: "127px",
                  height: "47px",
                  borderRadius: "13px",
                  backgroundColor: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  color: "var(--color6)",
                  fontWeight: "600",
                }}
              >
                {isLoading ? (
                  <div style={{ animation: "spin 1s linear infinite" }}>
                    <svg width="27" height="27" viewBox="0 0 24 24">
                      <path
                        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                        opacity="0.25"
                      />
                      <path d="M12 2a10 10 0 0 0-10 10h2a8 8 0 0 1 8-8z">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          dur="1s"
                          values="0 12 12;360 12 12"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                ) : (
                  <svg width="27" height="27" viewBox="0 0 24 24">
                    <path
                      d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Loading..." : "Login"}</span>
              </div>
            </button>

            <div className="social_login">
              <p>Or</p>
              {/* <div className="social_icons" onClick={Sociallogin} style={{ cursor: "pointer" }}>
                <a >
                  <img
                    src={require("../Assets/Google_Logo.png")}
                    alt="Google Login"
                    className="social_icon"
                  />
                </a>
              </div> */}
              <div
                className="social_icons"
                onClick={Sociallogin}
                style={{ cursor: "pointer" }}
              >
                <a>
                  <img
                    src={require("../Assets/Google_Logo.png")}
                    alt="Google Login"
                    className="social_icon"
                  />
                </a>
              </div>




            </div>
          </form>

          {/* Register form */}
          <form className="sign_up_form" onSubmit={handleRegister}>
            <h2 className="title">Create Account</h2>

            <div className="wave-group">
              <input
                required
                type="text"
                className="inputregister"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Username".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
            </div>

            <div className="wave-group">
              <input
                required
                type="email"
                className="inputregister"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Email".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
            </div>

            <div className="wave-group">
              <input
                required
                type="text"
                inputMode="numeric"
                className="inputregister"
                name="phone"
                value={registerData.phone}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
                onChange={handleRegisterChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Phone".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
            </div>

            <div className="wave-group password-group">
              <input
                required
                type={showPasswordRegister ? "text" : "password"}
                className="inputregister"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              <span className="bar"></span>
              <label className="label">
                {"Password".split("").map((char, i) => (
                  <span key={i} className="label-char" style={{ "--index": i }}>
                    {char}
                  </span>
                ))}
              </label>
              <span
                className="eye-icon"
                onClick={() => setShowPasswordRegister((prev) => !prev)}
              >
                {showPasswordRegister ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </span>
            </div>

            {/* Role Radio Buttons */}
            <div className="glass-radio-group" style={{ marginBottom: "1rem" }}>
              <input
                type="radio"
                name="role"
                id="role-user"
                value="user"
                checked={registerData.role === "user"}
                onChange={handleRoleChange}
              />
              <label htmlFor="role-user">User</label>

              <input
                type="radio"
                name="role"
                id="role-owner"
                value="owner"
                checked={registerData.role === "owner"}
                onChange={handleRoleChange}
              />
              <label htmlFor="role-owner">Owner</label>

              <div className="glass-glider"></div>
            </div>

            {/* Remember Me Checkbox */}
            <div
              className="remember-checkbox"
              style={{ marginBottom: "1.5rem" }}
            >
              {/* <label className="containercheckbox">
                <input type="checkbox" />
                <svg viewBox="0 0 64 64" height="1em" width="1em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="pathcheckbox"
                  ></path>
                </svg>

                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "0.9rem",
                    color: "var(--color1)",
                  }}
                >
                  Remember me
                </span>
              </label> */}
              <label className="containercheckbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <svg viewBox="0 0 64 64" height="1em" width="1em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="pathcheckbox"
                  ></path>
                </svg>
                <span style={{ marginLeft: "8px", fontSize: "0.9rem", color: "var(--color1)" }}>
                  Remember me
                </span>
              </label>

            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
              style={{
                width: "131px",
                height: "51px",
                border: "none",
                borderRadius: "15px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                background:
                  "linear-gradient(to bottom right, var(--color2) 0%, rgba(69, 87, 109, 0) 30%)",
                backgroundColor: "rgba(69, 87, 109, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s ease",
              }}
            >
              <div
                style={{
                  width: "127px",
                  height: "47px",
                  borderRadius: "13px",
                  backgroundColor: "var(--color1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  color: "var(--color6)",
                  fontWeight: "600",
                }}
              >
                {isLoading ? (
                  <div style={{ animation: "spin 1s linear infinite" }}>
                    <svg width="27" height="27" viewBox="0 0 24 24">
                      <path
                        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                        opacity="0.25"
                      />
                      <path d="M12 2a10 10 0 0 0-10 10h2a8 8 0 0 1 8-8z">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          dur="1s"
                          values="0 12 12;360 12 12"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                ) : (
                  <svg width="27" height="27" viewBox="0 0 24 24">
                    <path
                      d="M15 14a6 6 0 1 0-6 0 8 8 0 0 0-6 7 1 1 0 0 0 1 1h8.26a7.87 7.87 0 0 1-.26-2 8 8 0 0 1 5-7.42zm-6-2a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm13 7h-2v-2a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Loading..." : "Register"}</span>
              </div>
            </button>

            <div className="social_login">
              <p>Or</p>
              <div className="social_icons">
                <a href="#">
                  <img
                    src={require("../Assets/Google_Logo.png")}
                    alt="Google Login"
                    className="social_icon"
                  />
                </a>

              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="panels_container">
        <div className="panel left_panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Create an account to explore and participate in your favorite
              events.
            </p>
            <button className="re_button transparent" onClick={handleToggle}>
              Sign Up
            </button>
          </div>
          <img src={aircraftImage} className="image" alt="aircraft" />
        </div>

        <div className="panel right_panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome back! Log in to access your events.</p>
            <button className="re_button transparent" onClick={handleToggle}>
              Login
            </button>
          </div>
          <img src={luggageImage} className="image" alt="luggage" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
