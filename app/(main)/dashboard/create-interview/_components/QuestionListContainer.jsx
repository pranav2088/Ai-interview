import React from "react";

function QuestionListContainer({ questionList }) {
  return (
    <>
      <h2 className="font-bold text-lg mb-5">Generated Interview Questions:</h2>
      <div className="p-5 bg-white rounded-xl">
        {questionList.map((item, index) => (
          <div key={index} className="rounded-xl bg-white mb-3">
            <div className="p-3 border border-gray-300 rounded-xl">
              <h2 className="font-medium">{item.question}</h2>
              <h2 className="text-sm text-primary">Type: {item?.type}</h2>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default QuestionListContainer;
