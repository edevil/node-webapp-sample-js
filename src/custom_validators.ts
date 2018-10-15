import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsEqualTo(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [property],
      name: "isEqualTo",
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === "string" && typeof relatedValue === "string" && value === relatedValue
        },
      },
    });
  };
}
