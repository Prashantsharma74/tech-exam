import React, { useState } from "react";
import "./Signup.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Signup, loginApi } from "../utils/api"; // Ensure these functions are defined in utils/api.js
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const SignInSignUp = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    phoneNumber: "",
    name: "",
    lastname: "",
    address: "",
    experience: 0,
    Domain: "",
  });

  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: "",
    phoneNumber: "",
  });

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
   
      setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Signup(signupData); // Replace with appropriate API call
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: "Signed up successfully",
        });
        setIsSignUpMode(false); // Switch back to login or clear form
      } else {
        const errorData = await response.json();
        Toast.fire({
          icon: "error",
          title: errorData.message || "Signup failed!",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "An error occurred during signup!",
      });
    }
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi(loginData); // Replace with appropriate API call
      localStorage.setItem("candidateToken", response.token)
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
        console.log("Token:", response.token); // Use this token as needed

        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        Toast.fire({
          icon: "error",
          title: "Login Failed",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "An error occurred during signup!",
      });
    }
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form className="sign-in-form" onSubmit={handleLoginSubmit}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleLoginChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                required
                pattern="\d{10}"
                onChange={handleLoginChange}
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* Sign Up Form */}
          <form className="sign-up-form" onSubmit={handleSignupSubmit}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="name"
                placeholder="First Name"
                value={signupData.name}
                required
                onChange={handleSignupChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={signupData.lastname}
                required
                onChange={handleSignupChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={signupData.email}
                onChange={handleSignupChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number (optional)"
                value={signupData.phoneNumber}
                pattern="\d{10}" // Ensures valid phone format
                onChange={handleSignupChange}
              />
            </div>
            <div className="input-field">
  <i className="fas fa-map-marker-alt"></i>
  <input
    type="text"
    name="address"
    placeholder="address"
    required
    value={signupData.address}
    onChange={handleSignupChange}
  />
</div>


            <div className="input-field">
              <i className="fas fa-briefcase"></i>
              <input
                type="number"
                name="experience"
                placeholder="Experience (in years)"
                required
                min="0"
                max="50"
                onChange={handleSignupChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-code"></i>
              <select
                name="Domain"
                value={signupData.Domain}
                onChange={handleSignupChange}
                required
                style={{border:"1px solid"}}
              >
                <option value="" disabled>
                  Select Domain
                </option>
                <option value="flutter">Flutter</option>
                <option value="react native">React Native</option>
                <option value="mernStack">MERN Stack</option>
                <option value="AI">AI</option>
                <option value="php">PHP</option>
                <option value="ui and ux">UI and UX</option>
              </select>
            </div>
            <input type="submit" className="btn" value="Sign up" />
          </form>

        </div>
      </div>

      {/* Panels */}
      <div className="panels-container">
        {/* Left Panel */}
        <div className="panel left-panel">
          <div className="content">
            <h3>New to our community?</h3>
            <button className="btn transparent" onClick={toggleMode} id="sign-up-btn">
              Sign up
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel right-panel">
          <div className="content">
            <h3>One of our valued members?</h3>
            <button className="btn transparent" onClick={toggleMode} id="sign-in-btn">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
