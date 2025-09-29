const validateRequest = (schema) => {
  console.log("I am inside validateRequest");

  return (req, res, next) => {
    // console.log(schema);
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    next();
  };
};

export default validateRequest;
