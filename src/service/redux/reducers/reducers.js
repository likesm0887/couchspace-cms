const changeUrl = (state = "", action) => {
  switch (action.type) {
    case "CHANGE": {
      return action.payload;
    }
  }
};
export default changeUrl;