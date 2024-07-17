import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { PrimaryButton } from "../Button/PrimaryButton";
import "./Table.scss";

interface TableHeader {
  id: string;
  title: string;
  field: string;
}

interface TableData {
  [key: string]: any;
}

interface TableProps {
  headers: TableHeader[];
  data: TableData[];
  showEdit?: boolean;
  onEdit?: (id: number) => void;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

export const Table = ({
  headers,
  data,
  showDelete = false,
  onDelete,
  showEdit = false,
  onEdit,
}: TableProps) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.id}>{header.title}</th>
          ))}
          {(showEdit || showDelete) && <th></th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, id) => (
          <tr key={id}>
            {headers.map((header) => (
              <td key={`${id}-${header.id}`}>{item[header.field]}</td>
            ))}
            {(showEdit || showDelete) && (
              <td>
                {showEdit && (
                  <PrimaryButton
                    type="button"
                    style="rm-default-btn svg-icon"
                    action={() => onEdit && onEdit(item.id)}
                    icon={<BiEdit className="icon-edit" />}
                  />
                )}
                {showDelete && (
                  <PrimaryButton
                    type="button"
                    style="rm-default-btn svg-icon"
                    action={() => onDelete && onDelete(item.id)}
                    icon={<MdOutlineDeleteOutline className="icon-delete" />}
                  />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
