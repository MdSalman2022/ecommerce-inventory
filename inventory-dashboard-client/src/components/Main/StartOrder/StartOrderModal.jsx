import React, { useContext, useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { useQuery } from "react-query";

const StartOrderModal = ({ isStartNewOrderOpen, setIsStartNewOrderOpen }) => {
  const { products } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setIsModalOpen(isStartNewOrderOpen);
  }, [isStartNewOrderOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsStartNewOrderOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const handleOrder = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const district = form.district.value;
    const courier = form.courier.value;
    const deliveryCharge = form.deliveryCharge.value;
    const discount = form.discount.value;
    const total = form.totalBill.value;
    const advance = form.advance.value;
    const cash = form.cashCollect.value;
    const instruction = form.instruction.value;
    const image = form.image.files[0];

    console.log(
      name,
      phone,
      address,
      district,
      product,
      quantity,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction
    );

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_KEY
      }`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgUpload) => {
          if (imgUpload.success) {
            const order = {
              image: imgUpload.data.url,
              name,
              phone,
              address,
              district,
              product,
              quantity,
              courier,
              deliveryCharge,
              discount,
              total,
              advance,
              cash,
              instruction,
            };

            console.log(order);
            addOrder(order);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const order = {
        image: "",
        name,
        phone,
        address,
        district,
        product,
        quantity,
        courier,
        deliveryCharge,
        discount,
        total,
        advance,
        cash,
        instruction,
      };
      addOrder(order);
    }
  };

  const addOrder = (product) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/post-order`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${product.name} is added successfully`);
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

  useEffect(() => {
    if (product && quantity) {
      console.log(product.name);
      console.log(product.salePrice);
      const price = parseInt(product.salePrice);
      console.log(price);
      console.log(price * quantity);
      setTotalPrice(price * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [quantity, product]);

  console.log(totalPrice);

  return (
    <div>
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="flex flex-col ">
          <p className="border-b p-5">Order Information</p>
          <form onSubmit={handleOrder} className="grid grid-cols-2 gap-5 p-5">
            <input
              type="text"
              className="input-bordered input"
              placeholder="Facebook Name"
              name="name"
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Phone"
              name="phone"
            />
            <input
              type="text"
              className="input-bordered input col-span-2"
              placeholder="Address"
              name="address"
            />
            <select
              name="district"
              id="district"
              className="input-bordered input col-span-2"
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
            <div className=" col-span-2 flex w-full flex-col gap-3 rounded bg-gray-100 p-5">
              <p className="text-xl font-semibold">Products</p>
              <select
                name="product"
                id="product"
                className="input-bordered input w-full"
                onChange={(e) => {
                  const selectedProductId = e.target.value;
                  const selectedProduct = products.find(
                    (product) => product._id === selectedProductId
                  );
                  console.log(selectedProduct);
                  setProduct(selectedProduct);
                }}
              >
                {products?.map((product) => (
                  <option
                    key={product._id}
                    name="productDetails"
                    value={product._id}
                  >
                    {product.name} - ৳ {product.salePrice} -{" "}
                    {product.availableQty} available products
                  </option>
                ))}
              </select>
            </div>
            <select
              className="select-bordered select col-span-2 w-full"
              name="courier"
            >
              <option value="Pathao">Pathao</option>
              <option value="RedX">RedX</option>
              <option value="Steadfast" selected>
                Steadfast
              </option>
              <option value="Pidex">Pidex</option>
              <option value="eCourier">eCourier</option>
              <option value="PaperFly">PaperFly</option>
              <option value="Sundarban">Sundarban</option>
              <option value="SA Paribahan">SA Paribahan</option>
              <option value="Store Pickup">Store Pickup</option>
            </select>
            <input
              type="number"
              className="input-bordered input"
              placeholder="Quantity"
              name="quantity"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Delivery Charge"
              name="deliveryCharge"
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Discount"
              name="discount"
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Total Bill"
              name="totalBill"
              value={totalPrice || 0}
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Advance"
              name="advance"
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Cash Collect"
              name="cashCollect"
            />
            <input
              type="text"
              className="input-bordered input col-span-2"
              placeholder="Exchange/special instruction"
              name="instruction"
            />
            <div className="col-span-2 w-60 space-y-2">
              <p>Other Pictures</p>
              <input
                type="file"
                name="image"
                className="file-input-bordered file-input-primary  file-input w-fit"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="btn-error btn-outline btn"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn">
              Save
            </button>
          </form>
        </div>
      </ModalBox>
    </div>
  );
};

export default StartOrderModal;
