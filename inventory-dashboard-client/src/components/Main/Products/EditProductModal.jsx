import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditProductModal = ({
  setIsEditModalOpen,
  isEditModalOpen,
  selectedProduct,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProduct = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const description = form.description.value;
    const brand = form.brand.value;
    const image = form.image.files[0];
    const supplier = form.supplier.value;
    const country = form.country.value;
    const store = form.store.value;
    const liftPrice = form.liftPrice.value;
    const salePrice = form.salePrice.value;
    const availableQty = form.availableQty.value;
    const qty = form.qty.value;

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
              description,
              brand,
              supplier,
              country,
              store,
              liftPrice,
              salePrice,
              availableQty,
              qty,
            };

            console.log("edit modal", customer);
            updatedProduct(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        image: selectedProduct?.image,
        name,
        description,
        brand,
        supplier,
        country,
        store,
        liftPrice,
        salePrice,
        availableQty,
        qty,
      };

      console.log("edit modal", customer);
      updatedProduct(customer);
    }
  };

  const updatedProduct = (customer) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/put-edit-product/${
        selectedProduct?._id
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
              onSubmit={handleEditProduct}
              className="flex flex-col gap-3 p-5"
            >
              <input
                className="input input-bordered "
                type="text"
                name="name"
                placeholder="Product Title / Name"
                defaultValue={selectedProduct?.name}
              />
              <textarea
                className="input input-bordered h-24 min-h-min max-h-fit py-2 "
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={selectedProduct?.description}
              />
              <div className="flex gap-3">
                <input
                  className="input input-bordered w-1/2 "
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  defaultValue={selectedProduct?.brand}
                />
                <input
                  className="input input-bordered w-1/2 "
                  type="text"
                  name="country"
                  placeholder="Country"
                  defaultValue={selectedProduct?.country}
                />
              </div>

              <div className="flex gap-3">
                <select
                  name="supplier"
                  id="supplier"
                  className="input input-bordered w-1/2"
                  defaultValue={selectedProduct?.supplier}
                >
                  <option value="" disabled>
                    Select Supplier
                  </option>
                  <option value="One Publication">One Publication</option>
                  <option value="Two Publication">Two Publication</option>
                </select>
                <select
                  name="store"
                  id="store"
                  className="input input-bordered w-1/2"
                  defaultValue={selectedProduct?.store}
                >
                  <option value="" disabled>
                    Select Store
                  </option>
                  <option value="One Store">One Store</option>
                  <option value="Two Store">Two Store</option>
                </select>
              </div>

              <div className="flex gap-3">
                <input
                  className="input input-bordered w-full "
                  type="number"
                  name="liftPrice"
                  placeholder="Lift Price"
                  defaultValue={selectedProduct?.liftPrice}
                />
                <input
                  className="input input-bordered w-full "
                  type="number"
                  name="salePrice"
                  placeholder="Sale Price"
                  defaultValue={selectedProduct?.salePrice}
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="input input-bordered w-full "
                  type="number"
                  name="qty"
                  placeholder="QTY"
                  defaultValue={selectedProduct?.qty}
                />
                <input
                  className="input input-bordered w-full "
                  type="number"
                  name="availableQty"
                  placeholder="Available Product"
                  defaultValue={selectedProduct?.availableQty}
                />
              </div>
              <div className="flex gap-3">
                <img
                  className="w-10 h-10 object-cover"
                  src={selectedProduct?.image}
                  alt=""
                />
                <input
                  type="file"
                  name="image"
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
              </div>
              <div>
                <div className="flex justify-between gap-3 w-full">
                  <label
                    type="button"
                    // onClick={() => setIsModalOpen(false)}
                    className="btn btn-error btn-outline w-1/2"
                  >
                    Close!
                  </label>
                  <button
                    type="submit"
                    className="btn btn-success btn-outline w-1/2"
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
  );
};

export default EditProductModal;
