"use client"
import { QUIZ_QUESTIONS } from '@/constants/quiz-qa';
import { CALIBER_DESCRIPTIONS } from '@/constants/caliber-descriptions';
import { calculateCaliberFromAnswers } from '@/utils/point-calculator';
import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';

type Answer = {
  caliber: string;
  text: string;
};

type Question = {
  category: string;
  question: string;
  answers: Answer[];
};

const quizQuestions: Question[] = QUIZ_QUESTIONS;

const QuizComponent: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [caliberResult, setCaliberResult] = useState<{
    averageCaliber: string;
    individualCalibers: string[];
  } | null>(null);

  const handleChange = (questionIndex: number, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateCaliberFromAnswers(answers);
    setCaliberResult(result);  // Set the calculated caliber result
    setShowModal(true);        // Show the modal
  };

    // Handle resetting the quiz
    const handleReset = () => {
      setAnswers({});            // Clear all answers
      setShowModal(false);        // Hide the modal if it's open
      setCaliberResult(null);       // Clear the result
    };

  const handleClose = () => {
    setShowModal(false);       // Hide the modal
  };

  const allQuestionsAnswered = Object.keys(answers).length === quizQuestions.length;

  return (
    <Container className="mt-4">
      <h1>Caliber Quiz</h1>
      <Form onSubmit={handleSubmit}>
        {quizQuestions.map((question, questionIndex) => (
          <Form.Group key={questionIndex} className="mb-4">
            <Form.Label>{question.question}</Form.Label>
            {question.answers.map((answer, answerIndex) => (
              <Form.Check
                key={answerIndex}
                type="radio"
                label={answer.text}
                name={`question-${questionIndex}`}
                id={`question-${questionIndex}-answer-${answerIndex}`}
                value={answerIndex}
                checked={answers[questionIndex] === answerIndex}
                onChange={() => handleChange(questionIndex, answerIndex)}
              />
            ))}
          </Form.Group>
        ))}

        <Button type="submit" variant="primary" className="me-2" disabled={!allQuestionsAnswered}>
          Submit
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Form>

    {/* Modal to display the final score */}
    <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Your Caliber Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {caliberResult && (
            <>
              <h4>Average Caliber: {caliberResult.averageCaliber}</h4>
              <hr />
              <h5>Individual Results:</h5>
              <ul>
                {quizQuestions.map((question, index) => (
                  <li key={index}>
                    <strong>{question.category}:</strong> {caliberResult.individualCalibers[index]}
                  </li>
                ))}
              </ul>

              {/* Display the description of the average caliber */}
              <h5>Description for {caliberResult.averageCaliber}:</h5>
              <ul>
                {CALIBER_DESCRIPTIONS[caliberResult.averageCaliber]?.map((description, index) => (
                  <li key={index}>{description}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default QuizComponent;