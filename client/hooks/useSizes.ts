import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSizeService } from "@/services/sizes";
import { setSizes } from "@/store/slices/sizeSlice";
import { RootState } from "@/store/store";

const useSizes = () => {
  const dispatch = useDispatch();
  const sizes = useSelector((state: RootState) => state.sizes.sizes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL Sizes
  const getAllSizes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSizeService();
      dispatch(setSizes(response));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sizes,
    getAllSizes,
    loading,
    error,
  };
};

export default useSizes;
