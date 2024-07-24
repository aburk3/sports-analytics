import { useState, useEffect } from "react";
import { Prop } from "../components/PropsTable/types";

const useProps = (apiBaseUrl: string) => {
  const [props, setProps] = useState<Prop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}:3035/props`);
        const result = await response.json();
        setProps(result);
      } catch (error) {
        console.error("Error fetching props:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [apiBaseUrl]);

  return { props, propsLoading: loading };
};

export default useProps;
