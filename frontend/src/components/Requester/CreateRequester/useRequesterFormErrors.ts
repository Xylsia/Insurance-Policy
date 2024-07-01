type createRequesterFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export const useRequesterFormErrors = ({
  firstName,
  lastName,
  email,
  phoneNumber,
}: createRequesterFormProps) => {
  const requesterFormErrorValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    requesterEmailExists: "",
  };

  const namePattern = /^[A-Z][a-zA-Z]{1,}$/;
  const emailPattern = /^[a-zA-Z][a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\.[a-zA-Z0-9-_.]+$/;
  const phonePattern = /^\+?[0-9)( )]{7,}$/;

  if (firstName.trim().length === 0) {
    requesterFormErrorValues.firstName = "First name field cannot be empty";
  } else if (!namePattern.test(firstName.trim())) {
    requesterFormErrorValues.firstName =
      "First name must start with an Uppercase letter and be at least 2 characters long";
  } else {
    requesterFormErrorValues.firstName = "";
  }

  if (lastName.trim().length === 0) {
    requesterFormErrorValues.lastName = "Last name field cannot be empty";
  } else if (!namePattern.test(lastName.trim())) {
    requesterFormErrorValues.lastName =
      "Last name must start with an Uppercase letter and be at least 2 characters long";
  } else {
    requesterFormErrorValues.lastName = "";
  }

  if (email.trim().length === 0) {
    requesterFormErrorValues.email = "Email field cannot be empty";
  } else if (!emailPattern.test(email.trim())) {
    requesterFormErrorValues.email = "Email address is invalid";
  } else {
    requesterFormErrorValues.email = "";
  }

  if (phoneNumber.trim().length === 0) {
    requesterFormErrorValues.phoneNumber = "Phone number cannot be empty";
  } else if (!phonePattern.test(phoneNumber.trim())) {
    requesterFormErrorValues.phoneNumber = "Phone number must be at least 7 digits long";
  } else {
    requesterFormErrorValues.phoneNumber = "";
  }

  return requesterFormErrorValues;
};
