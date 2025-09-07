import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) { alert("Please fill all fields!"); return; }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert(err.message || "Login error");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth:420, width:"100%" }}>
        <h2 className="text-center mb-4 text-success">Login</h2>
        <form onSubmit={submit}>
          <input className="form-control mb-3" value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="Email or Phone" />
          <div className="mb-3 position-relative">
            <input className="form-control" type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
            <span className="position-absolute top-50 end-0 translate-middle-y me-3" style={{cursor:"pointer"}} onClick={()=>setShowPassword(s=>!s)}>
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
          </div>

          <button className="btn btn-success w-100 mb-2" type="submit">Login</button>

          <p className="text-center">
            Don’t have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
