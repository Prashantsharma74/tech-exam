import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignQuestions,updateMarks } from '../utils/api';
import { Buffer } from 'buffer';
import technoLogo from '../images/technorizen.png'
import CryptoJS from "crypto-js";
const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('candidateToken');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // To manage the current question index
  const [type, setType] = useState('');
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime && parseInt(savedTime, 10) > 0) {
      return parseInt(savedTime, 10); 
    }
    else {
      return 30 * 60; 
    }
  });
    const [timerStarted, setTimerStarted] = useState(false);
      const [all,setAll] = useState("")
      const [userAnswers, setUserAnswers] = useState({});
      const [isSubmit, setIsSubmit] = useState(false);
  // Redirect if no token is found
  useEffect(() => {
    if (!token) {
      navigate('/information');
    }
  }, [token, navigate]);

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await AssignQuestions(token);
        if (response.status) {
          const decodedKey = Buffer.from(response.rondomToken, 'base64').toString('utf-8');
           const decode = JSON.parse(decodedKey)
           console.log(decode,"decode")
          setAll(response)
          setQuestions(decode);
          setType(response.assignedQuestions[currentIndex]?.Type || '');
        } else {
          console.error('Error fetching questions');
        }
      } catch (error) {
        if (error === 401) {
          navigate('/information');
        }
        console.error('Error fetching questions:', error);
      }
    };
  
  

    fetchQuestions();
}, [token, currentIndex, navigate]);

  useEffect(() => { 
    if (all?.isSubmit === true) {
      navigate("/success");
    }
  }, [all?.isSubmit, navigate]);  // The effect will run whenever `all.isSubmit` changes
  

  // Handle Next button click
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setType(questions[currentIndex + 1]?.Type || '');
    }
  };

  // Handle Previous button click
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setType(questions[currentIndex - 1]?.Type || '');
    }
  };

  // Get current question to display
  const currentQuestion = questions[currentIndex];


  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}  min:${secs } sec`;
  };

  useEffect( ()=>{
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft( (prevtime)=> {
       if(prevtime>0){
           const updateTime = prevtime-1;
           localStorage.setItem("remainingTime", updateTime)
           return updateTime
       }
       else{
           clearInterval(timer)
           return 0
       }
    })
    }, 1000);
return () => clearInterval(timer)
} ,[])



  // Handle the auto submit when the timer reaches 0
  const autoSubmit = () => {
    handleSubmit()
    console.log('Time is up! Automatically submitting...');
   navigate("/success")
  };
  const logoStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
  };

  const imgStyle = {
    width: '150px', // Adjust width as needed
    height: 'auto',
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };
  const capitalizedDomain =  all?.Domain ? all.Domain.toUpperCase() : 'DOMAIN';

  const handleAnswerSelection = (questionId, selectedOptionId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionId,
    }));
  };
  
  const calculateScore = () => {
    let score = 0;
  
    // Iterate over all questions, not just the current one
    questions.forEach((question) => {
      const selectedAnswerId = userAnswers[question._id];
      const correctAnswer = question.options.find((option) => option.isCorrect);
  
      if (selectedAnswerId === correctAnswer?._id) {
        score++;
      }
    });
  
    return score;
  };
  
  
  const handleSubmit = async () => {
    setIsSubmit(true);

    // Calculate the score
    const totalMarks = calculateScore();

    // Update marks using the API
    try {
      const response = await updateMarks({ totalMarks }, token);

      if (response.status) {
        console.log('Marks updated successfully:', response.totalMarks);
        navigate('/success'); // Redirect to success page
      } else {
        console.error('Error updating marks:', response.message);
      }
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };

  return (
    <div>
      <div className="main-whole-site">
        <div className="logo-with-title">
        <div style={logoStyle}>
      <img src={technoLogo} alt="TechnoRizen Logo" style={imgStyle} />
    </div>

        </div>
        <div className="main-left-right-section">
          <div className="first-left-side-inner-with-btns">
            <div className="left-side-inner-both-section">
              <div className="both-side-contain">
                <div className="left-part-contain">
                  <h4 className="left-side-contain">
                    Domain: {capitalizedDomain}
                  </h4>
                </div>
                <div className="right-side">
                  <span className="right-side-contain">{type}</span>
                </div>
              </div>
              {currentQuestion ? (
      <div className="inner-contain">
        <p>Question No: {currentIndex + 1}</p>
        <p>{currentQuestion.questionText}</p>
        <div>
          {currentQuestion.options.map((option) => (
            <div key={option._id}>
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                id={`option-${option._id}`}
                value={option._id}
                checked={userAnswers[currentQuestion._id] === option._id}
                onChange={() => handleAnswerSelection(currentQuestion._id, option._id)}
              />
              <label htmlFor={`option-${option._id}`}>{option.text}</label>
              <br />
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p>Loading question...</p>
    )}

            </div>
            <div className="bottom-btn-both">
              <div className="btn-left">
                <button
                  className="bottom-btn"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="bottom-btn"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
              <div className="btn-right">
                {currentIndex === questions.length - 1 && (
                  <button className='bottom-btn' onClick={handleSubmit}>Submit</button>                )}
              </div>
              {isSubmit && (
      <div>
        <p>Your score: {calculateScore()} out of {currentQuestion.length}</p>
      </div>
    )}
            </div>
          </div>
          <div className="right-side-with-table">
            <div className="right-side-inner-section">
              <p><b>Name</b>: {all.name}</p>
              <p><b>Candidate Id</b>: {all.id}</p>
              <p><b>Time Left</b>: {formatTime(timeLeft)}</p>
            </div>
            <div className="number-table">
              <p>
                You are viewing {capitalizedDomain}<br />
                Question Palette
              </p>
              <div className="table-block-first">
                {questions.map((_, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: currentIndex === index ? 'red' : '#add8e6', // Highlight active question
                      padding: '5px',
                      margin: '3px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    {index + 1}
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
