import { useAgents } from "../../../hooks/useAgents";
import { Table } from "../../common/Table/Table";
import { TableSkeleton } from "../../common/Table/TableSkeleton";
import "./Agents.scss";

const tableHeaders = [
  {
    id: "1",
    title: "First Name",
    field: "firstName",
  },
  {
    id: "2",
    title: "Last Name",
    field: "lastName",
  },
  {
    id: "3",
    title: "Email",
    field: "email",
  },
  {
    id: "4",
    title: "Phone Number",
    field: "phoneNumber",
  },
  {
    id: "5",
    title: "Title",
    field: "title",
  },
  {
    id: "6",
    title: "Role",
    field: "roles",
  },
];

export const Agents = () => {
  const { agentList, isLoading } = useAgents();

  const tableData = agentList.map((agent) => ({
    firstName: agent.firstName,
    lastName: agent.lastName,
    email: agent.email,
    phoneNumber: agent.phoneNumber,
    title: agent.agentTitle,
    roles: agent.userRole,
  }));

  return (
    <>
      {isLoading ? (
        <TableSkeleton headers={tableHeaders} />
      ) : (
        <div className="agents-form-container">
          <div className="table-container">
            {tableData.length === 0 ? (
              <span>No agents found.</span>
            ) : (
              <Table headers={tableHeaders} data={tableData} />
            )}
          </div>
        </div>
      )}
    </>
  );
};
