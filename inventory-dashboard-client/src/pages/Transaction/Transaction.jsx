import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const Transaction = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div>
          <p>Transactions</p>
          <p>Total: ৳1,450 </p>
          <p>Total Received ৳1,450 Total Pending ৳0</p>
        </div>
        <select className="select select-primary w-full max-w-xs">
          <option disabled selected>
            Filter by Courier
          </option>
          <option value="All">All</option>
          <option value="Pathao">Pathao</option>
          <option value="RedX">RedX</option>
          <option value="Steadfast">Steadfast</option>
          <option value="Pidex">Pidex</option>
          <option value="eCourier">eCourier</option>
          <option value="PaperFly">PaperFly</option>
          <option value="Sundarban">Sundarban</option>
          <option value="SA Paribahan">SA Paribahan</option>
          <option value="Store Pickup">Store Pickup</option>
        </select>
      </div>
      <hr />
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <p>Show</p>
          <select name="page" id="page" className="p-2 input input-bordered">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p>entries</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Search</p>
          <input type="text" className="input input-bordered" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="table">
          {/* head */}
          <thead className="bg-primary text-white rounded-lg">
            <tr>
              <th className="w-5"></th>
              <th className="w-5">#</th>
              <th>Date</th>
              <th>Info</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <th>
                <span className="bg-white">
                  <RiDeleteBin6Line className="border border-primary p-2 text-4xl rounded-full text-red-500" />
                </span>
              </th>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
          </tbody>
          <tfoot className="bg-white">
            <tr>
              <th>Showing 1 to 2 of 2 entries</th>
              <th></th>
              <th></th>
              <th></th>
              <th className="flex justify-end">
                <div className="join">
                  <button className="join-item btn">Previous</button>
                  <button className="join-item btn btn-primary">1</button>
                  <button className="join-item btn ">Next</button>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
