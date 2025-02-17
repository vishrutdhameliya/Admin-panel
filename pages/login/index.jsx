import React, { useState } from "react";
import styles from "./login.module.scss";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Form, Formik } from "formik";
import LoginInput from "@/components/loginInput";
import CircledIconBtn from "@/components/buttons/circledIconBtn";
import Link from "next/link";
// import { signIn } from "next-auth/react";
import * as Yup from "yup";
import DotLoaderSpinner from "@/components/loaders/dotLoader";
import api from "@/utils/axios";
import { useRouter } from "next/router";

// Validation Schemas
const loginValidation = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

const registerValidation = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const csrfToken = "your_csrf_token"; // Replace with actual token
  const router = useRouter();

  const signInHandler = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", values);
      localStorage.setItem("accessToken", data.accessToken);
      setTimeout(async () => {
        router.push("/");
      }, 2000);
      console.log("Login successful", data);
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const signUpHandler = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", values);
      setRegisterSuccess("Account created successfully!");
    } catch (error) {
      setRegisterError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <div className={styles.login}>
        {/* Login Form */}
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              Admin Login <Link href="/">Go to Store</Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>Sign in</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidation}
              onSubmit={signInHandler}
            >
              {({ handleChange }) => (
                <Form>
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign in" />
                  {loginError && (
                    <span className={styles.error}>{loginError}</span>
                  )}
                  <div className={styles.forgot}>
                    <p onClick={() => router.push("/forgot")}>
                      Forgot password?
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
            <div className={styles.login__socials}>
              <span className={styles.or}>Or continue with</span>
              <div className={styles.login__socials_wrap}>
                {/* Replace providers with real authentication providers */}
                {["Google", "Facebook"].map((provider) => (
                  <div key={provider}>
                    <button
                      className={styles.social__btn}
                      onClick={() => signIn(provider.toLowerCase())}
                    >
                      <img src={`/icons/${provider}.png`} alt="" />
                      Sign in with {provider}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className={styles.login__container}>
          <div className={styles.login__form}>
            <h1>Sign up</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={registerValidation}
              onSubmit={signUpHandler}
            >
              {({ handleChange }) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="name"
                    icon="user"
                    placeholder="Full Name"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Sign up" />
                </Form>
              )}
            </Formik>
            {registerSuccess && (
              <span className={styles.success}>{registerSuccess}</span>
            )}
            {registerError && (
              <span className={styles.error}>{registerError}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
