import { BrowserRouter, Route, Routes, Navigate } from "react-router"
import { Home } from "./page/Home"
import { Background } from "./layout/Background"
import { Login } from "./page/Login"
import { Register } from "./page/Register"
import { ProtectedRoute } from "./component/ProtectedRoute"
import { Quiz } from "./page/Quiz"
import useUser from "./hook/useUser"

function App() {
    const user = useUser((state) => state.user);

    return <BrowserRouter>
            <Routes>
                <Route element={<Background />}>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/" />} />
                </Route>
            </Routes>
        </BrowserRouter>
        
}

export default App
