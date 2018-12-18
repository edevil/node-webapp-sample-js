const { registerDecorator, ValidationArguments, ValidationOptions } = require("class-validator");

function IsEqualTo(property, validationOptions) {
  return (object, propertyName) => {
    registerDecorator({
      constraints: [property],
      name: "isEqualTo",
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return typeof value === "string" && typeof relatedValue === "string" && value === relatedValue;
        },
      },
    });
  };
}

module.exports = {
  IsEqualTo,
};
