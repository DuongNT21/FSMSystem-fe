export const handleError = (error) => {
  let message = "An unexpected error occurred.";

  if (error.response && error.response.data && error.response.data.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }

  alert(message);
};