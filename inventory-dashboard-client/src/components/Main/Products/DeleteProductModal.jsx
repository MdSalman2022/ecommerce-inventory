import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import avatarIcon from "../../../assets/shared/avatar.png";

const DeleteProductModal = ({
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  selectedProduct,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsDeleteModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:5000/api/delete-product/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Customer deleted successfully");
        refetch();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>
        <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div className="bg-base-100">
            <p className="text-xl font-semibold p-3 shadow w-full">
              Delete Product
            </p>
            <div className="w-full bg-white p-5 flex flex-col gap-10">
              <p className="text-2xl">
                Are you sure you want to delete this customer?
              </p>
              <div className="flex justify-center gap-5">
                <img
                  className="w-10 h-10"
                  src={selectedProduct?.image || avatarIcon}
                  alt=""
                />
                <p className="text-2xl">{selectedProduct?.name}</p>
              </div>
              <div className="flex justify-between">
                <button className="btn btn-error btn-outline">Cancel</button>
                <button
                  onClick={() => handleDeleteProduct(selectedProduct?._id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalBox>
      </div>
    </div>
  );
};

export default DeleteProductModal;
