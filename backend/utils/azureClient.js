// backend/utils/azureClient.js
import { ModelClient } from "@azure-rest/ai-inference";
import { DefaultAzureCredential } from "@azure/identity";

const endpoint = process.env.AZURE_INFERENCE_SDK_ENDPOINT || "";
const credential = new DefaultAzureCredential();

const client = new ModelClient(endpoint, credential);

export default client;
