import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Border } from "../component/Border";
import { PacmanLoader } from "react-spinners";
import useUser from "../hook/useUser";
import { useQuiz } from "../hook/useQuiz";
import { useNavigate } from "react-router";

export const Quiz = () => {
  const [quiz, setQuiz] = useState<any>();
  const navigate = useNavigate();
  const user = useUser((state) => state.user);
  const fetchApi = useRef<boolean>(false);
  const wrong = useQuiz((state) => state.wrong);
  const setWrong = useQuiz((state) => state.setWrong);
  const correct = useQuiz((state) => state.correct);
  const total = useQuiz((state) => state.total);
  const setTotal = useQuiz((state) => state.setAnswer);
  const answered = useQuiz((state) => state.answered);
  const setAnswered = useQuiz((state) => state.setAnswered);
  const setCorrect = useQuiz((state) => state.setCorrect);
  const setScore = useQuiz((state) => state.setScore);
  const setReset = useQuiz((state) => state.setReset);
  const setTime = useQuiz((state) => state.setTime);
  const score = useQuiz((state) => state.score);
  const time = useQuiz((state) => state.time);
  const setTimeouts = useQuiz((state) => state.setTimeout);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const pause = useRef(false);
  const [showAnswers, setAnswer] = useState({
    correct: "",
    incorrect: "",
    showAnswer: false,
  });
  const [shuffledAnswers, setShuffledAnswers] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const check = await axios.get(
          "https://682b47b7d29df7a95be2cde1.mockapi.io/user/" + user?.id
        );
        if (Object.keys(check.data.question).length !== 0) {
          setQuiz(check.data.question);
          setShuffledAnswers(
            check.data.question.results[0].incorrect_answers
              .concat(check.data.question.results[0].correct_answer)
              .sort(() => Math.random() - 0.5)
          );
          setLoading(false);
          return;
        }
        if (time <= 0 || !time) {
          setReset();
        };
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple"
        );
        await axios.put(
          `https://682b47b7d29df7a95be2cde1.mockapi.io/user/${user?.id}`,
          { question: response.data }
        );
        setQuiz(response.data);
        const answers = [
          ...response.data.results[0].incorrect_answers,
          response.data.results[0].correct_answer,
        ];
        setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
        setLoading(false);
        pause.current = false;
      } catch (error) {
        setTimeout(() => fetchData(), 500);
      }
    };
    if (answered === 10) {
      return;
    }
    if (fetchApi.current) return;
    fetchData();
    fetchApi.current = true;
  }, [fetchApi.current]);

  useEffect(() => {
    if (answered === 10) {
      return
    }
    const interval = setInterval(() => {
      setTime();
    }, 1000);
     if (!time || time <= 0) {
            setTimeouts();
            setFeedback("Time out! Better luck next time!⌛");
        }
    if (pause.current) {
      clearInterval(interval);
      return;
    };
    return () => clearInterval(interval);
  }, [pause.current, time]);

  function getNewQuestion() {
    setAnswer({
      correct: "",
      incorrect: "",
      showAnswer: false,
    });
    fetchApi.current = false;
  }

  const showAnswer = async (answer: string) => {
    pause.current = true;
    if (answer === quiz?.results[0].correct_answer) {
      const audio = new Audio("/sound/correct-answer-sound.mp3");
      audio.play();
      setAnswer({
        correct: answer,
        incorrect: "",
        showAnswer: true,
      });
      if (answered === 9) {
        setTimeout(() => setCorrect(), 3000);
      } else if (answered < 9) {
        setCorrect();
      }
      await axios.put(
        `https://682b47b7d29df7a95be2cde1.mockapi.io/user/${user?.id}`,
        { question: "" }
      );
      setTimeout(() => getNewQuestion(), 3000);
      return;
    }
    const audio = new Audio("/sound/wrong-answer-sound.mp3");
    audio.play();
    setAnswer({
      correct: quiz?.results[0].correct_answer,
      incorrect: answer,
      showAnswer: true,
    });
    setWrong();
    if (answered === 9) {
      setTimeout(() => setAnswered(), 3000);
    } else if (answered < 9) {
      setAnswered();
    }
    await axios.put(
      `https://682b47b7d29df7a95be2cde1.mockapi.io/user/${user?.id}`,
      { question: "" }
    );
    setTimeout(() => getNewQuestion(), 3000);
  };

  const handleSetFeedback = (score: number) => {
  if (score === 100) setFeedback("Perfect! You're a genius! 🏆");
  else if (score >= 90) setFeedback("Almost perfect! Amazing job! 🔥");
  else if (score >= 80) setFeedback("Great work! You really know your stuff! 👍");
  else if (score >= 70) setFeedback("Good job! Keep it up! 📈");
  else if (score >= 60) setFeedback("Not bad! Practice makes perfect! 📝");
  else if (score >= 50) setFeedback("You're halfway there! Keep learning! 📚");
  else if (score >= 30) setFeedback("Keep trying, you're improving! 💪");
  else if (score > 0) setFeedback("Don’t give up! Try again! 💡");
  else setFeedback("It's okay! Everyone starts somewhere. 🔄");
};

const handleHome = () => {
  navigate("/");
  setReset();
};

  useEffect(() => {
    if (answered === 10) {
      setScore();
      setTotal();
      handleSetFeedback(score);
    }
  }, [answered]);

  function handleAgain() {
    setReset();
    window.location.reload();
  }

  if (loading) {
    return <PacmanLoader color="#36d7b7" />;
  }

  if (answered === 10) {
    return (
      <Border>
        <h1 className="title text-3xl mb-4">Complete</h1>
        <p className="text-2xl">Score: {score}</p>
        <div>
          <p>Answered: {total}</p>
          <p>Correct: {correct}</p>
          <p>Wrong: {wrong}</p>
        </div>
        <p className="text-2xl mb-4">{feedback}</p>
        <div className="gap-4 flex">
        <button
          onClick={handleAgain}
          className="cursor-pointer bg-white hover:bg-blue-500 text-blue-500 duration-300 ease-in transition-all font-bold hover:text-white ring-2 ring-blue-500 py-2 px-4 rounded-lg"
        >
          Play Again
          </button>
          <button className="cursor-pointer bg-white hover:bg-orange-500 text-orange-500 duration-300 ease-in transition-all font-bold hover:text-white ring-2 ring-orange-500 py-2 px-4 rounded-lg" onClick={() => handleHome()}>Back to Home</button>
          </div>
      </Border>
    );
  }

  function decode(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

  return (
    <>
    <i onClick={() => navigate("/")} className="bi text-2xl text-blue-500 fixed cursor-pointer bg-gray-200 rounded-full hover:shadow-blue-400 w-10 h-10 flex pr-1 items-center justify-center hover:bg-white hover:shadow-[0px_0px_10px_0px] duration-300 ease-in transition-all  top-5 left-5 bi-box-arrow-left"></i>
    <Border className="justify-end">
      <div className="flex w-full gap-4 justify-center">
        <p>Difficulty: {quiz?.results[0].difficulty}</p>
        <p>Answered: {answered + "/10"} </p>
        <p>Timer: {time}</p>
      </div>

      <h1 className="text-center mb-[20%]">Question: {decode(quiz?.results[0].question)}</h1>

      <div className="flex flex-wrap w-full h-[50%] justify-center">
        {shuffledAnswers.map((answer: string) => (
          <button
            key={answer}
            disabled={showAnswers.showAnswer}
            onClick={() => showAnswer(answer)}
            className={`${
              showAnswers.incorrect === answer
                ? "bg-red-500 text-white ring-1 ring-red-500"
                : "text-blue-500   ring-blue-500"
            } ${
              showAnswers.correct === answer
                ? "bg-green-500 text-white ring-1 ring-green-500"
                : "text-blue-500  ring-1 ring-blue-500"
            } ${
              !showAnswers.showAnswer
                ? "hover:bg-blue-700 hover:text-white ring-1 cursor-pointer ring-blue-500"
                : "cursor-not-allowed"
            }  transition-all duration-300 ease-in w-[45%] h-[45%] font-bold py-2 px-4 rounded m-2`}
          >
            {decode(answer)}
          </button>
        ))}
      </div>
    </Border>
    </>
  );
};
