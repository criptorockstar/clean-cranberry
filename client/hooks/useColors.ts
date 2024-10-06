import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllColorService } from "@/services/colors";
import { setColors } from "@/store/slices/colorSlice";
import { RootState } from "@/store/store";

const useColors = () => {
  const dispatch = useDispatch();
  const colors = useSelector((state: RootState) => state.colors.colors);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL COLORS
  const getAllColors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllColorService();
      dispatch(setColors(response));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    colors,
    getAllColors,
    loading,
    error,
  };
};

export default useColors;
