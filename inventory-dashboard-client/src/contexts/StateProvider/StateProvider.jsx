import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../AuthProvider/AuthProvider";

export const StateContext = createContext();

const StateProvider = ({ children }) => {
  // const [allData, setAllData] = useState([]);
  const { user } = useContext(AuthContext);

  const [designerId, setDesignerId] = useState("");

  const {
    data: products,
    isLoading: productsIsLoading,
    error: productsError,
    refetch: refetchProducts,
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

  const stateInfo = {
    products,
    refetchProducts,
    productsIsLoading,
  };

  return (
    <StateContext.Provider value={stateInfo}>{children}</StateContext.Provider>
  );
};
export default StateProvider;
