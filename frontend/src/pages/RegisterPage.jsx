import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Field } from "../components/Field";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await signUp(form);
      navigate("/app", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="A fresh start"
      title={<>Plan less.<br /><em>Do more.</em></>}
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <div className="form-heading">
        <span className="form-heading__number">01</span>
        <div><h2>Create account</h2><p>Set up your personal workspace.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="form-error" role="alert">{error}</div>}
        <Field label="Your name" name="name" value={form.name} onChange={updateField} placeholder="Alex Morgan" autoComplete="name" />
        <Field label="Email address" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="At least 8 characters" autoComplete="new-password" />
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create workspace"}<span aria-hidden="true">↗</span>
        </button>
      </form>
    </AuthLayout>
  );
}
