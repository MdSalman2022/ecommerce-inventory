import React from "react";
import StatCard from "../../components/Main/Dashboard/StatCard";

const LossProfitPage = () => {
  return (
    <div className="space-y-5">
      <div className="flex gap-5">
        <input
          type="text"
          className="input input-bordered"
          placeholder="From"
        />
        <input type="text" className="input input-bordered" placeholder="To" />
        <button className="btn btn-primary">Search</button>
      </div>
      <p className="text-4xl">Loss Profit Details</p>
      <p>
        This Figure is calculated based on the data you provided in your product
        details.
      </p>
      <p>Note: Red 0-39%, Yellow 40-59%, Blue 60-79%, Green above 79%</p>

      <div className="grid grid-cols-4 gap-5">
        <StatCard>
          <p className="font-semibold">Total Orders</p>
          <p>1</p>

          <progress
            className="progress progress-success w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Orders</p>
          <p>1</p>

          <progress
            className="progress progress-success w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Orders</p>
          <p>1</p>

          <progress
            className="progress progress-success w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
        <StatCard>
          <p className="font-semibold">Total Orders</p>
          <p>1</p>

          <progress
            className="progress progress-success w-56"
            value="70"
            max="100"
          ></progress>
        </StatCard>
      </div>
    </div>
  );
};

export default LossProfitPage;
