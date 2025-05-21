import { Outlet } from "react-router"

export const Background = () => {
    return (
        <div className="bg-[url('/pct/bgLight.png')] bg-cover  bg-center bg-no-repeat w-full h-screen flex justify-center items-center">    
        <Outlet />
        </div>  
    )
}