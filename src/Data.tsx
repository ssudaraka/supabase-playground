import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";

function Data() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("user_activities")
        .select(`id, activity_type, users(name), record_version(*)`);
      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Under construction</h1>
      {/* <h1>Notes</h1>

      {data ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, key) => {
              <tr key={key}>
                <td>{val.title}</td>
                <td>{val.description}</td>
              </tr>;
            })}
          </tbody>
        </table>
      ) : (
        <p>Oops!</p>
      )} */}
    </>
  );
}

export default Data;
