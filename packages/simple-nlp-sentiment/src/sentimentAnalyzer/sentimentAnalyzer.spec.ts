import {
  cleanData,
  aggressiveTokenizerEn,
  porterStemmer
} from "simple-nlp/src";

import { SentimentAnalyzer } from "./sentimentAnalyzer";
import {
  englishNegations,
  englishPatternVocabulary,
  englishSenticonVocabulary
} from "../languageDB";

const patternAnalyzer = new SentimentAnalyzer({
  type: "pattern",
  negations: englishNegations,
  vocabulary: englishPatternVocabulary
});
const senticonAnalyzer = new SentimentAnalyzer({
  type: "senticon",
  negations: englishNegations,
  vocabulary: englishSenticonVocabulary
});

senticonAnalyzer.stemVocabulary(porterStemmer);
patternAnalyzer.stemVocabulary(porterStemmer);

const testConfigurations: {
  analyzer: SentimentAnalyzer;
  language: string;
  testSentences: { sentence: string; score: number }[];
}[] = [
  {
    analyzer: senticonAnalyzer,
    language: "English",
    testSentences: [
      {
        sentence:
          "So is Gemini a joke, you ask? You're never sure whether Andrew Reed's cinematography is straight borrowing from Michael Mann's cool-blue visuals from Heat or mocking the sort of Angelenos that would watch that heist film and see nothing but a decor schematic for every single interior. Or, for that matter, whether composer Keegan DeWitt's is parodying the sax-heavy scores of Skinemax thrillers past or simply copying one in between icy techno interludes. The fact that the performers, especially the exceptional Kirke, keep their tongues firmly planted in their cheeks helps ground things, as does the fact that the jabs are featherweight enough to pass as shrugs. It may feel insubstantial at times, but somewhere out there, there's a twin of this film that lays on the L.A. Self-Owns Itself mojo in thick clumps. Gemini is the good-sibling version. It's worth a whirl.",
        score: -0.019897186147186146
      },
      {
        sentence:
          "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.",
        score: 0.0054324324324324345
      },
      {
        sentence:
          "But as soon as Vic decides to hit the road to Knoxville, his birthplace, sentiment infects the film like a virus. Writer-director Adam Rifkin clearly has affection for his star, but he's put him in a leaky vehicle that sinks way before the journey ends. Sam Elliott handled a similar role with more style, emotion and dramatic heft in last year's The Hero. But Reynolds, let's not forget, really is a movie star. And a great one. The pleasure of his company is still an exuberant gift. He deserves more than an opportunity missed.",
        score: -0.0017261904761904719
      },
      {
        sentence:
          "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.",
        score: 0.0054324324324324345
      },
      {
        sentence:
          'G-Eazy released his expansive third album, The Beautiful & Damned, in December with hit singles "No Limit" and "Him & I." The album featured guest appearances from Cardi B, A$AP Rocky, Charlie Puth and Halsey, and debuted at Number Three on the Billboard 200.',
        score: 0.031234848484848487
      }
    ]
  },
  {
    analyzer: patternAnalyzer,
    language: "English",
    testSentences: [
      {
        sentence:
          "So is Gemini a joke, you ask? You're never sure whether Andrew Reed's cinematography is straight borrowing from Michael Mann's cool-blue visuals from Heat or mocking the sort of Angelenos that would watch that heist film and see nothing but a decor schematic for every single interior. Or, for that matter, whether composer Keegan DeWitt's is parodying the sax-heavy scores of Skinemax thrillers past or simply copying one in between icy techno interludes. The fact that the performers, especially the exceptional Kirke, keep their tongues firmly planted in their cheeks helps ground things, as does the fact that the jabs are featherweight enough to pass as shrugs. It may feel insubstantial at times, but somewhere out there, there's a twin of this film that lays on the L.A. Self-Owns Itself mojo in thick clumps. Gemini is the good-sibling version. It's worth a whirl.",
        score: -0.014935064935064933
      },
      {
        sentence:
          "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.",
        score: -0.02702702702702703
      },
      {
        sentence:
          "But as soon as Vic decides to hit the road to Knoxville, his birthplace, sentiment infects the film like a virus. Writer-director Adam Rifkin clearly has affection for his star, but he's put him in a leaky vehicle that sinks way before the journey ends. Sam Elliott handled a similar role with more style, emotion and dramatic heft in last year's The Hero. But Reynolds, let's not forget, really is a movie star. And a great one. The pleasure of his company is still an exuberant gift. He deserves more than an opportunity missed.",
        score: -0.021428571428571425
      },
      {
        sentence:
          "Sadly, stereotypes are this film’s stock in trade. Is Melinda a victim or a warrior or just batshit crazy? The movie can't or won’t decide. Taraji will rise again, she always does. But enduing a full 120 minutes of this shitstorm takes its toll. Bitterness, anger, malice, bad blood – that’s acrimony, baby. And that's what you'll feel if you blow the price of ticket on this hack job.",
        score: -0.02702702702702703
      },
      {
        sentence:
          'G-Eazy released his expansive third album, The Beautiful & Damned, in December with hit singles "No Limit" and "Him & I." The album featured guest appearances from Cardi B, A$AP Rocky, Charlie Puth and Halsey, and debuted at Number Three on the Billboard 200.',
        score: 0.022727272727272728
      }
    ]
  }
];

describe("The sentiment analyzer analyzes the sentiment of sentences in multiple languages using different types of vocabularies", function() {
  testConfigurations.forEach(config => {
    config.testSentences.forEach(({ sentence, score: _score }) => {
      // Currently only supports English
      // TODO: add support for other languages
      const tokens = cleanData({
        text: sentence,
        tokenizer: aggressiveTokenizerEn,
        stemmer: porterStemmer
      });

      const { score } = config.analyzer.getSentiment(tokens);

      test(`Should analyze a set of sentences with each configuration (${config.language})`, () => {
        expect(score).toEqual(_score);
      });
    });
  });
});
