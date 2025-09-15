import * as dotenv from "dotenv";
dotenv.config();

// Use the Google Gemini embedding model
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// 1. IMPORT the function from the installed library
import cosineSimilarity from "compute-cosine-similarity";

// --- The Main Logic ---
async function main() {
  // Initialize the embedding model
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
  });

  // Define our documents and query
  const documents = [
    "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
    "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
    "Sachin Tendulkar, also known as the 'God of Cricket', holds many batting records.",
    "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
    "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers."
  ];

  const query = 'tell me about the fast bowler with a unique action';

  console.log("Creating embeddings...");

  // Create embeddings for the documents and the query
  const docEmbeddings = await embeddings.embedDocuments(documents);
  const queryEmbedding = await embeddings.embedQuery(query);

  console.log("Calculating similarities...");

  // 3. USE the imported library function. No other changes are needed here.
  const scores = docEmbeddings.map(docEmbedding =>
    cosineSimilarity(queryEmbedding, docEmbedding)
  );
  console.log("Similarity Scores:", scores);
}

main();




// import similarity from "compute-cosine-similarity";

// var x = [ 5, 23, 2, 5, 9 ],
//     y = [ 3, 21, 2, 5, 14 ];

// var s = similarity( x, y );
// console.log( s ); // 0.9981908926857269