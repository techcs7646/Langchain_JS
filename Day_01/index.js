// // Step 1: Load the API key from the .env file (no change here)
// import * as dotenv from "dotenv";
// dotenv.config();

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.0-flash",
//   temperature: 1.5,
//   maxOutputTokens: 10
// });

// async function main() {
//   const result = await model.invoke("tell me about india");
//   console.log(result.content);
// }

// main();

// =====================================================================================

// Embedding model implementation
// import * as dotenv from "dotenv";
// dotenv.config();

// // 1. Import the embedding model class
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// // 2. Initialize the model
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   model: 'gemini-embedding-001' // A model specifically for creating embeddings
// });
// async function main() {
//   console.log("--- Creating Embeddings ---");

//   // // 3. Create an embedding for a single piece of text (like a user's question)
//   // const question = "What is the capital of India?";
//   // const questionVector = await embeddings.embedQuery(question);

//   // console.log(questionVector);

//   // 4. Create embeddings for multiple pieces of text (like your documents)
//   const documents = [
//     "The capital of France is Paris.",
//     "Delhi is the capital of India.",
//     "Apples are a type of fruit.",
//   ];
//   const documentVectors = await embeddings.embedDocuments(documents);
//   console.log(documentVectors);

// }

// main();

// ==================================================================================
// embedding matching is how you find the "closest" or "most similar" items 

import * as dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// --- The Math Part ---
// Since JavaScript doesn't have a built-in like scikit-learn,
// we provide the cosine similarity function ourselves.
function cosineSimilarity(vecA, vecB) {
  // 1. Calculate the dot product
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  // 2. Calculate the magnitude of each vector
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vecA.length; i++) {
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // 3. Return the similarity
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero
  } else {
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// --- The Main Logic ---
async function main() {
  // 1. Initialize the embedding model
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001", // This model has a fixed dimension of 768
  });

  // 2. Define our documents and query (specific to India for relevance)
  const documents = [
    "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
    "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
    "Sachin Tendulkar, also known as the 'God of Cricket', holds many batting records.",
    "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
    "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers."
  ];

  const query = 'tell me about the fast bowler with a unique action';

  console.log("Creating embeddings...");

  // 3. Create embeddings for the documents and the query
  const docEmbeddings = await embeddings.embedDocuments(documents);
  const queryEmbedding = await embeddings.embedQuery(query);

  console.log("Calculating similarities...");

  // 4. Calculate the cosine similarity scores
  const scores = docEmbeddings.map(docEmbedding =>
    cosineSimilarity(queryEmbedding, docEmbedding)
  );
  console.log(scores);

  // // 5. Find the document with the highest score
  // const maxScore = Math.max(...scores);
  // const bestIndex = scores.indexOf(maxScore);

  // // 6. Print the results
  // console.log("\n--- Results ---");
  // console.log("Query:", query);
  // console.log("Best Matching Document:", documents[bestIndex]);
  // console.log("Similarity Score:", maxScore);
  // console.log("---------------");
}

main();