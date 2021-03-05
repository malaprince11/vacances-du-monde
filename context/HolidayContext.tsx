import trackerApi from "../api/tracker";
import { AsyncStorage } from "react-native";
import createDataContext from "../createDataContext";

// utilisation d'un context et dispatch pour gérer les routes de l'api et dispatch les données dans toute l'app

export const holidayReducer = (state: any, action: any ,) => {
  switch (action.type) {
    case "get_all_country":
      return { ...state, country: action.payload };
    case "get_today_holiday":
      return { ...state, holiday: action.payload,};
    case "get_next_holiday":
      return {
        ...state,
        selectedHolidays: action.payload,
      };
    default:
      return state;
  }
};
//Methode d'initialisation des pays
const initCountry = (dispatch: any) => {
  return async () => {
    try {
      const getCountries = await trackerApi.get(
        "/v2/AvailableCountries"
      );
      dispatch({
        type: "get_all_country",
        payload: getCountries.data,
      });
      
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Il y a une galère avec le get des holiday",
      });
    }
  };
};
// Methode pour recupérer les données de is today holiday 
const todayHoliday = (dispatch: any) => {
  return async (countryCode: string) => {
    const token = await AsyncStorage.getItem("");
     
     
    try {
      const getTodayHoliday = await trackerApi.get(
        "/v2/IsTodayPublicHoliday/"+ countryCode,
        {
          headers: {},
        }
      );

        
        

      dispatch({
        type: "get_today_holiday",
        payload: getTodayHoliday.data,
      });
   
    } catch (error) {
      console.log("error :", error.response);
      
      dispatch({
        type: "add_error",
        payload: "Il y a une galère avec le get des holiday",
      });
    }
  };
};

// methode pour connaitres les prochaines vacances 
const nextHoliday = (dispatch: any) => {
  return async (year: number, countryCode:string) => {
   
    try {
      const getNextTreeHoliday = await trackerApi.get("/v2/NextPublicHolidays/" + countryCode, {
        headers: {
    
        },
      });
       
      dispatch({
        type: "get_next_holiday",
        payload:  getNextTreeHoliday.data,
      });
      
    } catch (error) {
      console.log("error : ", error.response)
      dispatch({
        type: "add_error",
        payload: "Il y a un probléme avec le get des holiday",
      });
    
  }
}};
// utilisation du provider pour exporté toutes mes methodes 
export const { Provider, Context } = createDataContext(
  holidayReducer,
  {
    nextHoliday,
    todayHoliday,
    initCountry,
 
  },
  {}
);
