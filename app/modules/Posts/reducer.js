import { failure, success } from "../utils";

import {
  GET_POSTS,
  GET_OFFLINE_POSTS,
  GET_POSTS_NEXT_PAGE,
  GET_POST_DETAIL,
  GET_SIMILAR_POSTS,
  GET_NEARBY_POSTS,
  CLEAR_POSTS,
  GET_EXPLORE_POSTS,
  POST_LOADER,
} from "./constants";
import {
  GET_IDEA_ALBUM_DETAIL,
  SAVE_POST_TO_ALBUM_IDEA,
  DELETE_IDEA_GLOBALLY,
  DELETE_IDEA_FROM_ALBUM,
} from "#modules/Ideas/constants";

const defaultState = {
  isFetchingPosts: true,
  isLoadPost: false,
  isFetchingNextPagePosts: false,
  isFetchingNextSimilarPagePosts: false,
  noMorePosts: false,
  noMoreSimilarPosts: false,
  postsList: [],
  totalPostData: 0,
  isFetchingPostDetail: true,
  postDetail: {},
  similarPosts: {
    isFetching: true,
    postTotal: 0,
    list: [],
  },
  nearbyPosts: {
    isFetching: true,
    list: [],
  },
  favoriteProduct: {
    isFetching: false,
    data: null,
  },
  deleteFavorite: {
    isFetching: false,
    data: null,
  },
};

const reducer = (state = defaultState, { type, data }) => {
  switch (type) {
    // case GET_POSTS:
    //   return {
    //     ...state,
    //     isFetchingPosts: true,
    //     // postsList: []
    //   };
    case GET_POSTS:
      return {
        ...state,
        isFetchingPosts: false,
        noMorePosts: false,
        postsList: data?.data,
        totalPostData: data?.total,
      };
    case POST_LOADER:
      return {
        ...state,
        isLoadPost: data,
      };
    // case success(GET_POSTS):
    //   return {
    //     ...state,
    //     isFetchingPosts: false,
    //     noMorePosts: false,
    //     postsList: data.data,
    //   };
    // case failure(GET_POSTS):
    //   return {
    //     ...state,
    //     isFetchingPosts: false,
    //   };
    case GET_OFFLINE_POSTS:
      return {
        ...state,
        isFetchingPosts: false,
        noMorePosts: false,
        postsList: data.data,
      };
    case GET_EXPLORE_POSTS:
      return {
        ...state,
        postsList: data,
        isFetchingPosts: false,
        noMorePosts: true,
      };
    case GET_POSTS_NEXT_PAGE:
      const postData = data?.data == undefined ? [] : data?.data;
      return {
        ...state,
        isFetchingNextPagePosts: false,
        noMorePosts: data?.data == undefined ? true : data?.data?.length === 0,
        postsList: [...state?.postsList, ...postData],
      };
    // case success(GET_POSTS_NEXT_PAGE):
    //   const postData = data?.data == undefined ? [] : data?.data;
    //   return {
    //     ...state,
    //     isFetchingNextPagePosts: false,
    //     noMorePosts: data?.data == undefined ? true : data?.data?.length === 0,
    //     postsList: [...state.postsList, ...postData],
    //   };

    case GET_POST_DETAIL:
    case GET_IDEA_ALBUM_DETAIL:
      return {
        ...state,
        isFetchingPostDetail: true,
        postDetail: {},
      };
    case success(GET_POST_DETAIL):
    case success(GET_IDEA_ALBUM_DETAIL):
      return {
        ...state,
        isFetchingPostDetail: false,
        postDetail: data.data,
      };

    case GET_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: {
          ...state.similarPosts,
          isFetching: true,
          list: [],
        },
      };
    case success(GET_SIMILAR_POSTS):
      return {
        ...state,
        similarPosts: {
          ...state.similarPosts,
          isFetching: false,
          postTotal: data.total,
          list: data.data,
        },
      };

    case GET_NEARBY_POSTS:
      return {
        ...state,
        nearbyPosts: {
          ...state.nearbyPosts,
          isFetching: true,
          list: [],
        },
      };
    case success(GET_NEARBY_POSTS):
      return {
        ...state,
        nearbyPosts: {
          ...state.nearbyPosts,
          isFetching: false,
          list: data.data,
        },
      };

    case CLEAR_POSTS:
      return {
        ...defaultState,
      };

    case SAVE_POST_TO_ALBUM_IDEA:
      return {
        ...state,
        favoriteProduct: {
          isFetching: true,
          data: null,
        },
      };

    case success(SAVE_POST_TO_ALBUM_IDEA):
      const postListWithAdd = [...state.postsList];
      postListWithAdd.forEach((post, index) => {
        if (post.id === data.data.PostId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = true;
          postListWithAdd[index] = postToUpdate;
        }
      });

      const similiarPostListWithAdd = [...state.similarPosts.list];
      similiarPostListWithAdd.forEach((post, index) => {
        if (post.id === data.data.PostId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = true;
          similiarPostListWithAdd[index] = postToUpdate;
        }
      });

      const nearbyPostListWithAdd = [...state.nearbyPosts.list];
      nearbyPostListWithAdd.forEach((post, index) => {
        if (post.id === data.data.PostId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = true;
          nearbyPostListWithAdd[index] = postToUpdate;
        }
      });

      return {
        ...state,
        postsList: postListWithAdd,
        postDetail: {
          ...state.postDetail,
          isFavorite: true,
        },
        similarPosts: {
          ...state.similarPosts,
          list: similiarPostListWithAdd,
        },
        nearbyPosts: {
          ...state.nearbyPosts,
          list: nearbyPostListWithAdd,
        },
        favoriteProduct: {
          isFetching: false,
          data: data?.data,
        },
      };
    case DELETE_IDEA_GLOBALLY:
      return {
        ...state,
        deleteFavorite: {
          isFetching: true,
          data: null,
        },
      };
    case success(DELETE_IDEA_GLOBALLY):
      const postListWithDelete = [...state.postsList];
      postListWithDelete.forEach((post, index) => {
        if (post.id === data.postId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = false;
          postListWithDelete[index] = postToUpdate;
        }
      });

      const similiarPostListWithDelete = [...state.similarPosts.list];
      similiarPostListWithDelete.forEach((post, index) => {
        if (post.id === data.postId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = false;
          similiarPostListWithDelete[index] = postToUpdate;
        }
      });

      const nearbyPostListWithDelete = [...state.nearbyPosts.list];
      nearbyPostListWithDelete.forEach((post, index) => {
        if (post.id === data.postId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = false;
          nearbyPostListWithDelete[index] = postToUpdate;
        }
      });

      return {
        ...state,
        postsList: postListWithDelete,
        postDetail: {
          ...state.postDetail,
          isFavorite: false,
        },
        similarPosts: {
          ...state.similarPosts,
          list: similiarPostListWithDelete,
        },
        nearbyPosts: {
          ...state.nearbyPosts,
          list: nearbyPostListWithDelete,
        },
        deleteFavorite: {
          isFetching: false,
          data: data,
        },
      };

    case success(DELETE_IDEA_FROM_ALBUM):
      const postListWithDeleteIdea = [...state.postsList];
      postListWithDeleteIdea.forEach((post, index) => {
        if (post.id === data.postId) {
          const postToUpdate = { ...post };
          postToUpdate.isFavorite = false;
          postListWithDeleteIdea[index] = postToUpdate;
        }
      });
      return {
        ...state,
        postsList: postListWithDeleteIdea,
      };

    default:
      return state;
  }
};

export default reducer;
