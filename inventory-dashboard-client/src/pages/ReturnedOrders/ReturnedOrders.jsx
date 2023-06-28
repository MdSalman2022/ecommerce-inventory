import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const ReturnedOrders = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  console.log(isEditModalOpen);
  console.log(selectedCustomer);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: customers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    "customers",
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/get-customers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      return response.json();
    },
    {
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    }
  );

  console.log(customers);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/customer-export`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        link.download = "exported_data.csv";

        // Append the link to the document body
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);

        // Release the temporary URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error exporting data:", error);
        // Handle error appropriately
      });
  };

  // console.log(isModalOpen);

  return (
    <div className="space-y-4">
      <EditCustomerModal
        setIsEditModalOpen={setIsEditModalOpen}
        isEditModalOpen={isEditModalOpen}
        selectedCustomer={selectedCustomer}
        refetch={refetch}
      />
      <DeleteCustomerModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCustomer={selectedCustomer}
        refetch={refetch}
      />
      <div className="flex justify-between items-start py-3 border-b">
        <div>
          <p className="text-xl font-semibold">Returned Orders</p>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn btn-outline btn-primary">
            Advance Search
          </button>
          <Link to="import-csv" className="btn btn-outline btn-primary">
            Create Bulk Order
          </Link>
          <button
            onClick={handleExportClick}
            className="btn btn-outline btn-primary"
          >
            Export Orders
          </button>
          {/* Open the modal using ID.showModal() method */}

          {/* The button to open modal */}
        </div>
      </div>
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

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Name</th>
                <th>Prods/Pics</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {customers?.map((customer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="flex flex-col gap-1">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={customer.customer_details.image || avatarIcon}
                            alt="image"
                            className="rounded-full border-2 border-primary p-1"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {customer.customer_details.name}
                        </div>
                        <div className="text-sm opacity-50">
                          {customer.customer_details.location}
                        </div>
                        <div className="text-sm opacity-50">
                          {customer.customer_details.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 border border-gray-500 rounded-full text-2xl text-success">
                        <AiOutlineShoppingCart />
                      </span>
                      <span
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setSelectedCustomer(customer);
                        }}
                        className="p-1 border border-gray-500 rounded-full text-2xl text-info"
                      >
                        <AiOutlineEdit />
                      </span>
                      <span
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedCustomer(customer);
                        }}
                        className="p-1 border border-gray-500 rounded-full text-2xl text-error"
                      >
                        <RiDeleteBin6Line />
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>Total: {customer.purchase.total}</div>
                    {customer.purchase.last_purchase ? (
                      <div>
                        Last purchase: {customer.purchase.last_purchase}
                      </div>
                    ) : (
                      <></>
                    )}
                  </td>
                  <td>
                    <div>Total: {customer.purchase.total}</div>
                    {customer.purchase.last_purchase ? (
                      <div>
                        Last purchase: {customer.purchase.last_purchase}
                      </div>
                    ) : (
                      <></>
                    )}
                  </td>
                  <td>
                    <div>
                      <p>Processing: {customer.orders.processing}</p>
                      {customer.orders.ready ? (
                        <p>Ready: {customer.orders.ready}</p>
                      ) : (
                        <p>Ready: 0</p>
                      )}

                      {customer.orders.completed ? (
                        <p>Completed: {customer.orders.completed}</p>
                      ) : (
                        <p>Completed: 0</p>
                      )}
                      {customer.orders.returned ? (
                        <p>Returned: {customer.orders.returned}</p>
                      ) : (
                        <p>Returned: 0</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default ReturnedOrders;
