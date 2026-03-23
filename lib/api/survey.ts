import axiosInstance from "../axiosInstance";

export const getSurvey = async () => {
  try {
    const res = await axiosInstance.get("/survey/items/normal");

    console.log("surveyRes", res);

    return res;
  } catch (error) {
    throw error;
  }
};

export const submitSurvey = async (payload: {
  typeId: number;
  answers: {
    answer: string | null;
    orderNumber: number;
  }[];
}) => {
  try {
    const res = await axiosInstance.post("/survey/responses", payload);
    console.log("submitSurvey res", res);
    return res;
  } catch (error) {
    throw error;
  }
};
