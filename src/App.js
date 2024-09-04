// src/App.js
import React, {useState} from "react";
import {quizData} from "./quizData";

// 랜덤하게 질문 인덱스를 반환하는 함수
function getRandomQuestionIndex(askedQuestions) {
    const remainingQuestions = quizData
        .map((_, index) => index) // 전체 인덱스 배열을 만든 후
        .filter((index) => !askedQuestions.includes(index)); // 이미 출제된 질문은 제외

    if (remainingQuestions.length === 0) return null; // 남은 질문이 없으면 null 반환

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    return remainingQuestions[randomIndex];
}

function App() {
    const [askedQuestions, setAskedQuestions] = useState([]); // 이미 물어본 질문 인덱스 저장
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getRandomQuestionIndex([]));
    const [userAnswer, setUserAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false); // 퀴즈가 끝났는지 여부
    const [score, setScore] = useState(0); // 맞춘 문제 수 저장
    const [showInput, setShowInput] = useState(true); // 입력창 표시 여부 상태 추가
    const maxQuestions = 10; // 최대 10문제 출제

    const handleAnswerSubmit = (e) => {
        e.preventDefault();

        // 정답 확인
        if (userAnswer.trim().toLowerCase() === quizData[currentQuestionIndex].answer.toLowerCase()) {
            setIsCorrect(true);
            setScore(score + 1); // 정답일 경우 스코어 증가
        } else {
            setIsCorrect(false);
        }

        setUserAnswer(""); // 입력 필드 초기화
        setShowInput(false); // 입력창 숨기기
    };

    const handleNextQuestion = () => {
        // 이미 물어본 질문 목록에 현재 질문 인덱스 추가
        const updatedAskedQuestions = [...askedQuestions, currentQuestionIndex];
        setAskedQuestions(updatedAskedQuestions);

        // 10문제 다 물어봤으면 퀴즈 종료
        if (updatedAskedQuestions.length >= maxQuestions) {
            setQuizFinished(true); // 퀴즈가 끝났음을 알림
            return;
        }

        // 다음 질문 선택 (남은 질문이 없으면 퀴즈 끝)
        const nextQuestionIndex = getRandomQuestionIndex(updatedAskedQuestions);
        if (nextQuestionIndex === null) {
            setQuizFinished(true); // 퀴즈가 끝났음을 알림
        } else {
            setCurrentQuestionIndex(nextQuestionIndex);
            setIsCorrect(null);
            setShowInput(true); // 입력창 다시 표시
        }
    };

    // 퀴즈를 다시 시작하는 함수 (모든 상태 초기화)
    const handleRestartQuiz = () => {
        setAskedQuestions([]);
        setCurrentQuestionIndex(getRandomQuestionIndex([]));
        setUserAnswer("");
        setIsCorrect(null);
        setQuizFinished(false);
        setScore(0);
        setShowInput(true); // 입력창 다시 표시
    };

    if (quizFinished) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <main
                    className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg border-4 border-pink-500 border-double">

                    <p className="text-center text-2xl font-bold my-4">{score}/{maxQuestions}</p>

                    <button onClick={handleRestartQuiz}
                            className="w-full bg-pink-500 text-white font-bold rounded-md py-2">다시핑
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <main className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg border-4 border-pink-500 border-double">

                {/* 스코어를 상단에 표시 */}
                <div className="text-center mb-4">
                    <h2>현재 점수: {score}/{maxQuestions}</h2>
                </div>

                <div className="mb-4 p-4">
                    <img className="w-full" src={quizData[currentQuestionIndex].image} alt="quiz"/>
                </div>

                {showInput && (
                    <form onSubmit={handleAnswerSubmit}>
                        <input
                            className="w-full p-3 border-4 border-pink-500 rounded-md focus:outline-none border-double mb-2 text-center"
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="정답을 입력하세요"
                            required
                        />
                        <button className="w-full bg-pink-500 text-white font-bold rounded-md py-2"
                                type="submit">제출
                        </button>
                    </form>
                )}

                {!showInput && (
                    <div className="text-center my-4">
                        <p>{isCorrect ? "정답!" : "오답!"}<br/></p>
                        <p className="font-bold text-2xl">{quizData[currentQuestionIndex].answer}</p>
                    </div>
                )}

                {!showInput && isCorrect !== null && (
                    <button onClick={handleNextQuestion}
                            className="w-full bg-pink-500 text-white font-bold rounded-md py-2">다음핑</button>
                )}
            </main>
        </div>
    );
}

export default App;
