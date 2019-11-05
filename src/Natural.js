import React from "react";

import { WordPunctTokenizer, PorterStemmer, SentimentAnalyzer } from "natural";

const TRIGGER_WORDS = ["hate"];

const TOKENIZER = new WordPunctTokenizer();
const STEMMER = PorterStemmer;

function loadSentimentAnalyzer() {
  const sentimentAnalyzer = new SentimentAnalyzer.SentimentAnalyzer(
    "English",
    STEMMER,
    "pattern"
  );

  return sentimentAnalyzer;
}

export const Natural = () => {
  const [inputText] = React.useState("I do hate people. I've never liked em'");

  // const cleanedText = cleanData(inputText);

  // const analysed = SENTIMENT_ANALYZER.getSentiment(inputText);

  const sentimentAnalyzer = loadSentimentAnalyzer();

  sentimentAnalyzer.getSentiment(inputText);

  return <>{inputText}</>;
};

function cleanData(inputText) {
  // Remove punctuation, numbers
  // Lowercase
  // Tokenize
  const tokenized = tokenize(inputText);
  console.log("tokenized", tokenized);
  // Remove Stop Words
  // Stemming
  const stemmed = STEMMER.stem(tokenized);
  console.log("stemmed", stemmed);

  return stemmed;
}

function tokenize(str) {
  return TOKENIZER.tokenize(str);
}

function createDocumentTermMatrix() {}

function createCorpus() {}
