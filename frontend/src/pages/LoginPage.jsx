import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Field } from "../components/Field";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signIn(form);
      navigate("/app", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title={<>Your day,<br /><em>in focus.</em></>}
      footerText="New to TaskFlow?"
      footerLink="/register"
      footerLabel="Create an account"
    >
      <div className="form-heading">
        <span className="form-heading__number">01</span>
        <div><h2>Sign in</h2><p>Pick up where you left off.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="form-error" role="alert">{error}</div>}
        <Field label="Email address" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="Enter your password" autoComplete="current-password" />
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Continue"}<span aria-hidden="true">↗</span>
        </button>
      </form>
    </AuthLayout>
  );
}
