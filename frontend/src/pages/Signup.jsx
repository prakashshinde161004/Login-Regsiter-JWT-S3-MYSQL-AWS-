import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api.js";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (file) formData.append("profilePic", file);

      const data = await signup(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div className="eyebrow">Getting started</div>
        <h1>Create your account in under a minute.</h1>
        <p>
          Your details are stored securely in MySQL, and your profile picture
          is uploaded straight to Amazon S3.
        </p>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>
          <p className="subtitle">Fill in your details to get started.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="avatar-picker">
            <div className="avatar-preview">
              {preview ? (
                <img src={preview} alt="Profile preview" />
              ) : (
                name.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div>
              <label htmlFor="profilePic" className="file-btn">
                Upload profile picture (optional)
              </label>
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "block", marginTop: "0.3rem" }}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="switch-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
