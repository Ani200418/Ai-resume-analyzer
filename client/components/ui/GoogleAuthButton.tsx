"use client";

import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleAuthButton() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            if (!response.credential) {
              toast.error("Google login failed: No credential received");
              return;
            }

            const credential = response.credential;
            

            const res = await axios.post("/api/auth/google", {
              credential: credential, // ✅ MUST MATCH BACKEND
            });

            setAuth(res.data.user, res.data.token);

            toast.success(`Welcome ${res.data.user.name}`);

            router.push("/dashboard");
          } catch (err: any) {
            console.error("Google login error:", err);
            toast.error(
              err?.response?.data?.error || "Google authentication failed"
            );
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );

      window.google.accounts.id.prompt();
    };

    // Load script if not loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
  }, [router, setAuth]);

  return <div id="google-btn" />;
}