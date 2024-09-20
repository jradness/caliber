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
    setCaliberResult(result);
    setShowModal(true);
  };

    const handleReset = () => {
      setAnswers({});
      setShowModal(false);
      setCaliberResult(null);
    };

  const handleClose = () => {
    setShowModal(false);
  };

  const allQuestionsAnswered = Object.keys(answers).length === quizQuestions.length;

  return (
    <Container className="mt-4">
      <h1>Caliber of a Man Quiz</h1>
      <br />
      <Form onSubmit={handleSubmit}>
        {quizQuestions.map((question, questionIndex) => (
          <Form.Group key={questionIndex} className="mb-4">
            <Form.Label><h5>{question.question}</h5></Form.Label>
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

    {caliberResult && (
      <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{CALIBER_DESCRIPTIONS[caliberResult.averageCaliber]?.type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {caliberResult && (
          <>
            <ul>
              {CALIBER_DESCRIPTIONS[caliberResult.averageCaliber]?.description.map((description, index) => (
                <li key={index}>{description}</li>
              ))}
            </ul>
            <hr />
            <h5>Individual Results:</h5>
            <ul>
              {quizQuestions.map((question, index) => (
                <li key={index}>
                  <strong>{question.category}:</strong> {caliberResult.individualCalibers[index]}
                </li>
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
    )}
      <br />
    </Container>
  );
};

export default QuizComponent;