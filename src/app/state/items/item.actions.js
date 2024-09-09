import { createAction } from "@reduxjs/toolkit";

// actions.js
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from './actionTypes';

export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER,
  };
};

export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER,
  };
};
