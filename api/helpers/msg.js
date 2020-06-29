module.exports = {
  success: {},
  error: {
    isRequired: (param) => {
      return `${param} is required`;
    },
    parser: (err) => {
      let result = {};
      err.map((item) => {
        result[item.param] = {
          message: item.msg
        }
      });

      return {
        message: {
          errors: result
        }
      }
    }
  },
};