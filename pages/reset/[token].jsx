import { useRouter } from "next/router";
import axios from "axios";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import LoginInput from "@/components/loginInput";
import CircledIconBtn from "@/components/buttons/circledIconBtn";
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";
import styles from "../forgot/forgot.module.scss";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // Get the reset token from the URL

  const passwordValidation = Yup.object({
    password: Yup.string()
      .required("Please enter your new password.")
      .min(6, "Password must be at least 6 characters.")
      .max(36, "Password can't be more than 36 characters"),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const handleReset = async (
    values,
    { setSubmitting, setErrors, setStatus }
  ) => {
    try {
      const { data } = await axios.post("/api/auth/reset", {
        token,
        password: values.password,
      });

      setStatus({ success: data.message });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.forgot}>
      <div>
        <div className={styles.forgot__header}>
          <div className={styles.back__svg}>
            <BiLeftArrowAlt />
          </div>
          <span>
            Reset your password?{" "}
            <Link href="/">
              <p>Login instead</p>
            </Link>
          </span>
        </div>
        <Formik
          initialValues={{ password: "", conf_password: "" }}
          validationSchema={passwordValidation}
          onSubmit={handleReset}
        >
          {({ values, errors, handleChange, isSubmitting, status }) => (
            <Form>
              <LoginInput
                type="password"
                name="password"
                icon="password"
                placeholder="New Password"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}

              <LoginInput
                type="password"
                name="conf_password"
                icon="password"
                placeholder="Confirm Password"
                value={values.conf_password}
                onChange={handleChange}
              />
              {errors.conf_password && (
                <span className={styles.error}>{errors.conf_password}</span>
              )}

              <CircledIconBtn
                type="submit"
                text={isSubmitting ? "Submitting..." : "Submit"}
              />

              {errors.apiError && (
                <span className={styles.error}>{errors.apiError}</span>
              )}
              {status?.success && (
                <span className={styles.success}>{status.success}</span>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
