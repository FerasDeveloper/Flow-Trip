import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Verification.css";
import { baseURL, RESENDEMAIL, VERIFICATION } from "../Api/Api";

const VerificationPassword = () => {
    const inputsRef = useRef([]);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            setUserEmail(email);
        } else {
            toast.error("No email found. Please register first.");
            setTimeout(() => {
                window.location.href = "/register";
            }, 2000);
        }
    }, []);

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        const isDelete = e.inputType === "deleteContentBackward";

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
            const response = await axios.get(`${baseURL}/${RESENDEMAIL}/${userEmail}`);
            if (response.data.success || response.data.message === 'We have sent the code to your email address') {
                toast.success("Verification code has been resent to your email!");
                setVerificationCode(['', '', '', '', '', '']);
                if (inputsRef.current[0]) {
                    inputsRef.current[0].focus();
                }
            } else {
                toast.error(response.data.message || "Failed to resend verification code");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Failed to resend verification code");
            } else if (error.request) {
                toast.error("Cannot connect to server. Please check your internet connection");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const response = await axios.post(`${baseURL}/${VERIFICATION}/${userEmail}`, {
                verification_code: code
            });

            if (response.data.success || response.data.message === 'your email has been verified successfully') {
                toast.success("Email verified successfully!");
                setShowPasswordModal(true); // <-- افتح المودال لإدخال كلمة سر جديدة
            } else {
                toast.error(response.data.message || "Verification failed");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Verification failed");
            } else if (error.request) {
                toast.error("Cannot connect to server. Please check your internet connection");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(`${baseURL}/ReSetPassword/${userEmail}`, {
                new_password: newPassword,
            });
            if (response.data.message="your password has changed successfully") {
                toast.success("Password updated successfully!");
                setShowPasswordModal(false);
                setTimeout(() => {
                    window.location.href = "/register";
                }, 2000);
            } else {
                toast.error(response.data.message || "Failed to update password");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Error updating password");
            } else if (error.request) {
                toast.error("Cannot connect to server. Please check your internet connection");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="verification-wrapper">
            <ToastContainer position="top-right" autoClose={5000} />

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
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>

                    <button type="button" onClick={handleResendCode} disabled={isLoading}>
                        Resend Code
                    </button>
                </div>
            </form>

            {/* مودال تغيير كلمة السر */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Set New Password</h3>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handlePasswordSubmit} disabled={isLoading}>
                                {isLoading ? "Updating..." : "Confirm"}
                            </button>
                            <button onClick={() => setShowPasswordModal(false)} disabled={isLoading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationPassword;
