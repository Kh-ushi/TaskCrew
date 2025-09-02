const validateRequest = (schema) => {
    console.log("I am inside validateRequest");
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
        console.log("I am inside error");
        console.log(error.details);
        return res.status(400).json({
          errors: error.details.map(err => err.message),
        });
      }
  
      next();
    };
  };
  

  export {validateRequest};