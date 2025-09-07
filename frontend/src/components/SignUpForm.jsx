import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", contact: "", email: "",
    password: "", confirmPassword: "", dob: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!formData.firstName || !formData.lastName || !formData.contact ||
        !formData.email || !formData.password || !formData.confirmPassword || !formData.dob) {
      alert("Please fill all fields!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          contact: formData.contact,
          email: formData.email,
          password: formData.password,
          dob: formData.dob
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      alert("Signup successful! Redirecting to login...");
      navigate("/login"); // navigate immediately on success
    } catch (err) {
      alert(err.message || "Signup error");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center mb-4 text-primary">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input className="form-control mb-3" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          <input className="form-control mb-3" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
          <input className="form-control mb-3" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          <div className="mb-3 position-relative">
            <input className="form-control" name="password" type={showPassword ? "text" : "password"}
                   placeholder="Password" value={formData.password} onChange={handleChange} required />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{cursor:"pointer"}} onClick={()=>setShowPassword(s=>!s)}>
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <div className="mb-3 position-relative">
            <input className="form-control" name="confirmPassword" type={showConfirm ? "text" : "password"}
                   placeholder="Re-enter Password" value={formData.confirmPassword} onChange={handleChange} required />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{cursor:"pointer"}} onClick={()=>setShowConfirm(s=>!s)}>
              {showConfirm ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <input className="form-control mb-3" name="dob" type="date" value={formData.dob} onChange={handleChange} required />

          <button className="btn btn-primary w-100 mb-2" type="submit">Sign Up</button>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">Login</Link>  {/* <-- reliable */}
          </p>
        </form>
      </div>
    </div>
  );
}
