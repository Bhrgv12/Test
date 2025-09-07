import React from "react";

const Home = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-primary mb-3">🎉 Welcome to Home Page!</h1>
        <p className="lead">You have successfully logged in 🚀</p>
      </div>
    </div>
  );
};

export default Home;
