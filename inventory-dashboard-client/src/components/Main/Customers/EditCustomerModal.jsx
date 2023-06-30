import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditCustomerModal = ({
  setIsEditModalOpen,
  isEditModalOpen,
  selectedCustomer,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditCustomer = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const district = form.district.value;
    const address = form.address.value;
    const link = form.link.value;
    const image = form.image.files[0];

    console.log(selectedCustomer?._id);

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

            console.log("edit modal", customer);
            updateCustomer(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        image: selectedCustomer?.image,
        name,
        phone,
        district,
        address,
        link,
      };

      console.log("edit modal", customer);
      updateCustomer(customer);
    }
  };

  const updateCustomer = (customer) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/put-edit-order/${
        selectedCustomer?._id
      }`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(customer),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${customer.name} is updated successfully`);
          refetch();
          setIsModalOpen(false);
          setIsEditModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    setIsModalOpen(isEditModalOpen);
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsEditModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  return (
    <div>
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="bg-base-100">
          <p className="text-2xl font-semibold p-5 shadow w-full">
            Customer Information
          </p>
          <div>
            <form
              onSubmit={handleEditCustomer}
              className="flex flex-col gap-3 p-5"
            >
              <input
                className="input input-bordered "
                type="text"
                name="name"
                placeholder="Facebook Name"
                defaultValue={selectedCustomer?.customer_details?.name}
              />
              <input
                className="input input-bordered "
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={selectedCustomer?.customer_details?.phone}
              />
              <input
                className="input input-bordered "
                type="text"
                name="address"
                placeholder="Address"
                defaultValue={selectedCustomer?.customer_details?.address}
              />

              <div className="flex items-end gap-3">
                <select
                  name="district"
                  id="district"
                  className="input input-bordered"
                  defaultValue={selectedCustomer?.customer_details?.location}
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
                <div className="flex items-center gap-3">
                  <img
                    className="w-12 h-12 rounded object-cover"
                    src={selectedCustomer?.customer_details?.image}
                    alt=""
                  />{" "}
                  <input
                    type="file"
                    name="image"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                  />
                </div>
              </div>
              <input
                className="input input-bordered "
                type="text"
                name="link"
                placeholder="Facebook inbox link"
                defaultValue={selectedCustomer?.customer_details?.link}
              />
              <div>
                <div className="flex justify-between gap-3 w-full">
                  <label
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="btn"
                  >
                    Close!
                  </label>
                  <button type="submit" className="btn btn-success btn-outline">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

export default EditCustomerModal;
