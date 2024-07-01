import { Link } from "react-router-dom";
import { PrimaryButton } from "../../components/common/Button/PrimaryButton";
import { Agents } from "../../components/Agent/Agents/Agents";
import "./AgentsPage.scss";

export const AgentsPage = () => {
  return (
    <div className="main-container">
      <div className="page-title-and-create-btn">
        <h1>Agents</h1>
        <Link to="/create-agent" className="create-policy-btn">
          <PrimaryButton type="button" style="btn btn-success" text="Create Agent" />
        </Link>
      </div>
      <div className="agents-container div-card">
        <Agents />
      </div>
    </div>
  );
};
