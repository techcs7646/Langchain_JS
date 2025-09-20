// import * as dotenv from "dotenv";
// dotenv.config();

// import { PromptTemplate } from "@langchain/core/prompts";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const llm = new ChatGoogleGenerativeAI({
//   temperature: 0,
//   model: "gemini-2.0-flash-001",
// });

// //Example 1 : prompt having no input variables
// const noInput = new PromptTemplate({
//   template: "What is the capital of India?",
//   inputVariables: [],
// });
// const formattedPrompt = await noInput.format({});
// const response1 = await llm.invoke(formattedPrompt);

// console.log("Response 1: ", response1);
//==============================================================================================

// //Example 2 : prompt having one input variable
// const oneInput = new PromptTemplate({
//   template: "What is the capital of {country}?",
//   inputVariables: ["country"],
// });
// const formattedPrompt2 = await oneInput.format({ country: "India" });
// const response2 = await llm.invoke(formattedPrompt2);
// console.log("Response 2: ", response2);

//==============================================================================================

// //Example 3 : prompt having multiple input variables
// const multipleInputs = new PromptTemplate({
//   template:
//     "What is the capital of {country} and who is the president of {country}?",
//   inputVariables: ["country"],
// });
// const formattedPrompt3 = await multipleInputs.format({ country: "India" }); 
// const response3 = await llm.invoke(formattedPrompt3);
// console.log("Response 3: ", response3);
// //==============================================================================================

// // //Example 4 : prompt having multiple input variables
// const multipleInputs = PromptTemplate.fromTemplate(
//   "What is the capital of {country} and who is the president of {country}?"
// );
// const formattedPrompt3 = await multipleInputs.format({ country: "India" }); 
// const response3 = await llm.invoke(formattedPrompt3);
// console.log("Response 3: ", response3);

//==============================================================================================

// //Example 5 : Using Chat Models with Messages
// import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
// const messages = [
//   new SystemMessage({ content: "You are a helpful assistant that translates English to French." }),
//   new HumanMessage({ content: "Translate: I love programming." }),
// ];
// const response3 = await llm.invoke(messages);
// console.log("Response 3: ", response3);
// messages.push(new AIMessage(response3.content));
// console.log("Updated Messages Array: ", messages);
//==============================================================================================

// Example 6 : Chat Prompt Template with multiple variables
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// const chatTemplate = ChatPromptTemplate.fromMessages([
//   ['system', 'You are a helpful {domain} expert'],
//   ['human', 'Explain in simple terms, what is {topic}']
// ]);

// // .format() is used in JS to apply variables to the template
// const prompt = await chatTemplate.format({
//   domain: 'cricket',
//   topic: 'Dusra'
// });

// console.log(prompt);

//===============================================================================================
// Example 7 : Chat Prompt Template with chat history

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { promises as fs } from "fs";

const chatTemplate = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful customer support agent'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{query}'],
]);

async function loadChatHistory() {
  try {
    const fileContent = await fs.readFile('chat_history.txt', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== ''); // Read lines, remove empty ones

    const chat_history = lines.map(line => {
      if (line.startsWith('Human:')) {
        return new HumanMessage(line.replace('Human: ', ''));
      } else if (line.startsWith('AI:')) {
        return new AIMessage(line.replace('AI: ', ''));
      }
      // You could add more robust error handling here
      return null;
    }).filter(Boolean); // Filter out any null entries

    return chat_history;
  } catch (error) {
    console.error("Could not read chat history file:", error);
    return []; // Return empty history on error
  }
}

const chat_history = await loadChatHistory();
console.log("Loaded and Parsed History:", chat_history);
// Create the final prompt by providing the history and the new query
const promptValue = await chatTemplate.formatPromptValue({
  chat_history: chat_history,
  query: 'Where is my refund?'
});

console.log("\n--- Final Formatted Prompt ---");
console.log(promptValue.toMessages());