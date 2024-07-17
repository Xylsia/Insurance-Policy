import { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { useAgentTitles } from "../../../hooks/useAgentTitles";
import { useUserRoles } from "../../../hooks/useUserRoles";
import { useAgentFormErrors } from "./useAgentFormErrros";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { URL, USER_THEME_PREFS, USER_LANGUAGE_PREFS } from "../../../constants";
import "./CreateAgent.scss";
import { AgentModel } from "../../../models/AgentModel";

const initAgentFormErrors = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  agentTitle: "",
  userRole: "",
  agentEmailExists: "",
};

export const CreateAgent = () => {
  const navigate = useNavigate();
  const { agentTitleList } = useAgentTitles();
  const { userRoleList } = useUserRoles();
  const { setSnackbar } = useContext(SnackbarContext);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [agentTitle, setAgentTitle] = useState<string>("-1");
  const [userRole, setUserRole] = useState<string>("");
  const [agentFormErrors, setAgentFormErrors] = useState(initAgentFormErrors);

  const languagePreference = USER_LANGUAGE_PREFS.EN;
  const themePreference = USER_THEME_PREFS.LIGHT;

  const agentErrorCheck = useAgentFormErrors({
    firstName,
    lastName,
    email,
    phoneNumber,
    agentTitle,
    userRole,
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "agentTitle":
        setAgentTitle(value);
        break;
      case "userRoles":
        setUserRole(value);
        break;
      default:
        break;
    }
  };

  const handleCreateAgent = async (event: FormEvent) => {
    event.preventDefault();

    const isInvalid = Object.values(agentErrorCheck).some((error) => error !== "");

    if (isInvalid) {
      setAgentFormErrors(agentErrorCheck);
    } else {
      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        agentTitle: agentTitle,
        userRole: userRole,
        languagePreference: languagePreference,
        themePreference: themePreference,
      };

      try {
        const response = await fetchWrapper({
          url: `${URL}agent/create`,
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar("error", errorData.message || "Network response error");
          return;
        }

        const data: AgentModel = await response.json();
        console.log(`agent/create response:\n`, data);
        setSnackbar("success", `New agent has been created`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setAgentFormErrors(() => ({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            agentTitle: "",
            userRole: "",
            agentEmailExists: "Email already exists in the database",
          }));
        } else {
          setSnackbar("error", "An unexpected error occured");
        }
      }
    }
  };

  return (
    <div className="create-agent-form-c div-card">
      <form onSubmit={handleCreateAgent}>
        <div className="create-agent-form-grps">
          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label htmlFor="firstName">
                First Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name..."
                value={firstName}
                onChange={handleInputChange}
                className={`${agentFormErrors.firstName ? "required-border" : ""}`}
              />
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.firstName && (
                <span className="required">{agentFormErrors.firstName}</span>
              )}
            </div>
          </div>

          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label htmlFor="lastName">
                Last Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name..."
                value={lastName}
                onChange={handleInputChange}
                className={`${agentFormErrors.lastName ? "required-border" : ""}`}
              />
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.lastName && (
                <span className="required">{agentFormErrors.lastName}</span>
              )}
            </div>
          </div>
        </div>
        <div className="create-agent-form-grps">
          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label htmlFor="email">
                Email: <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email..."
                value={email}
                onChange={handleInputChange}
                className={`${agentFormErrors.email ? "required-border" : ""}`}
              />
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.email && <span className="required">{agentFormErrors.email}</span>}
            </div>
          </div>

          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label htmlFor="phoneNumber">
                Phone Number: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter Phone Number..."
                value={phoneNumber}
                onChange={handleInputChange}
                className={`${agentFormErrors.phoneNumber ? "required-border" : ""}`}
              />
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.phoneNumber && (
                <span className="required">{agentFormErrors.phoneNumber}</span>
              )}
            </div>
          </div>
        </div>
        <div className="create-agent-form-grps">
          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label htmlFor="agentTitle">
                Selecr an Agent Title: <span className="required">*</span>
              </label>
              <select
                id="agentTitle"
                name="agentTitle"
                onChange={handleInputChange}
                className={`${agentFormErrors.agentTitle ? "required-border" : ""}`}
              >
                <option value="-1">Choose an Agent Title</option>
                {agentTitleList.map((agentTitle, index) => (
                  <option key={index} value={agentTitle}>
                    {agentTitle}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.agentTitle && (
                <span className="required">{agentFormErrors.agentTitle}</span>
              )}
            </div>
          </div>

          <div className="create-agent-form-grp">
            <div className="create-agent-form-grp-content">
              <label>
                Pick a User Role: <span className="required">*</span>
              </label>
              <div className="user-roles">
                {userRoleList.map((role, index) => (
                  <div className="one-user-role" key={index}>
                    <input
                      type="radio"
                      id={role}
                      name="userRoles"
                      value={role}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={role}>{role}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="create-agent-form-grp-error">
              {agentFormErrors.userRole && (
                <span className="required">{agentFormErrors.userRole}</span>
              )}
            </div>
          </div>
        </div>
        {agentFormErrors.agentEmailExists && (
          <span className="required form-error-msg">{agentFormErrors.agentEmailExists}</span>
        )}

        <div className="create-form-btns">
          <PrimaryButton
            type="button"
            style="btn btn-danger"
            action={() => navigate("/agents")}
            text="Cancel"
          />
          <PrimaryButton type="submit" style="btn btn-success" text="Create" />
        </div>
      </form>
    </div>
  );
};
