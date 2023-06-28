import React from "react";
import StatCard from "../../components/Main/Dashboard/StatCard";
import { AiOutlineOrderedList, AiOutlineShoppingCart } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { BsFillBarChartFill, BsPeopleFill } from "react-icons/bs";

const Dashboard = () => {
  const orderSummary = [
    {
      name: "On Process",
      value: "0 (৳0)",
      icon: <AiOutlineOrderedList />,
    },
    {
      name: "Ready Orders",
      value: "1 (৳1,400)",
      icon: <LiaFileInvoiceSolid />,
    },
    {
      name: "Today's Send",
      value: "0 (৳0)",
      icon: <BsFillBarChartFill />,
    },
    {
      name: "Today's Sale(Qty)",
      value: "0 (৳0)",
      icon: <AiOutlineShoppingCart />,
    },
  ];

  const customers = [
    {
      name: "Today",
      value: "0",
      icon: <BsPeopleFill />,
    },
    {
      name: "This Month",
      value: "3",
      icon: <BsPeopleFill />,
    },
    {
      name: "Total",
      value: "2",
      icon: <BsPeopleFill />,
    },
    {
      name: "Repeated",
      value: "1 (50.00)%",
      icon: <BsPeopleFill />,
    },
  ];

  const stats = [
    {
      name: "Yesterday's",
      sales: "৳0",
      stats: {
        orders: "0",
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "This Week",
      sales: "৳0",
      stats: {
        orders: "0",
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "This Month",
      sales: "৳0",
      stats: {
        orders: "0",
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
    {
      name: "Last Month",
      sales: "৳0",
      stats: {
        orders: "0",
        quantity: "0",
        customer: "0",
        return: "0",
      },
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xl">Order Summary</p>
      <div className="grid grid-cols-4 gap-5">
        {orderSummary.map((order, index) => (
          <StatCard key={index}>
            <div className="flex justify-between items-center h-16 p-2">
              <div className="flex flex-col gap-3">
                <p>{order.name}</p>
                <p className="text-2xl">{order.value}</p>
              </div>
              <span className="text-3xl p-2 rounded-lg bg-[#f5f5f5]">
                {order.icon}
              </span>
            </div>
          </StatCard>
        ))}
      </div>
      <p className="text-xl">Customers</p>
      <div className="grid grid-cols-4 gap-5">
        {customers.map((customer, index) => (
          <StatCard key={index}>
            <div className="flex justify-between items-center h-16 p-2">
              <div className="flex flex-col gap-3">
                <p>{customer.name}</p>
                <p className="text-2xl">{customer.value}</p>
              </div>
              <span className="text-3xl p-2 rounded-lg bg-[#f5f5f5]">
                {customer.icon}
              </span>
            </div>
          </StatCard>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <div className="p-2 flex flex-col gap-2">
              <p className="text-xl">{stat.name}</p>
              <div className="flex justify-between">
                <p className="font-medium">Sales:</p>
                <p className="text-2xl font-medium bg-gray-200 w-32 py-1 rounded-lg flex justify-center">
                  {stat.sales}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <p className="font-medium">Orders:</p>
                  <p className="text-lg">{stat.stats.orders}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Quantity:</p>
                  <p className="text-lg">{stat.stats.quantity}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Customer:</p>
                  <p className="text-lg">{stat.stats.customer}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Return:</p>
                  <p className="text-lg">{stat.stats.return}</p>
                </div>
              </div>
            </div>
          </StatCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
