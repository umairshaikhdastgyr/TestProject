import {RemoveDuplicates} from '#constants';
import {failure, success} from '../utils';

import {
  GET_ALBUMS_IDEAS,
  GET_ALBUM_IDEAS_DETAIL,
  CREATE_ALBUM_IDEA,
  UPDATE_ALBUM_IDEA,
  DELETE_ALBUM_IDEA,
  MOVE_IDEA_TO_ANOTHER_ALBUM,
  DELETE_IDEA_FROM_ALBUM,
  CLEAR_IDEAS,
  SAVE_POST_TO_ALBUM_IDEA,
  DELETE_IDEA_GLOBALLY,
  FOLLOWER_IDEAS,
  GET_ALBUM_IDEAS_RELATED_POST,
  GET_ALBUM_IDEAS_NEXT_RELATED_POST,
  GET_ALBUM_IDEAS_SAVED_POST,
  GET_ALBUM_IDEAS_NEXT_SAVED_POST,
  ADD_FAVORITE_RELATED_POST,
  REMOVE_FAVORITE_RELATED_POST,
} from './constants';

const defaultState = {
  albums: {
    isFetching: true,
    list: [],
    requireUpdate: false,
  },
  albumDetails: {
    isFetching: true,
    details: {},
    requireUpdate: false,
  },
  albumRelatedPost: {
    isFetching: false,
    isFetchingNext: false,
    total: 0,
    relatedList: [],
  },
  albumSavedPost: {
    isFetching: false,
    isFetchingNext: false,
    postsList: [],
    total: 0,
  },
  followerAlbum: {isFetching: true, list: []},
};

const reducer = (state = defaultState, {type, data}) => {
  switch (type) {
    case GET_ALBUMS_IDEAS:
      return {
        ...state,
        albums: {
          ...state.albums,
          isFetching: true,
          requireUpdate: false,
          list: [],
        },
      };
    case success(GET_ALBUMS_IDEAS):
      return {
        ...state,
        albums: {
          ...state.albums,
          isFetching: false,
          requireUpdate: false,
          list: data.data,
        },
      };
    case FOLLOWER_IDEAS:
      return {
        ...state,
        followerAlbum: {
          isFetching: true,
          list: [],
        },
      };
    case success(FOLLOWER_IDEAS):
      return {
        ...state,
        followerAlbum: {
          isFetching: false,
          list: data.data,
        },
      };
    case GET_ALBUM_IDEAS_DETAIL:
      return {
        ...state,
        albumDetails: {
          ...state.albumDetails,
          isFetching: true,
          details: {},
          postsList: [],
        },
      };
    case success(GET_ALBUM_IDEAS_DETAIL):
      const detailsToSet = data.data[0];
      return {
        ...state,
        albumDetails: {
          ...state.albumDetails,
          isFetching: false,
          requireUpdate: false,
          details: detailsToSet,
        },
      };

    case GET_ALBUM_IDEAS_RELATED_POST:
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          isFetching: true,
          relatedList: [],
        },
      };
    case success(GET_ALBUM_IDEAS_RELATED_POST):
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          isFetching: false,
          total: data?.total,
          relatedList: data?.list,
        },
      };
    case failure(GET_ALBUM_IDEAS_RELATED_POST):
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          isFetching: false,
          relatedList: [],
        },
      };
    case GET_ALBUM_IDEAS_NEXT_RELATED_POST:
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          isFetchingNext: true,
        },
      };
    case success(GET_ALBUM_IDEAS_NEXT_RELATED_POST):
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          relatedList: [...state.albumRelatedPost.relatedList, ...data?.list],
          total: data?.total,
          isFetchingNext: false,
        },
      };
      case failure(GET_ALBUM_IDEAS_NEXT_RELATED_POST):
      return {
        ...state,
        albumRelatedPost: {
          ...state.albumRelatedPost,
          isFetchingNext: false,
        },
      };

    case ADD_FAVORITE_RELATED_POST:
      const albumsList = [...state.albums.list];
      const albumData = albumsList.filter((album, index) => {
        if (album.id == data?.ideasAlbumId && album.name === data?.ideasName) {
          return album;
        }
      });
      let finalPostListData;
      if (albumData?.length > 0) {
        const getPostData = [...state.albumRelatedPost.relatedList].filter(
          post => post.id === data?.postData?.id,
        );
        let postDataAdd;
        if (getPostData?.length > 0) {
          postDataAdd = {
            ...getPostData[0],
            isFavorite: true,
          };
        }
        const relatedData = [...state.albumSavedPost.postsList, postDataAdd];
        finalPostListData = relatedData?.filter(obj => obj != undefined);
      }

      const getRelatedPostData = [...state.albumRelatedPost.relatedList].filter(
        post => post.id != data?.postData?.id,
      );
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          postsList:
            finalPostListData?.length == undefined ||
            finalPostListData?.length == 0
              ? state.albumSavedPost.postsList
              : RemoveDuplicates(finalPostListData, 'id'),
        },
        albumRelatedPost: {
          ...state.albumRelatedPost,
          relatedList: getRelatedPostData,
          total: state.albumRelatedPost.relatedList?.length,
        },
      };

    case REMOVE_FAVORITE_RELATED_POST:
      const postList = [...state.albumSavedPost.postsList].filter(
        post => post.id != data?.postData?.id,
      );
      const removedFavoriteRelatedPostData = [
        ...state.albumRelatedPost.relatedList,
      ].map(post => {
        if (post.id === data?.postData?.id) {
          const data = {
            ...post,
            isFavorite: false,
          };
          return data;
        } else {
          return post;
        }
      });
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          postsList: postList,
        },
        albumRelatedPost: {
          ...state.albumRelatedPost,
          relatedList: removedFavoriteRelatedPostData,
        },
      };

    case GET_ALBUM_IDEAS_SAVED_POST:
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          isFetching: true,
          postsList: [],
        },
      };
    case success(GET_ALBUM_IDEAS_SAVED_POST):
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          isFetching: false,
          total: data?.total,
          postsList: data?.list,
        },
      };
    case failure(GET_ALBUM_IDEAS_SAVED_POST):
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          isFetching: false,
          postsList: [],
        },
      };
    case GET_ALBUM_IDEAS_NEXT_SAVED_POST:
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          isFetchingNext: true,
        },
      };
    case success(GET_ALBUM_IDEAS_NEXT_SAVED_POST):
      return {
        ...state,
        albumSavedPost: {
          ...state.albumSavedPost,
          postsList: [...state.albumSavedPost.postsList, ...data?.list],
          isFetchingNext: false,
        },
      };

    case CREATE_ALBUM_IDEA:
      return {
        ...state,
        albums: {
          ...state.albums,
          isFetching: true,
          requireUpdate: true,
        },
      };
    case success(CREATE_ALBUM_IDEA):
      return {
        ...state,
        albums: {
          ...state.albums,
          list: [data.data, ...state.albums.list],
          requireUpdate: true,
          isFetching: false,
        },
      };

    case success(UPDATE_ALBUM_IDEA):
      const albumsListWithUpdate = [...state.albums.list];
      albumsListWithUpdate.forEach((album, index) => {
        if (album.id === data.data.id) {
          const albumToUpdate = {...album};
          albumToUpdate.name = data.data.name;
          albumsListWithUpdate[index] = albumToUpdate;
        }
      });

      return {
        ...state,
        albums: {
          ...state.albums,
          list: albumsListWithUpdate,
          requireUpdate: true,
        },
        albumDetails: {
          ...state.albumDetails,
          requireUpdate: false,
          details: {
            ...state.albumDetails.details,
            name: data.data.name,
            description: data.data.description,
            isPrivate: data.data.isPrivate,
          },
        },
      };

    case success(DELETE_ALBUM_IDEA):
      return {
        ...state,
        albums: {
          ...state.albums,
          list: [...state.albums.list].filter(album => album.id !== data.id),
        },
      };

    case success(MOVE_IDEA_TO_ANOTHER_ALBUM):
      const albumsListWithDeLete = [...state.albums.list];
      albumsListWithDeLete.forEach((album, index) => {
        if (album.id === data.ideasAlbumId) {
          const albumToUpdate = {...album};
          albumToUpdate.ideasCount = Number(albumToUpdate.ideasCount) - 1;
          albumsListWithDeLete[index] = albumToUpdate;
        }
        if (album.id === data.data.IdeasAlbumId) {
          const albumToUpdate = {...album};
          albumToUpdate.ideasCount = Number(albumToUpdate.ideasCount) + 1;
          albumsListWithDeLete[index] = albumToUpdate;
        }
      });

      return {
        ...state,
        albums: {
          ...state.albums,
          list: albumsListWithDeLete,
          requireUpdate: true,
        },
        albumDetails: {
          ...state.albumDetails,
          requireUpdate: false,
          // postsList: [...state.albumDetails.postsList].filter(
          //   (post) => post.id !== data.data.PostId
          // ),
        },
        albumSavedPost: {
          ...state.albumSavedPost,
          postsList: [...state.albumSavedPost.postsList].filter(
            post => post.id !== data.postId,
          ),
          total: state.albumSavedPost.postsList?.length - 1,
        },
      };

    case success(DELETE_IDEA_FROM_ALBUM):
      const albumsListToUpdate = [...state.albums.list];
      albumsListToUpdate.forEach((album, index) => {
        if (album.id === data.ideasAlbumId) {
          const albumToUpdate = {...album};
          albumToUpdate.ideasCount = Number(albumToUpdate.ideasCount) - 1;
          albumsListToUpdate[index] = albumToUpdate;
        }
      });
      const removedFavoriteRelatedPost = [
        ...state.albumRelatedPost.relatedList,
      ].map(post => {
        if (post.id === data.postId) {
          const data = {
            ...post,
            isFavorite: false,
          };
          return data;
        } else {
          return post;
        }
      });

      return {
        ...state,
        albums: {
          ...state.albums,
          list: albumsListToUpdate,
          requireUpdate: true,
        },
        albumDetails: {
          ...state.albumDetails,
          requireUpdate: true,
          // postsList: [...state.albumDetails.postsList].filter(
          //   (post) => post.id !== data.postId
          // ),
        },
        albumSavedPost: {
          ...state.albumSavedPost,
          postsList: [...state.albumSavedPost.postsList].filter(
            post => post.id !== data.postId,
          ),
          total: state.albumSavedPost.postsList?.length - 1,
        },
        albumRelatedPost: {
          ...state.albumRelatedPost,
          relatedList: removedFavoriteRelatedPost,
        },
      };

    case success(SAVE_POST_TO_ALBUM_IDEA):
      const albumsListToUpdateWithAdd = [...state.albums.list];
      albumsListToUpdateWithAdd.forEach((album, index) => {
        if (album.id === data.data.IdeasAlbumId) {
          const albumToUpdate = {...album};
          albumToUpdate.ideasCount = albumToUpdate.ideasCount
            ? Number(albumToUpdate.ideasCount) + 1
            : 1;
          if (!albumToUpdate.urlImage) {
            albumToUpdate.urlImage = data.helperImage;
            albumToUpdate.firstImage = data.helperImage;
          }
          albumsListToUpdateWithAdd[index] = albumToUpdate;
        }
      });

      return {
        ...state,
        albums: {
          ...state.albums,
          list: albumsListToUpdateWithAdd,
          requireUpdate: true,
        },
        albumDetails: {
          ...state.albumDetails,
          requireUpdate: true,
        },
      };

    case CLEAR_IDEAS:
      return {
        ...defaultState,
      };

    case success(DELETE_IDEA_GLOBALLY):
      return {
        ...state,
        albumDetails: {
          ...state.albumDetails,
          requireUpdate: true,
        },
      };

    default:
      return state;
  }
};

export default reducer;
