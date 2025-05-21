import { Navigate, Outlet } from "react-router";
import useUser from "../hook/useUser";

export const ProtectedRoute = () => {
    const user = useUser((state) => state.user);

    return !user ? <Outlet /> : <Navigate to="/" />
};