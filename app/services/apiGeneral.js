import { apiModels } from "./apiModels";

export const getContent = async payload => {
  const url = payload.type == "help" ? "accounts/folder/" : payload.type == "all" ? "accounts/content" : "accounts/content/global";
  return apiModels(url + payload.params, "GET");
};

export async function sendFeedback({ body }) {
  return await apiModels(`accounts/helpFeedback/`, "POST", body);
}

export async function sendExpression({ contentId, body }) {
  return await apiModels(
    `accounts/content/${contentId}/feedback`,
    "POST",
    body
  );
}
