import { Border } from "../component/Border";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router";
YupPassword(yup);

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        setEmailError("");
        setUsernameError("");
        setLoading(true);
        const check = await axios.get(
          "https://682b47b7d29df7a95be2cde1.mockapi.io/user"
        );
        const isUsernameExist = check.data.some(
          (item: any) => item.username === values.username
        );
        const isEmailExist = check.data.some(
          (item: any) => item.email === values.email
        );

        if (isUsernameExist || isEmailExist) {
          if (isUsernameExist) {
            setUsernameError("Username already exists");
          }
          if (isEmailExist) {
            setEmailError("Email already exists");
          }
          setLoading(false);
          return;
        }
        await axios.post(
          "https://682b47b7d29df7a95be2cde1.mockapi.io/user",
          values
        );
        navigate("/login");
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .password()
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
  });

  return (
    <Border>
      <h1 className={`text-4xl title my-3 mb-7`}>Register</h1>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          required
          name="email"
          className="w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={
            (formik.touched.email && Boolean(formik.errors.email)) || emailError ? true : undefined
          }
          onBlur={formik.handleBlur}
          type="email"
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <p className="text-red-500 mb-4">
          {(formik.touched.email && formik.errors.email) || emailError}
        </p>
        <TextField
          required
          name="username"
          className="w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.username}
          error={
            (formik.touched.username && Boolean(formik.errors.username)) ||
            usernameError ? true : undefined
          }
          onBlur={formik.handleBlur}
          type="text"
          id="outlined-basic"
          label="Username"
          variant="outlined"
        />
        <p className="text-red-500 mb-4">
          {(formik.touched.username && formik.errors.username) || usernameError}
        </p>
        <TextField
          required
          name="password"
          className="w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          onBlur={formik.handleBlur}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <p className="text-red-500 mb-4">
          {formik.touched.password && formik.errors.password}
        </p>
        <TextField
          required
          name="confirmPassword"
          className="w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          onBlur={formik.handleBlur}
          type="password"
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
        />
        <p className="text-red-500 mb-4">
          {formik.touched.confirmPassword && formik.errors.confirmPassword}
        </p>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            disabled={loading}
            className={` ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "cursor-pointer bg-white"
            } rounded-3xl mb-2 flex items-center justify-center  hover:text-white hover:bg-blue-400 duration-300 transition-all ease-in text-blue-400 w-[250px] ring-1 p-2 text-lg ring-blue-400`}
          >
            {loading ? <BeatLoader color="white" size={18} /> : "Submit"}
          </button>
        </div>
      </form>
    </Border>
  );
};
