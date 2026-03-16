import { ArrowUpDown } from 'lucide-react';

const statuses = ['Pending', 'In Progress', 'Completed'];

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const ComplaintTable = ({ complaints, sortConfig, onSort, onStatusUpdate, loading }) => {
  const headCell = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500';

  const SortButton = ({ label, column }) => (
    <button
      onClick={() => onSort(column)}
      className="inline-flex items-center gap-1 hover:text-slate-700 transition"
    >
      {label}
      <ArrowUpDown size={12} />
      {sortConfig.sortBy === column ? (
        <span className="text-[10px] text-indigo-600">{sortConfig.order === 'asc' ? 'ASC' : 'DESC'}</span>
      ) : null}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className={headCell}><SortButton label="Complaint Title" column="title" /></th>
              <th className={headCell}><SortButton label="Category" column="category" /></th>
              <th className={headCell}>User Name</th>
              <th className={headCell}><SortButton label="Location" column="location" /></th>
              <th className={headCell}><SortButton label="Date Created" column="createdAt" /></th>
              <th className={headCell}><SortButton label="Current Status" column="status" /></th>
              <th className={headCell}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{complaint.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{complaint.category}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{complaint.user?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{complaint.location}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[complaint.status] || statusStyles.Pending}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={complaint.status}
                    disabled={loading}
                    onChange={(e) => onStatusUpdate(complaint._id, complaint.title, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
