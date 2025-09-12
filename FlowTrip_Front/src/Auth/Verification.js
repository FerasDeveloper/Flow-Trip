import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Verification.css";
import { baseURL, RESENDEMAIL, VERIFICATION } from "../Api/Api";

const Verification = () => {
  const inputsRef = useRef([]);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage (set during registration)

    // const email = localStorage.getItem("email");
    const emailFromLocal = localStorage.getItem("email");

    // جلب الإيميل من الكوكيز
    const emailFromCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("email="))
      ?.split("=")[1];

    if (emailFromLocal || emailFromCookie) {
      setUserEmail(emailFromCookie);
    } else {
      // If no email in localStorage, redirect back to auth
      toast.error("No email found. Please register first.");
      setTimeout(() => {
        window.location.href = "/register";
      }, 2000);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const isDelete = e.inputType === "deleteContentBackward";

    // Update verification code state
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!value && isDelete && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      toast.error("Email not found. Please register first.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending resend request to:", `http://127.0.0.1:8000/api/ReSendEmail/${userEmail}`);

      const response = await axios.get(`${baseURL}/${RESENDEMAIL}/${userEmail}`);

      console.log("Resend response:", response.data);

      if (response.data.success || response.data.message === 'We have sent the code to your email address') {
        toast.success("Verification code has been resent to your email!");

        // Clear the verification code inputs
        setVerificationCode(['', '', '', '', '', '']);

        // Focus on the first input
        if (inputsRef.current[0]) {
          inputsRef.current[0].focus();
        }
      } else {
        toast.error(response.data.message || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend error:", error);

      if (error.response) {
        // Server error
        const errorMessage = error.response.data.message || "Failed to resend verification code";
        toast.error(errorMessage);
      } else if (error.request) {
        // Connection error
        toast.error("Cannot connect to server. Please check your internet connection");
      } else {
        // Other error
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine all digits into one verification code
    const code = verificationCode.join('');

    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    if (!userEmail) {
      toast.error("Email not found. Please register first.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending verification request to:", `http://127.0.0.1:8000/api/Verification/${userEmail}`);

      const response = await axios.post(`${baseURL}/${VERIFICATION}/${userEmail}`, {
        verification_code: code
      });

      console.log("Verification response:", response.data);

      if (response.data.success || response.data.message === 'your email has been verified successfully') {
        toast.success("Email verified successfully!");

        // Get user role from localStorage
        const role = localStorage.getItem("role");

        // Redirect based on role
        setTimeout(() => {
          if (role === 'user') {
            window.location.href = "/";
          } else {
            // For any other role (owner, admin, etc.)
            window.location.href = "/create-owner/step-1";
          }
        }, 1500);
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);

      if (error.response) {
        // Server error
        const errorMessage = error.response.data.message || "Verification failed";
        toast.error(errorMessage);
      } else if (error.request) {
        // Connection error
        toast.error("Cannot connect to server. Please check your internet connection");
      } else {
        // Other error
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-wrapper">
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

      <form className="form" onSubmit={handleSubmit}>
        <div className="content">
          <p align="center">OTP Verification</p>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
            Enter the 6-digit code sent to {userEmail}
          </p>
          <div className="inp">
            {Array.from({ length: 6 }, (_, i) => (
              <input
                key={i}
                type="text"
                className="inputverify"
                maxLength={1}
                value={verificationCode[i]}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleInputChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={isLoading}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              marginBottom: '15px'
            }}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: '2px solid #4073ff',
              color: '#4073ff',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.background = '#4073ff';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#4073ff';
              }
            }}
          >
            Resend Code
          </button>
          <svg
            className="svg"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4073ff"
              d="M56.8,-23.9C61.7,-3.2,45.7,18.8,26.5,31.7C7.2,44.6,-15.2,48.2,-35.5,36.5C-55.8,24.7,-73.9,-2.6,-67.6,-25.2C-61.3,-47.7,-30.6,-65.6,-2.4,-64.8C25.9,-64.1,51.8,-44.7,56.8,-23.9Z"
              transform="translate(100 100)"
              className="path"
            ></path>
          </svg>
        </div>
      </form>
    </div>
  );
};

export default Verification;
