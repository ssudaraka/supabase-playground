import { FormEvent, useEffect, useRef } from "react";
import { supabase } from "./utils/supabaseClient";
import { useNavigate } from "react-router-dom";

// import { AuthClient } from "@supabase/supabase-js";

// const AUTH_URL = "http://localhost:9999";
// const supabase: any = {};
// supabase.auth = new AuthClient({
//   url: AUTH_URL,
// });

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);

      if (user) {
        navigate("/profile");
      }
    };

    fetchUser();
  }, [navigate]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (emailRef.current && passwordRef.current) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (error) console.log(error);
      if (data) {
        console.log(data);
        navigate("/profile");
      }
    }
  }

  async function handleSignInWithLinkedIn() {
    supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
    });
  }

  async function handleSignInWithGoogle() {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "login",
        },
      },
    });
  }

  async function handleSignInWithKakao() {
    const { data, error } = supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        scopes: "profile_nickname profile_image",
      },
    });

    console.log(error);
    console.log(data);
  }

  // async function handlePasswordlessLogin(event: FormEvent) {
  //   event.preventDefault();

  //   if (emailRef.current) {
  //     const { data, error } = await supabase.auth.signInWithOtp({
  //       email: emailRef.current.value,
  //     });

  //     if (error) console.log(error);
  //     if (data) console.log(data);
  //   }
  // }

  async function handleMicrosoftLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email",
      },
    });

    if (error) console.error(error);
    if (data) console.log(data);
  }

  async function handleTwitterLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
    });

    if (error) console.error(error);
    if (data) console.log(data);
  }

  async function handleSignInWithSAML() {
    console.log("Start SAML sign in");
    const { data, error } = await supabase.auth.signInWithSSO({
      domain: "contoso.com",
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  async function handleSpotifyLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "spotify",
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  }

  async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  }

  // FOR TESTING
  // do the /authorize call to Kakao API
  // https://kauth.kakao.com/oauth/authorize?client_id=3886595736272ecf177591d6dd1a0f3c&redirect_uri=http%3A//localhost%3A2999/auth/callback&response_type=code&scope=account_email+profile_image+profile_nickname&state=testfromsupabase
  // then add the ID token to local storage
  // then call the supabase API
  // async function handleSignInWithKakaoIdToken() {
  //   let kakaoIdToken = localStorage.getItem("kakaotoken");

  //   const { data, error } = await supabase.auth.signInWithIdToken({
  //     provider: "kakao",
  //     token: kakaoIdToken,
  //   });

  //   console.log(data);
  //   console.log(error);
  // }

  return (
    <>
      <div className="w-1/2 mx-auto mt-10 flex flex-col items-center justify-center">
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleTwitterLogin}
        >
          Twitter
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleMicrosoftLogin}
        >
          Microsoft
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleSignInWithGoogle}
        >
          Google
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleSignInWithLinkedIn}
        >
          LinkedIn
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleSignInWithKakao}
        >
          Kakao
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleSpotifyLogin}
        >
          Spotify
        </button>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={handleSignInWithSAML}
        >
          Login with SAML
        </button>
        <a
          className="border w-1/2 my-2 border-slate-200 py-2 rounded text-center"
          href="/passwordless-login"
        >
          Login with Passwordless
        </a>
        <button
          className="border w-1/2 my-2 border-slate-200 py-2 rounded"
          onClick={signInAnonymously}
        >
          Anonymous Login
        </button>
        {/* <button onClick={handleSignInWithKakaoIdToken}>
          Login with Kakao ID Token
        </button> */}
        <form className="w-1/2" onSubmit={handleLogin}>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            ref={emailRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
            placeholder="Enter your email"
          />
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            className="block w-full py-1 px-1 rounded border border-gray-200"
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="bg-green-400 border py-2 rounded-md w-full mt-4"
          >
            Login
          </button>
        </form>
        <a className="text-sm mt-2" href="/forgot-password">
          Forgot Password?
        </a>
      </div>
    </>
  );
}

export default Login;
