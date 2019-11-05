import React from "react";

import { WordPunctTokenizer, PorterStemmer, SentimentAnalyzer } from "natural";
// import { SentimentAnalyzer } from "natural/lib/natural/sentiment/SentimentAnalyzer";
// var SentimentAnalyzer = require("natural").SentimentAnalyzer;

const TRIGGER_WORDS = ["hate"];

const TOKENIZER = new WordPunctTokenizer();
const STEMMER = PorterStemmer;

export const Natural = () => {
  const [negativeInputText] = React.useState(
    "I really do hate people. I've never liked em'. Fuck You!"
  );

  const [positiveInputText] = React.useState(
    "I love people. The world is great!"
  );

  const cleanedText1 = cleanData(negativeInputText);
  const cleanedText2 = cleanData(positiveInputText);

  const sentimentAnalyzer = new SentimentAnalyzer(
    "English",
    STEMMER,
    "pattern"
  );

  const sentiment1 = sentimentAnalyzer.getSentiment(cleanedText1);
  const sentiment2 = sentimentAnalyzer.getSentiment(cleanedText2);

  return (
    <>
      <h1>{negativeInputText}</h1>
      <body>{sentiment1 > 0 && "This comment is positive!"}</body>
      <body>{sentiment1 < 0 && "This comment is negative!"}</body>

      <h1>{positiveInputText}</h1>
      <body>{sentiment2 > 0 && "This comment is positive!"}</body>
      <body>{sentiment2 < 0 && "This comment is negative!"}</body>
    </>
  );
};

function cleanData(inputText) {
  // Remove punctuation, numbers
  // Lowercase
  // Tokenize
  const tokenized = tokenize(inputText);
  console.log("tokenized", tokenized);
  // Remove Stop Words
  // Stemming
  // const stemmed = STEMMER.stem(tokenized);
  // console.log("stemmed", stemmed);

  return tokenized;
}

function tokenize(str) {
  return TOKENIZER.tokenize(str);
}

function createDocumentTermMatrix() {}

function createCorpus() {}
