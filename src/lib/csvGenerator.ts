import Papa from "papaparse";

export const generate = async (jsonData) => {
  const result = Papa.unparse(jsonData);
  console.log(result);
};
