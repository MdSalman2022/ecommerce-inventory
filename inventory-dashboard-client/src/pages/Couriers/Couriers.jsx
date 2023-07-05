import React, { useState } from "react";

const Couriers = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  const handleGetToken = async () => {
    try {
      const response = await fetch(
        "https://courier-api-sandbox.pathao.com/aladdin/api/v1/issue-token",
        {
          method: "POST",
          mode: "no-cors", // no-cors, *cors, same-origin
          headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            client_id: "267",
            client_secret: "wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39",
            username: "test@pathao.com",
            password: "lovePathao",
            grant_type: "password",
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      setTokenInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tokenInfo);

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <p className="text-xl font-bold">Couriers</p>
        <button onClick={() => handleGetToken()} className="btn-primary btn">
          Add Courier
        </button>
      </div>
      <hr />

      <div className="space-y-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select name="page" id="page" className="input-bordered input p-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <p>entries</p>
          </div>
          <div className="flex items-center gap-2">
            <p>Search</p>
            <form>
              <input
                name="search-key"
                type="text"
                className="input-bordered input"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table bg-white">
            {/* head */}
            <thead>
              <tr>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th className="w-5">1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>
                  <button className="badge badge-success">Active</button>
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <th>Showing 1 to 2 of 2 entries</th>
                <th></th>
                <th></th>
                <th className="flex justify-end">
                  <div className="join">
                    <button className="join-item btn">Previous</button>
                    <button className="btn-primary join-item btn">1</button>
                    <button className="join-item btn ">Next</button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Couriers;
