import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { useQuery } from "react-query";
import avatarIcon from "../../assets/shared/avatar.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import DeleteProductModal from "../../components/Main/Products/DeleteProductModal";
import EditProductModal from "../../components/Main/Products/EditProductModal";

const Products = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  console.log(isEditModalOpen);
  //   console.log(selectedProduct);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    "products",
    async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/get-products`,
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
  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/product-export`, {
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

  const handleAddProduct = (event) => {
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
            const product = {
              image: imgUpload.data.url,
              name,
              description,
              brand,
              supplier,
              country,
              store,
              liftPrice,
              salePrice,
              qty,
            };

            console.log(product);
            addProduct(product);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const product = {
        image: "",
        name,
        description,
        brand,
        supplier,
        country,
        store,
        liftPrice,
        salePrice,
        qty,
      };

      console.log(product);
      addProduct(product);
    }
  };

  const addProduct = (product) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/add-product`, {
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

  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return formattedDate;
  }

  const totalProductValue = products?.reduce((acc, product) => {
    return acc + product.salePrice * product.availableQty;
  }, 0);

  const totalSupplierCount = products?.reduce((acc, product) => {
    let count = 0;
    if (acc[product.supplier]) {
      count = acc[product.supplier] + 1;
    } else {
      count = 1;
    }
    return {
      ...acc,
      [product.supplier]: count,
    };
  }, {});

  const totalSupplierLength =
    products?.length > 0 &&
    Object?.keys(totalSupplierCount)?.map((key) => ({
      name: key,
      count: totalSupplierCount[key],
    }));
  console.log(totalSupplierLength);

  return (
    <div className="space-y-4">
      <EditProductModal
        setIsEditModalOpen={setIsEditModalOpen}
        isEditModalOpen={isEditModalOpen}
        selectedProduct={selectedProduct}
        refetch={refetch}
      />
      <DeleteProductModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedProduct={selectedProduct}
        refetch={refetch}
      />
      <div className="grid grid-cols-3 gap-5">
        <div className="p-2 border bg-white rounded-lg">
          <p className="text-xl font-semibold">Product Stock Info</p>
          <p>Total Available</p>
          <div className="grid grid-cols-2">
            <p>Category</p>
            <p>{totalSupplierLength?.length}</p>
            <p>Items </p>
            <p>{products?.length}</p>
            <p>Value</p>
            <p>{totalProductValue}</p>
          </div>
        </div>
        <div className="p-2 border bg-white rounded-lg">
          <p className="text-xl font-semibold">This Month Stock In</p>
          <p>Total Available</p>
          <div className="grid grid-cols-2">
            <p>Category</p>
            <p>{totalSupplierLength?.length}</p>
            <p>Items </p>
            <p>{products?.length}</p>
            <p>Value</p>
            <p>{totalProductValue}</p>
          </div>
        </div>
        <div className="p-2 border bg-white rounded-lg">
          <p className="text-xl font-semibold">Last Month Stock In</p>
          <p>Total Available</p>
          <div className="grid grid-cols-2">
            <p>Category</p>
            <p>{totalSupplierLength?.length}</p>
            <p>Items </p>
            <p>{products?.length}</p>
            <p>Value</p>
            <p>{totalProductValue}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-3 border-b">
        <p className="text-xl font-semibold">Products List</p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleExportClick}
            className="btn btn-outline btn-primary"
          >
            Export
          </button>
          <label
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="btn btn-outline btn-primary"
          >
            Add Product
          </label>
          <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <div className="bg-base-100">
              <p className="text-2xl font-semibold p-5 shadow w-full">
                Product Information
              </p>
              <div>
                <form
                  onSubmit={handleAddProduct}
                  className="flex flex-col gap-3 p-5"
                >
                  <input
                    className="input input-bordered "
                    type="text"
                    name="name"
                    placeholder="Product Title / Name"
                  />
                  <textarea
                    className="input input-bordered h-24 min-h-min max-h-fit py-2 "
                    type="text"
                    name="description"
                    placeholder="Description"
                  />
                  <div className="flex gap-3">
                    <input
                      className="input input-bordered w-1/2 "
                      type="text"
                      name="brand"
                      placeholder="Brand"
                    />
                    <input
                      className="input input-bordered w-1/2 "
                      type="text"
                      name="country"
                      placeholder="Country"
                    />
                  </div>

                  <div className="flex gap-3">
                    <select
                      name="supplier"
                      id="supplier"
                      className="input input-bordered w-1/2"
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
                    />
                    <input
                      className="input input-bordered w-full "
                      type="number"
                      name="salePrice"
                      placeholder="Sale Price"
                    />
                  </div>
                  <div className="flex gap-3">
                    <input
                      className="input input-bordered w-full "
                      type="number"
                      name="qty"
                      placeholder="QTY"
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
                <th className="w-5">#</th>
                <th className="w-60 min-w-fit max-w-96">Product Name</th>
                <th>Supplier</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Stock Date</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product, index) => (
                <tr key={index}>
                  <th className="w-5">{index + 1}</th>
                  <td className="flex flex-col gap-1 w-60 min-w-fit max-w-96">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product.image || avatarIcon}
                            alt="image"
                            className="rounded-full border-2 border-primary p-1"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-sm opacity-50">
                          {product.location}
                        </div>
                        <div className="text-sm opacity-50">
                          {product.address}
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
                          setSelectedProduct(product);
                        }}
                        className="p-1 border border-gray-500 rounded-full text-2xl text-info"
                      >
                        <AiOutlineEdit />
                      </span>
                      <span
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedProduct(product);
                        }}
                        className="p-1 border border-gray-500 rounded-full text-2xl text-error"
                      >
                        <RiDeleteBin6Line />
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>{product.supplier}</div>
                  </td>
                  <td>
                    <div>Avl: {product.availableQty}</div>
                    <div>(Qty: {product.qty})</div>
                  </td>
                  <td>
                    <div>S: {product.salePrice}</div>
                    <div>(P: {product.liftPrice})</div>
                  </td>
                  <td>
                    <div>
                      <p>Processing: {formatStockDate(product.stockDate)}</p>
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

export default Products;
