type createAgentFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  agentTitle: string;
  userRole: string;
};

export const useAgentFormErrors = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  agentTitle,
  userRole,
}: createAgentFormProps) => {
  const agentFormErrorValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    agentTitle: "",
    userRole: "",
    agentEmailExists: "",
  };

  const namePattern = /^[A-Z][a-zA-Z]{1,}$/;
  const emailPattern = /^[a-zA-Z][a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\.[a-zA-Z0-9-_.]+$/;
  const phonePattern = /^\+?[0-9)( )]{7,}$/;

  if (firstName.trim().length === 0) {
    agentFormErrorValues.firstName = "First name field cannot be empty";
  } else if (!namePattern.test(firstName.trim())) {
    agentFormErrorValues.firstName =
      "First name must start with an Uppercase letter and be at least 2 characters long";
  } else {
    agentFormErrorValues.firstName = "";
  }

  if (lastName.trim().length === 0) {
    agentFormErrorValues.lastName = "Last name field cannot be empty";
  } else if (!namePattern.test(lastName.trim())) {
    agentFormErrorValues.lastName =
      "Last name must start with an Uppercase letter and be at least 2 characters long";
  } else {
    agentFormErrorValues.lastName = "";
  }

  if (email.trim().length === 0) {
    agentFormErrorValues.email = "Email field cannot be empty";
  } else if (!emailPattern.test(email.trim())) {
    agentFormErrorValues.email = "Email address is invalid";
  } else {
    agentFormErrorValues.email = "";
  }

  if (phoneNumber.trim().length === 0) {
    agentFormErrorValues.phoneNumber = "Phone number cannot be empty";
  } else if (!phonePattern.test(phoneNumber.trim())) {
    agentFormErrorValues.phoneNumber = "Phone number must be at least 7 digits long";
  } else {
    agentFormErrorValues.phoneNumber = "";
  }

  if (agentTitle === "-1") {
    agentFormErrorValues.agentTitle = "You must select an Agent Title";
  } else {
    agentFormErrorValues.agentTitle = "";
  }

  if (userRole === "-1") {
    agentFormErrorValues.userRole = "You must select an User Role";
  } else {
    agentFormErrorValues.userRole = "";
  }

  return agentFormErrorValues;
};
