import { showMessage } from "react-native-flash-message";

export const apiErrorHandler = (error) => {
  if (error) {
    const { status } = error;
    console.log(
      "🚀 ~ file: apiErrorHandler.js:6 ~ apiErrorHandler ~ status:",
      status
    );
    // handle http status codes
    switch (status) {
      case 400:
        console.warn("400 :bad_request");
        showMessage({
          message: "Bad Request",
          type: "warning",
        });
        break;
      case 401:
        // TODO: Getting 401 for invalid email id/password too and May be we'll get the same for the token expiration.
        console.warn("401 :unauthorized");
        showMessage({
          message: "Unauthorized",
          type: "warning",
        });
        // _handleLogout();
        break;
      case 403:
        console.warn("403 :forbidden");
        showMessage({
          message: "Not allowed",
          type: "warning",
        });
        break;
      case 404:
        console.warn("404 :not_found", error);
        showMessage({
          message: error?.statusText ?? "Not found",
          type: "warning",
        });
        break;
      case 405:
        console.warn("405 method_not_allowed");
        showMessage({
          message: error?.statusText ?? "Method Not Allowed",
          type: "warning",
        });
        break;
      case 406:
        console.warn("406 not_acceptable");
        showMessage({
          message: error?.statusText ?? "Not Acceptable",
          type: "warning",
        });
        break;
      case 408:
        console.warn("408: request_timeout");
        showMessage({
          message:
            "This request takes too long to process, it is timed out by the searer.",
          type: "warning",
        });
        break;
      case 410:
        console.warn("410: gone");
        showMessage({
          message:
            "This resource requested is no longer available and will not be available again.",
          type: "warning",
        });
        break;
      case 419:
        console.warn("419 :too many attempt");
        showMessage({
          message: error?.statusText ?? "Too Many Requests",
          type: "warning",
        });
        break;
      case 422:
        // TODO: Need to update message key from the backend.
        console.warn("422 :unprocessable_entity");
        showMessage({
          message: error?.statusText ?? "Something went wrong",
          type: "warning",
        });
        break;
      case 429:
        console.warn("429 :too_many_requests");
        showMessage({
          message: "Too Many Requests",
          type: "warning",
        });
        break;
      case 500:
        console.warn("500 :internal_server_error");
        showMessage({
          message: "Internal server error, Please wait and try again later",
          type: "warning",
        });
        break;
      case 503:
        console.warn("503: service_unavailable");
        showMessage({
          message: "Service Unavailable, Please wait and try again later",
          type: "warning",
        });
        break;
      case 504:
        console.warn("504: gateway_timeout");
        showMessage({
          message:
            "Server is acting as a gateway and cannot get a response, Please wait and try again later",
          type: "warning",
        });
        break;
      default:
        console.warn("Response Error");
        showMessage({
          message: "Something went wrong",
          type: "warning",
        });
        break;
    }
  } else if (error.request) {
    console.warn("Network error");
    showMessage({
      message: "Network Error",
      type: "warning",
    });
  } else {
    // Something happened in setting up the request and triggered an Error
    console.warn("unrepentant_error");
    showMessage({
      message: "Something went wrong",
      type: "warning",
    });
  }
};
