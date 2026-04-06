import React, {useState} from "react";

const QuestionModal = ({open, question,onAnswer, onClose,currentPlayer}) => {
    const [selectedOption,setSelectedOption] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    if(!open || !question) return null;

    const handleSubmit = () => {
        const correct = selectedOption === question.correctAnswer;
        setIsCorrect(correct);
        setAnswered(true);

        // Call parent callback after 2 seconds
        setTimeout(()=>{
            onAnswer(correct);
            //Reset State
            setSelectedOption(null);
            setAnswered(false);
            setIsCorrect(false);
        },1000)
    }

    

    return(
        <div className="fixed inset-0 bg-black-/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border-4 border-blue-500">
                {/* player info  */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: currentPlayer?.tokenColor || '#3b82f6' }}>
                        {currentPlayer?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{currentPlayer?.name}'s Question</h3>
                        <p className="text-sm text-gray-600">{question.tileName && `📍 ${question.tileName}`}</p>
                    </div>
                </div>

                {/* Questions  */}
                <div className="bg-blue-500 text-white p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-bold mb-2">Question:</h2>
                    <p className="text-base">{question.question}</p>
                </div>

                {/* Options  */}
                {!answered ? (
                    <div className="space-y-3 mb-6">
                        {question.options.map((option,index) => (
                            <button
                                key={index}
                                onClick={()=> setSelectedOption(index)}
                                className={`
                                    w-full p-4 rounded-lg border-2 text-left transition-all
                                    ${selectedOption === index
                                        ? 'border-blue-500 bg-blue-100 shadow-md'
                                        : 'border-gray-300 bg-white hover:border-blue-300'
                                    }
                                `}>
                                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                                {option}
                            </button>
                            
                        ))}
                    </div>
                ):(
                    <div className={`
                            p-6 rounded-lg mb-6 text-center text-white text-xl font-bold
                            ${isCorrect ? 'bg-green-500' : 'bg-red-500'}
                        `}>
                        {isCorrect ? 'Correct Answer!' : 'Wrong Answer!'}
                    </div>
                )}

                {/* Submit Button  */}
                {!answered && (
                    <button
                        onClick={handleSubmit}
                        disable={selectedOption === null}
                        className={`
                            w-full py-3 rounded-lg font-bold text-white transition-all
                            ${selectedOption === null
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                            }
                        `}>Submit Answer</button>
                )}
            </div>
        </div>
    )
};

export default QuestionModal;