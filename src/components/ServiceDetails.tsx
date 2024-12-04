import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const ServiceDetails: React.FC = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Map serviceName to corresponding table name in Supabase
  const serviceTableMap: { [key: string]: string } = {
    "first-communion": "firstcommunionforms",
    "kumpil": "kumpilforms",
    "special-mass": "specialmassforms",
    "wedding": "weddingforms",
    "house-blessing": "houseblessingforms",
    "prayer-intention": "prayerintentionforms",
    "baptism": "baptismforms",
    "funeral-mass": "funeralmassforms",
  };

  const tableName = serviceTableMap[serviceName || ""];

  useEffect(() => {
    const fetchData = async () => {
      if (!tableName) return;
      setLoading(true);

      try {
        const { data: serviceData, error } = await supabase.from(tableName).select("*");
        if (error) throw error;

        setData(serviceData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{serviceName?.replace("-", " ")}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b border-gray-300 text-left text-gray-600 font-bold uppercase text-sm"
                  >
                    {key.replace("_", " ")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-2 border-b border-gray-300 text-gray-700"
                  >
                    {value ? value.toString() : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceDetails;
