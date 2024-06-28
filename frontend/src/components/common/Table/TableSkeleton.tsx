import "./TableSkeleton.scss";

interface TableHeader {
  headers: {
    id: string;
    title: string;
    field: string;
  }[];
  showDelete?: boolean;
}

export const TableSkeleton = ({ headers, showDelete }: TableHeader) => {
  return (
    <div className="table-skeleton-container">
      <table className="table-skeleton">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.id}>{header.title}</th>
            ))}
            {showDelete && <th></th>}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 15 }).map((_, id) => (
            <tr key={id}>
              {headers.map((header) => (
                <td key={`${id}-${header.id}`}>
                  <div className="skeleton-content-placeholder"></div>
                </td>
              ))}
              {showDelete && (
                <td>
                  <div className="skeleton-content-placeholder"></div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
