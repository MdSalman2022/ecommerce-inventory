import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";

const Customers = () => {
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

  const handleAddCustomer = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const district = form.district.value;
    const address = form.address.value;
    const link = form.link.value;
    const image = form.image.files[0];

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgUpload) => {
          if (imgUpload.success) {
            const customer = {
              image: imgUpload.data.url,
              name,
              phone,
              district,
              address,
              link,
            };

            console.log(customer);
            addCustomer(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        image: "", // Set empty string for image
        name,
        phone,
        district,
        address,
        link,
      };

      console.log(customer);
      addCustomer(customer);
    }
  };

  const addCustomer = (customer) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-customer`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${customer.name} is added successfully`);
          refetch();
          setIsModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const [searchResults, setSearchResults] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["search-key"].value;

    console.log(customerSearchKey);

    let url = `${import.meta.env.VITE_SERVER_URL}/api/search-customer?`;

    if (customerSearchKey.match(/^\d+$/)) {
      url += `phonenumber=${customerSearchKey}`;
      console.log(url);
    } else {
      url += `name=${customerSearchKey}`;
      console.log(url);
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toast.success("Customer Found!!");
          setSearchResults(data.customers);
        } else {
          toast.error("Customer Not Found!!");
          setSearchResults([]);
        }
      })
      .catch((error) => {
        console.error("Error searching for customers:", error);
        setSearchResults([]);
      });
  };

  console.log(searchResults);

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
      <div className="flex justify-between border-b py-3">
        <p className="text-xl font-semibold">Customers List</p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportClick}
            className="btn-primary btn-outline btn"
          >
            Export
          </button>
          {/* Open the modal using ID.showModal() method */}

          {/* The button to open modal */}
          <label
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="btn-primary btn-outline btn"
          >
            Add Customer
          </label>
          <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <div className="bg-base-100">
              <p className="w-full p-5 text-2xl font-semibold shadow">
                Customer Information
              </p>
              <div>
                <form
                  onSubmit={handleAddCustomer}
                  className="flex flex-col gap-3 p-5"
                >
                  <input
                    className="input-bordered input "
                    type="text"
                    name="name"
                    placeholder="Facebook Name"
                  />
                  <input
                    className="input-bordered input "
                    type="text"
                    name="phone"
                    placeholder="Phone"
                  />
                  <input
                    className="input-bordered input "
                    type="text"
                    name="address"
                    placeholder="Address"
                  />

                  <div className="flex gap-3">
                    <select
                      name="district"
                      id="district"
                      className="input-bordered input"
                    >
                      <option value="" disabled>
                        Select Location
                      </option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                    <input
                      type="file"
                      name="image"
                      className="file-input-bordered file-input-primary file-input w-full max-w-xs"
                    />
                  </div>
                  <input
                    className="input-bordered input "
                    type="text"
                    name="link"
                    placeholder="Facebook inbox link"
                  />
                  <div>
                    <div className="flex w-full justify-between gap-3">
                      <label
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="btn"
                      >
                        Close!
                      </label>
                      <button
                        type="submit"
                        className="btn-success btn-outline btn"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalBox>
        </div>
      </div>
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
          <form onSubmit={handleSearch}>
            <input
              name="search-key"
              type="text"
              className="input-bordered input"
            />
          </form>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <th>Customer Details</th>
                <th>Purchase</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {!searchResults
                ? customers?.map((customer, index) => (
                    <tr key={index}>
                      <td className="flex flex-col gap-1">
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={
                                  customer.customer_details.image || avatarIcon
                                }
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
                          <span className="rounded-full border border-gray-500 p-1 text-2xl text-success">
                            <AiOutlineShoppingCart />
                          </span>
                          <span
                            onClick={() => {
                              setIsEditModalOpen(true);
                              setSelectedCustomer(customer);
                            }}
                            className="rounded-full border border-gray-500 p-1 text-2xl text-info"
                          >
                            <AiOutlineEdit />
                          </span>
                          <span
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                              setSelectedCustomer(customer);
                            }}
                            className="rounded-full border border-gray-500 p-1 text-2xl text-error"
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
                  ))
                : searchResults.map((customer, index) => (
                    <tr key={index}>
                      <td className="flex flex-col gap-1">
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={
                                  customer.customer_details.image || avatarIcon
                                }
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
                          <span className="rounded-full border border-gray-500 p-1 text-2xl text-success">
                            <AiOutlineShoppingCart />
                          </span>
                          <span
                            onClick={() => {
                              setIsEditModalOpen(true);
                              setSelectedCustomer(customer);
                            }}
                            className="rounded-full border border-gray-500 p-1 text-2xl text-info"
                          >
                            <AiOutlineEdit />
                          </span>
                          <span
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                              setSelectedCustomer(customer);
                            }}
                            className="rounded-full border border-gray-500 p-1 text-2xl text-error"
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

export default Customers;
