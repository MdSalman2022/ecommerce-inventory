import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

import ReactToPrint from "react-to-print";

const InvoiceGenerator = ({ item }) => {
  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "annoymous";
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [8.3, 11.7],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 11.7) / 8.3);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = "white";
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/&#2547;{imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save(`invoice.pdf`);
        };
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  const componentRef = useRef();

  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return formattedDate;
  }

  return (
    <div className="p-5">
      <div
        style={{
          padding: "1rem",
          color: "black",
          fontSize: "18px",
        }}
        id="print"
        ref={componentRef}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid black",
            padding: "1px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ height: "40px", width: "200px", objectFit: "cover" }}
              src="https://i.ibb.co/TW8T2kc/logo-momley.png"
              alt=""
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "12px",
              }}
            >
              <span>Momley.com, 2/2 Arambag Motijheel, Dhaka-1000</span>
              <span>Phone: 01700000000, Email: admin@momley.com</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <p>Invoice ID: {item._id}</p>
          </div>
        </div>

        <div
          style={{
            margin: "10px 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            fontSize: "14px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "bold" }}>Order Info</p>
            <p>Order ID: {item._id}</p>
            <p>Placed: {formatStockDate(item.timestamp)}</p>
            <p>Total Product: {item.length || 1}</p>
            <p>Delivery: Momley</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "bold" }}>Delivery Address</p>
            <p>Name: {item?.name}</p>
            <p>Address: {item.address}</p>
            <p>Phone: {item.phone}</p>
            <p>Email: {item?.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div>
            <table
              style={{
                width: "100%",
                textAlign: "left",
                color: "black",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    border: "2px solid #000",
                    fontSize: "14px",
                    backgroundColor: "#ccc",
                    padding: "5px",
                  }}
                >
                  <th style={{ textAlign: "start" }}>SL</th>
                  <th style={{ textAlign: "center" }}>Id</th>
                  <th style={{ textAlign: "center" }}>Product</th>
                  <th style={{ textAlign: "center" }}>Weight</th>
                  <th style={{ textAlign: "center" }}>Inv</th>
                  <th style={{ textAlign: "center" }}>Quantity</th>
                  <th style={{ textAlign: "center" }}>Price(Tk)</th>
                  <th style={{ textAlign: "center" }}>Total(Tk)</th>
                </tr>
              </thead>
              <tbody style={{ color: "#0066cc" }}>
                <tr style={{ marginTop: "5px", border: "1px solid #000" }}>
                  <td
                    style={{
                      minWidth: "10px",
                      textAlign: "start",
                      padding: "0px 5px",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      fontSize: "10px",
                      padding: "0px 5px",
                    }}
                  >
                    {item.product._id}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.product?.name}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.product?.weight}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.product?.weight}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.product.salePrice}
                  </td>
                  <td
                    style={{
                      minWidth: "50px",
                      textAlign: "center",
                      padding: "0px 5px",
                    }}
                  >
                    {item.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "1px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span> Total Weight:</span>
              <span style={{ textAlign: "end" }}>
                {item?.totalWeight || "1kg"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span>List Price Sum: </span>
              <span style={{ textAlign: "end" }}>
                {item?.product.salePrice}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span>Subtotal </span>
              <span style={{ textAlign: "end" }}>
                {item?.product.salePrice}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span>Shipping: </span>
              <span style={{ textAlign: "end" }}>{item?.deliveryCharge}</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span>Total: </span>
              <span style={{ textAlign: "end" }}>{item?.total}</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "2px solid black",
                padding: "1px",
                width: "300px",
              }}
            >
              <span>Customer Payable: </span>
              <span style={{ textAlign: "end" }}>{item?.total}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Thank you for your order
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <ReactToPrint
          trigger={() => (
            <button className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white">
              Print this out!
            </button>
          )}
          content={() => componentRef.current}
        />
        <button
          className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
          onClick={SaveAsPDFHandler}
        >
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
