import { Border } from "../component/Border";
import { TextField } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router";
import useUser from "../hook/useUser";
YupPassword(yup);

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);
  const [emailError, setEmailError] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setEmailError("");
        setLoading(true);
        const check = await axios.get(
          "https://682b47b7d29df7a95be2cde1.mockapi.io/user"
        );

        const isEmailExist = check.data.find(
          (item: any) => item.email === values.email
        );
        if (!isEmailExist) {
          setEmailError("Email or password is incorrect");
          setLoading(false);
          return;
        }
        if (isEmailExist) {
          if (isEmailExist.password !== values.password) {
            setEmailError("Email or password is incorrect");
            setLoading(false);
            return;
          }
          const { password, confirmPassword, createdAt, question, ...data } = isEmailExist;
          setUser(data);
          
          navigate("/");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(error); 
        setLoading(false);
      }
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),

      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .password()
        .required("Password is required"),
    }),
  });

  return (
    <Border>
      <h1 className={`text-4xl title my-3 mb-7`}>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          required
          name="email"
          className="w-[90%] max-w-[400px] md:w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={
            (formik.touched.email && Boolean(formik.errors.email)) || emailError
              ? true
              : undefined
          }
          onBlur={formik.handleBlur}
          type="email"
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <p className="text-red-500 w-[90%] md:w-[400px] max-w-[400px] text-start mb-4">
          {(formik.touched.email && formik.errors.email) || emailError}
        </p>
        <TextField
          required
          name="password"
          className="w-[90%] max-w-[400px] md:w-[400px]"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={
            (formik.touched.password && Boolean(formik.errors.password)) ||
            emailError
              ? true
              : undefined
          }
          onBlur={formik.handleBlur}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <p className="text-red-500 w-[90%] md:w-[400px] max-w-[400px] text-start mb-4">
          {(formik.touched.password && formik.errors.password) || emailError}
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
