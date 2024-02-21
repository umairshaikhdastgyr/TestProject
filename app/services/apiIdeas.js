import { apiModels } from "./apiModels";

export const getAlbumsIdeas = async (payload) => {
  return apiModels("catalog/ideasAlbum", "GET", payload);
};

export const postAlbumIdea = async (params) => {
  return await apiModels("catalog/ideasAlbum", "POST", { params });
};

export const postSavePostToAlbumIdea = async ({ ideasAlbumId, params }) => {
  return await apiModels(`catalog/ideasAlbum/${ideasAlbumId}/idea`, "POST", {
    params,
  });
};

export const getAlbumIdeasDetail = async ({ ideasAlbumId }) => {
  return apiModels(`catalog/ideasAlbum/${ideasAlbumId}/idea`, "GET");
};

export const getAlbumIdeasSavedPost = async ({ ideasAlbumId, page, perPage }) => {
  return apiModels(
    `catalog/ideasAlbum/${ideasAlbumId}/idea-posts?page=${page}&perPage=${perPage}&isRelated=false`,
    "GET"
  );
};

export const getAlbumIdeasRelatedPost = async ({ ideasAlbumId, page, perPage }) => {
  return apiModels(
    `catalog/ideasAlbum/${ideasAlbumId}/idea-posts?page=${page}&perPage=${perPage}&isRelated=true`,
    "GET"
  );
};

export const patchAlbumIdea = async ({ ideasAlbumId, params }) => {
  return apiModels(`catalog/ideasAlbum/${ideasAlbumId}`, "PATCH", {
    params,
  });
};

export const deleteAlbumIdea = async ({ ideasAlbumId, params }) => {
  return apiModels(`catalog/ideasAlbum/${ideasAlbumId}`, "DELETE");
};

export const patchMoveIdeaToAnotherAlbum = async ({
  ideasAlbumId,
  postId,
  params,
}) => {
  return apiModels(
    `catalog/ideasAlbum/${ideasAlbumId}/idea/${postId}`,
    "PATCH",
    {
      params,
    }
  );
};

export const deleteIdeaFromAlbum = async ({ ideasAlbumId, postId }) => {
  return apiModels(
    `catalog/ideasAlbum/${ideasAlbumId}/idea/${postId}`,
    "DELETE"
  );
};

export const getIdeaAlbumDetail = async ({ ideasAlbumId, postId }) => {
  return apiModels(`catalog/ideasAlbum/${ideasAlbumId}/idea/${postId}`, "GET");
};

export const deleteIdeaGlobally = async ({ postId, userId }) => {
  return apiModels(`catalog/idea/${postId}?userId=${userId}`, "DELETE");
};
