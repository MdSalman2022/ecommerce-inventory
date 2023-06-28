import React from "react";
import { RxDashboard } from "react-icons/rx";
import { BsPeopleFill, BsFillBarChartFill } from "react-icons/bs";
import { AiOutlineOrderedList, AiOutlineShoppingCart } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiCrownSimpleBold } from "react-icons/pi";
import { GiReturnArrow } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
import { NavLink } from "react-router-dom";

const SideBar = ({ children }) => {
  const pages = [
    {
      name: "dashboard",
      icon: <RxDashboard />,
      route: "/",
    },
    {
      name: "customers",
      icon: <BsPeopleFill />,
      route: "/customers",
    },
    {
      name: "start-order",
      icon: <AiOutlineShoppingCart />,
      route: "/start-order",
    },
    {
      name: "orders-processing",
      icon: <AiOutlineOrderedList />,
      route: "/orders-processing",
    },
    {
      name: "all-ready-orders",
      icon: <LiaFileInvoiceSolid />,
      route: "/all-ready-orders",
    },
    {
      name: "steadfast",
      icon: <CiDeliveryTruck />,
      route: "/steadfast",
    },
    {
      name: "completed-orders",
      icon: <PiCrownSimpleBold />,
      route: "/completed-orders",
    },
    {
      name: "returned-orders",
      icon: <GiReturnArrow />,
      route: "/returned-orders",
    },
    {
      name: "cancelled-orders",
      icon: <RiDeleteBin5Line />,
      route: "/cancelled-orders",
    },
    {
      name: "products",
      icon: <CgDatabase />,
      route: "/products",
    },
    {
      name: "loss-profit",
      icon: <BsFillBarChartFill />,
      route: "/loss-profit",
    },
    {
      name: "transactions",
      icon: <GrTransaction />,
      route: "/transactions",
    },
    {
      name: "logout",
      icon: <BiLogOut />,
      route: "/logout",
    },
  ];

  let activeClassName = `bg-primary text-white rounded-lg`;

  return (
    <div>
      <div className="grid grid-cols-7 text-black">
        <div className="col-span-1 h-full bg-white">
          <div className="flex flex-col gap-5 w-full bg-white px-5 py-4 h-[93vh]">
            {pages.map((page, index) => (
              <NavLink
                key={index}
                to={page.route}
                className={({ isActive }) =>
                  isActive ? activeClassName : "text-gray-600"
                }
              >
                <p className="p-2 capitalize hover:bg-primary  hover:text-white rounded-lg cursor-pointer flex items-center justify-start gap-4 text-sm">
                  {page.icon}
                  {page.name}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="col-span-6 p-5">{children}</div>
      </div>
    </div>
  );
};

export default SideBar;
