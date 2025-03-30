import createClient from "@azure-rest/ai-inference";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_INFERENCE_SDK_ENDPOINT;
const key = process.env.AZURE_INFERENCE_SDK_KEY;

let client;
if (key) {
  console.log("✅ Using API Key for Authentication");
  client = createClient(endpoint, new AzureKeyCredential("EZXZeiRbMxFYWxUQjYbx5g50tF2zyyuvmq4HNsswKWjxFYUId3fdJQQJ99BCACHYHv6XJ3w3AAAAACOGwbx4"));
} else {
  console.log("🔐 Using Default Azure Credentials");
  client = createClient(endpoint, new DefaultAzureCredential());
}

export default client;
