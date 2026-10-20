import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Command,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { Field } from "../shared/Field";
import { ThemeToggle } from "../shared/ThemeToggle";
let googleIdentityScriptPromise;
function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleIdentityScriptPromise) return googleIdentityScriptPromise;

  googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => {
      googleIdentityScriptPromise = undefined;
      reject(new Error("Google sign-in could not be loaded."));
    };
    document.head.appendChild(script);
  });
  return googleIdentityScriptPromise;
}

export function RegisterModal({
  onClose,
  onSubmit,
  error,
  onDismissError,
  googleClientId,
  onGoogleLogin,
  isSubmitting,
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#17221f]/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="relative w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-[#89958c] hover:bg-[#f0f3ee]"
        >
          <X size={17} />
        </button>
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[#eaf3dc] text-[#607c4c]">
          <GraduationCap size={21} />
        </div>
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[1.6px] text-[#96a096]">
          Create profile
        </p>
        <h2
          id="register-title"
          className="font-display text-[23px] font-extrabold"
        >
          Make it yours.
        </h2>
        <p className="mt-2 text-[12px] leading-5 text-[#7f8c83]">
          Create a profile to take tests and save your progress.
        </p>
        {error && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#f1c4b8] bg-[#fff3ee] px-3.5 py-3 text-[11px] leading-5 text-[#994a36]"
            role="alert"
          >
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={onDismissError}
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
          <Field label="Your name">
            <input
              required
              name="name"
              maxLength="100"
              autoComplete="name"
              placeholder="e.g. Sam Taylor"
              className="form-input"
            />
          </Field>
          <Field label="Email address">
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="form-input"
            />
          </Field>
          <Field label="Password">
            <input
              required
              name="password"
              type="password"
              minLength="6"
              maxLength="100"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="form-input"
            />
          </Field>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#17221f] text-[12px] font-bold text-white"
          >
            Create profile <ArrowRight size={15} />
          </button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#e6eae4]" />
          <span className="text-[9px] font-semibold uppercase tracking-[1px] text-[#a0a8a1]">
            or
          </span>
          <span className="h-px flex-1 bg-[#e6eae4]" />
        </div>
        <GoogleSignInButton
          clientId={googleClientId}
          isSubmitting={isSubmitting}
          onCredential={onGoogleLogin}
          buttonText="signup_with"
        />
        <p className="mt-4 text-center text-[9px] leading-4 text-[#9ba49d]">
          Admin access is provisioned by your system administrator.
        </p>
      </div>
    </div>
  );
}

export function LoginPage({
  onSubmit,
  onCreateProfile,
  error,
  onDismissError,
  isSubmitting,
  googleClientId,
  onGoogleLogin,
  theme,
  onToggleTheme,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen bg-[#f5f7f3] lg:grid-cols-[1fr_0.92fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#17221f] text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-20">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1500&q=85"
          alt="Student studying at a desk"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#17221f]/90 via-[#17221f]/70 to-[#294235]/65" />
        <a
          href="#home"
          className="relative z-10 flex items-center gap-3 text-white no-underline"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d8f270] text-[#17221f]">
            <Command size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display text-[20px] font-extrabold">
            formative<span className="text-[#d8f270]">.</span>
          </span>
        </a>
        <div className="relative z-10 max-w-[520px] pb-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.4px] text-[#e0f3bc]">
            <Sparkles size={13} /> A clearer way to prepare
          </span>
          <h1 className="font-display text-[42px] font-extrabold leading-[1.08] tracking-[-1.4px] xl:text-[52px]">
            Show up for the work. Let confidence follow.
          </h1>
          <p className="mt-5 max-w-[410px] text-[14px] leading-6 text-white/65">
            Your practice sets, progress, and next steps, all in one focused
            place.
          </p>
          <div className="mt-9 flex items-center gap-3 text-[11px] font-semibold text-white/75">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d8f270] text-[#17221f]">
              <Check size={15} />
            </span>
            Built around your pace, not someone else's.
          </div>
        </div>
        <p className="relative z-10 text-[10px] text-white/45">
          Formative learning space · 2026
        </p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <a
            href="#home"
            className="flex items-center gap-2.5 text-[#17221f] no-underline lg:hidden"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d8f270]">
              <Command size={18} />
            </span>
            <span className="font-display text-[17px] font-extrabold">
              formative.
            </span>
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <p className="text-[11px] text-[#7d8981]">
              New here?{" "}
              <button
                onClick={onCreateProfile}
                className="font-bold text-[#344a3b] underline underline-offset-4"
              >
                Create profile
              </button>
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <div className="mb-8">
            <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[#eaf3dc] text-[#607c4c]">
              <GraduationCap size={21} />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.6px] text-[#96a096]">
              Welcome back
            </p>
            <h2 className="font-display text-[29px] font-extrabold tracking-[-1px] text-[#1d2a23]">
              Sign in to Formative
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-[#7f8c83]">
              Pick up right where your learning left off.
            </p>
          </div>

          {error && (
            <div
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#f1c4b8] bg-[#fff3ee] px-3.5 py-3 text-[11px] leading-5 text-[#994a36]"
              role="alert"
            >
              <span className="flex-1">{error}</span>
              <button onClick={onDismissError} aria-label="Dismiss message">
                <X size={15} />
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#56645b]">
                Email address
              </span>
              <span className="relative block">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba49d]"
                />
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-[#e1e7df] bg-white pl-10 pr-3 text-[12px] outline-none transition focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold text-[#56645b]">
                Password
              </span>
              <span className="relative block">
                <LockKeyhole
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba49d]"
                />
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-[#e1e7df] bg-white pl-10 pr-11 text-[12px] outline-none transition focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[#89958c] hover:bg-[#f0f3ee]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between pt-0.5">
              <label className="inline-flex items-center gap-2 text-[10px] text-[#6f7c73]">
                <input
                  name="remember"
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-[#536c40]"
                />
                Remember me
              </label>
              <span className="text-[10px] font-semibold text-[#97a098]">
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#17221f] text-[12px] font-bold text-white transition hover:bg-[#304238] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" /> Signing
                  in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#e6eae4]" />
            <span className="text-[9px] font-semibold uppercase tracking-[1px] text-[#a0a8a1]">
              or
            </span>
            <span className="h-px flex-1 bg-[#e6eae4]" />
          </div>
          <GoogleSignInButton
            clientId={googleClientId}
            isSubmitting={isSubmitting}
            onCredential={onGoogleLogin}
          />
          <button
            onClick={onCreateProfile}
            className="mt-3 h-11 w-full rounded-lg border border-[#dfe5dd] bg-white text-[11px] font-bold text-[#4d5d52] transition hover:border-[#b9c8b4] hover:bg-[#fafbf9]"
          >
            Create a new profile
          </button>
          <p className="mt-6 text-center text-[9px] leading-4 text-[#9ba49d]">
            Your sign-in uses a secure, time-limited session.
          </p>
        </div>
        <p className="text-center text-[9px] text-[#a2aaa3]">
          © 2026 Formative. Learn at your own pace.
        </p>
      </section>
    </main>
  );
}

export function GoogleSignInButton({
  clientId,
  isSubmitting,
  onCredential,
  buttonText = "continue_with",
}) {
  const buttonRef = useRef(null);
  const credentialHandler = useRef(onCredential);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    credentialHandler.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const buttonContainer = buttonRef.current;
    if (!clientId || !buttonContainer) return undefined;
    let cancelled = false;

    loadGoogleIdentity()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (credential) credentialHandler.current(credential);
          },
          auto_select: false,
        });
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          text: buttonText,
          shape: "rectangular",
          width: Math.min(buttonContainer.clientWidth, 400),
        });
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      });

    return () => {
      cancelled = true;
      buttonContainer.replaceChildren();
    };
  }, [clientId, buttonText]);

  if (!clientId) {
    return (
      <p className="rounded-lg border border-[#e1e7df] bg-white px-3 py-3 text-center text-[10px] leading-4 text-[#7f8c83]">
        Google sign-in is unavailable until it is configured for this app.
      </p>
    );
  }

  return (
    <div>
      {loadError ? (
        <p className="mb-2 text-center text-[10px] text-[#994a36]" role="alert">
          {loadError}
        </p>
      ) : null}
      <div
        ref={buttonRef}
        className={`flex min-h-10 justify-center ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
      />
    </div>
  );
}
