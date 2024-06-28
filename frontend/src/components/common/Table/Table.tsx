import { MdOutlineDeleteOutline } from "react-icons/md";
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
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

export const Table = ({ headers, data, showDelete = false, onDelete }: TableProps) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.id}>{header.title}</th>
          ))}
          {showDelete && <th></th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, id) => (
          <tr key={id}>
            {headers.map((header) => (
              <td key={`${id}-${header.id}`}>{item[header.field]}</td>
            ))}
            {showDelete && (
              <td>
                <PrimaryButton
                  type="button"
                  style="trashcan-btn rm-default-btn"
                  action={() => onDelete && onDelete(item.id)}
                  icon={<MdOutlineDeleteOutline className="icon-trashcan" />}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
