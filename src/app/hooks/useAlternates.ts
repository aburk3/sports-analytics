import { useState, useEffect } from "react";
import { Alternate } from "../components/PropsTable/types";

const useAlternates = (apiBaseUrl: string) => {
  const [alternates, setAlternates] = useState<Alternate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}:3030/alternates`);
        const result = await response.json();
        setAlternates(result);
      } catch (error) {
        console.error("Error fetching alternates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternates();
  }, [apiBaseUrl]);

  return { alternates, alternatesLoading: loading };
};

export default useAlternates;
