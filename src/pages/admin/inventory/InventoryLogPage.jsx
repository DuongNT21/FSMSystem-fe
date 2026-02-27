import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBatchLogs } from "../../../services/inventoryService";

export default function InventoryLogPage() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await getBatchLogs(id);
      setLogs(res?.data || []);
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">
        Inventory Logs (Batch #{id})
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Action</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.actionType}</td>
                <td className="p-3">{log.quantity}</td>
                <td className="p-3">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
