import { Border } from "../component/Border"
import { useNavigate } from "react-router"
import useUser from "../hook/useUser"
import { useEffect, useState } from "react"
import axios from "axios"
import { BeatLoader } from "react-spinners"
import { useQuiz } from "../hook/useQuiz"

export const Home = () => {
    const navigate = useNavigate()
    const answered = useQuiz((state) => state.answered);
    const score = useQuiz((state) => state.score);
    const correct = useQuiz((state) => state.correct);
    const time = useQuiz((state) => state.time);
    const user = useUser((state) => state.user);
    const logout = useUser((state) => state.logout);
    const updateUser = useUser((state) => state.updateUser);
    const [loading, setLoading] = useState(false);
    const [rule, setRule] = useState(false);
    const [byClick, setByClick] = useState(false);
    const setAll = useQuiz((state) => state.setAll);

    const handleClick = async () => {
        if (!user?.rule) {
            setRule(true);
        } else {
            navigate("/quiz");
        }
    }

    useEffect(() => {
        if (user?.quiz.answered && user?.quiz.answered > 0) {
            setAll({
                wrong: user?.quiz.wrong,
                total: user?.quiz.total,
                answered: user?.quiz.answered,
                correct: user?.quiz.correct,
                score: user?.quiz.score,
                time: user?.quiz.time,
            });
        }
}, []);

    const handleContinue = async () => {
        setLoading(true);
        const ruleElement = document.getElementById("rule") as HTMLInputElement;
        if (ruleElement?.checked) {
            await axios.put(`https://682b47b7d29df7a95be2cde1.mockapi.io/user/${user?.id}`, {rule: true});
            updateUser("rule",true);
            setRule(false);
            navigate("/quiz");
            setLoading(false);
        }
      navigate("/quiz");
      setLoading(false);
    }
    
    const handleLogout = async () => {
        await axios.put(`https://682b47b7d29df7a95be2cde1.mockapi.io/user/${user?.id}`, {quiz: {answered: answered, score: score, correct: correct, time: time}}); 
        logout();
    }

    const handlebyClick = async () => {
        setRule(true);
        setByClick(true);
    }

    const handleExit = async () => {
        setRule(false);
        setByClick(false);
    }

    if (user) {
        return (
        <><i onClick={handlebyClick} className="top-5 fixed left-5 bg-gray-200 w-[40px] cursor-pointer transition-all ease-in duration-300 hover:scale-110 h-[40px] flex justify-center items-center ring-1 text-2xl text-blue-400 ring-blue-400 rounded-full bi bi-exclamation-lg"></i>
          <Border>
            <h1 className={`text-4xl title my-3 mb-5`}>Hello, {user.username as string}</h1>
            <button onClick={handleClick} className="rounded-3xl cursor-pointer hover:text-white hover:bg-blue-400 duration-300 transition-all ease-in text-blue-400 w-[250px] ring-1 p-2 text-lg ring-blue-400">Play</button>
            {rule && <div onClick={handleExit} className="fixed top-0 left-0 w-screen flex justify-center items-center h-screen bg-[rgba(255,255,255,0.5)]">
                <div onClick={(e) => e.stopPropagation()} className="bg-white gap-0.5  word-break rounded-xl p-5 flex flex-col items-start justify-center md:w-[500px] md:h-fit h-full w-full shadow-[0px_0px_10px_0px] shadow-blue-400">
                    <i onClick={handleExit} className="bi bi-x-lg md:static absolute rounded-full w-[40px] h-[40px] bg-gray-200 hover:shadow-[0px_0px_10px_0px] hover:shadow-red-400 hover:bg-red-400 hover:text-white hover:scale-110 transition-all ease-in duration-300 text-2xl text-red-400 ring-1 ring-red-400 md:top-[-5%] justify-center items-center flex top-5 right-5 ml-[94%] md:mb-[-8%]  cursor-pointer"></i>
                    <h2 className="text-2xl w-full text-center title">Rules</h2>
                    <p>1.⏳ You have a total of 100 seconds to complete the quiz.</p>
                    <p>2.❌ You cannot go back to previous questions once answered.</p>
                    <p>3.💾 Your progress will be saved automatically, even if you close or refresh the browser, or if your device suddenly shuts down.</p>
                    <p>4.🔁 When you return, your previous answers and remaining time will be restored.</p>
                    <p>5.📱 Please do not refresh the page unnecessarily, as it may interrupt your focus, even though your data is safe.</p>
                    <p>6.🧠 Choose your answers carefully, as you cannot change them once submitted.</p>
                    <div className={`${byClick && "hidden"} flex justify-between items-center w-full`}>
                       {!byClick && <label htmlFor="rule"> <input id="rule" className="mr-1 cursor-pointer" type="checkbox" name="rule"></input>Do not show this again</label>}
                    <button disabled={loading} onClick={handleContinue} type="submit" className={` ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "cursor-pointer bg-white"
            } rounded-3xl mb-2 flex items-center justify-center  hover:text-white hover:bg-blue-400 duration-300 transition-all ease-in text-blue-400 w-[250px] ring-1 p-2 text-lg ring-blue-400`}
          >
            {loading ? <BeatLoader color="white" size={20} /> : "Continue"}
          </button>
                    </div>
                </div>
                </div>}
            <p className="my-1">or</p>
            <button onClick={handleLogout} className="rounded-3xl cursor-pointer hover:text-white hover:bg-orange-400 duration-300 transition-all mb-3 ease-in text-orange-400 w-[250px] ring-1 p-2 text-lg ring-orange-400">Logout</button>
        </Border>  
        </>
        )
    }

    return (
        <Border>
            <h1 className={`text-4xl title my-3 mb-5`}>Hello, please</h1>
            <button onClick={() => navigate('/login')} className="rounded-3xl cursor-pointer hover:text-white hover:bg-blue-400 duration-300 transition-all ease-in text-blue-400 w-[250px] ring-1 p-2 text-lg ring-blue-400">Login</button>
            <p className="my-1">or</p>
            <button onClick={() => navigate('/register')} className="rounded-3xl cursor-pointer hover:text-white hover:bg-orange-400 duration-300 transition-all ease-in text-orange-400 w-[250px] ring-1 p-2 text-lg ring-orange-400">Register</button>
            <h2 className="text-3xl title my-3">to play!!</h2>
        </Border>
    )
}