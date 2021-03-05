import React, { useEffect, useContext, useState, useRef } from "react";
import { Context as HolidayContext } from "../context/HolidayContext";
import { TextInput, Button, Card, Title, Paragraph } from "react-native-paper";
import { View, TouchableOpacity, StyleSheet, ScrollView ,} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Text, Header } from "react-native-elements";

import { Formik } from "formik";
import * as Yup from "yup";

// Yup qui nous sert a gérer les champs required par le formik
const HolidaySchema = Yup.object().shape({
  countryCode: Yup.string().required("Veuillez un code pays juste"),
  years: Yup.number()
    .min(4, "Veuillez entrer une année valide")
    .required("Veuillez entrer une année valide"),
});
// initialisation des methodes du context dans la page
const holidays = () => {
  const { state, nextHoliday, todayHoliday, initCountry } = useContext(
    HolidayContext
  );
  const [country, setCountry] = useState("FR");
  const refRBCountry = useRef();

  // initialisation des pays
  useEffect(() => {
    initCountry();
  }, []);

  return (
    <View>
      <Header
        placement="center"
        centerComponent={{
          text: "Vacances du monde",
          style: {
            color: "#000",
            fontSize: 23,
            fontWeight:"bold"
          },
        }}
        containerStyle={{
          backgroundColor: "#fff",
          height: 94,
          paddingLeft: 16,
          paddingRight: 16,
          alignSelf: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.3,
          shadowRadius: 9.11,
          elevation: 14,
        }}
      ></Header>
      {/* Utilisation de formik pour gérer les champs et les erreur du formulaire  */}
      <Formik
        initialValues={{
          countryCode: "FR",
          countryLabel:"France",
          years: "",
        }}
        validationSchema={HolidaySchema}
        onSubmit={async (values) => {
          nextHoliday(values.years, values.countryCode);
          todayHoliday(values.countryCode);
        }}
      >
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <TouchableOpacity onPress={() => refRBCountry.current.open()}>
            <Text style={{ fontSize: 25, padding: 10 }}>
              {values.countryLabel}
            </Text>

            <FontAwesome5
              name={"chevron-down"}
              style={{
                color: "#b2b2b2",
                fontSize: 16,
                position: "absolute",
                alignSelf: "flex-end",
                paddingRight: 20,
                paddingTop: 13,
              }}
            />
            <RBSheet
              ref={refRBCountry}
              animationType="fade"
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              customStyles={{
                wrapper: {
                  backgroundColor: "rgba(46, 49, 49, 0.3)",
                },
                draggableIcon: {
                  backgroundColor: "#000",
                },
                container: {
                  alignItems: "center",
                },
              }}
            >
              <ScrollView
                style={{ height: "100%", width: "100%" }}
                contentContainerStyle={{ alignItems: "center" }}
              >
                {state.country !== undefined &&
                  state.country !== null &&
                  state.country.map((item: any, index: any) => (
                    <TouchableOpacity
                    key={item.key}
                      onPress={() => {
                        setFieldValue("countryCode", item.key);
                        setFieldValue("countryLabel", item.value)
                        refRBCountry.current.close();
                      }}
                    >
                      <Text style={styles.bottomSheetText}>{item.value}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </RBSheet>
            <View>
              <TextInput
                label={"Années"}
                style={{ marginTop: 15, width: "100%" }}
                value={values.years}
                keyboardType={"numeric"}
                error={errors.years && touched.years ? true : false}
                onChangeText={handleChange("years")}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
            {errors.years && touched.years ? (
              <View style={styles.inputView}>
                <Text style={styles.textError}>{errors.years}</Text>
              </View>
            ) : null}
            {state.errorMessage ? (
              <View style={styles.inputView}>
                <Text style={styles.textError}>{state.errorMessage}</Text>
              </View>
            ) : null}

            <Button
              style={styles.button}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={styles.textButton}>Rechercher</Text>
            </Button>
          </TouchableOpacity>
        )}
      </Formik>

        {/* mise en place de la ternary pour conditioner si aujourd'hui c'est les vacances ou non  */}
        <Text
          style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
        >
          {state.holiday
            ? "C'est actuellement les vacances"
            : "Ce n'est pas les vances actuellement"}
        </Text>
        {/* utilisation de map pour affiché les donné de l'api */}
            <ScrollView
              style={{ height: "100%", width: "100%", borderRadius: 15 }}
              showsVerticalScrollIndicator={false}
            >
        <View style={{ height: "90%", width: "100%", borderRadius: 15 }}>
          {state.selectedHolidays !== undefined &&
            state.selectedHolidays !== null &&
            state.selectedHolidays.slice(3).map((item: any, index: any) => (
              <View key={item._id} style={styles.holidayView}>
                <TouchableOpacity>
                  <Card style={{ marginLeft: 10 }}>
                    <Card.Content>
                      <Title
                        style={{
                          fontSize: 21,
                        }}
                      >
                        {item.name}
                      </Title>
                      <Paragraph
                        style={{
                          fontSize: 20,
                          color: "rgba(242, 99, 54, 1)",
                        }}
                      >
                        <Text style={styles.textP}>Nom local: </Text>
                        {item.localName}
                      </Paragraph>
                      <Paragraph style={styles.textP}>
                        Date de debut : {item.date}
                      </Paragraph>
                      <Paragraph style={styles.textP}>
                        Depuis:{" "}
                        {item.launchYear ? item.launchYear : " Date N/C"}
                      </Paragraph>
                      <Paragraph
                        style={{
                          fontSize: 16,
                          marginTop: 3,
                          color: "grey",
                        }}
                      >
                        {item.global
                          ? "Vacances national"
                          : "Vacances regional ou jour férié"}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </View>
            ))}
        </View>
            </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },

  holidayView: {
    height: "10%",
  },
  socialImg: {
    height: 106,
    width: 106,
  },

  inputView: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textP: {
    fontSize: 20,
    marginTop: 3,
    color: "black",
  },
  bottomSheetText: {
    fontSize: 20,
    marginTop: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 325,
    backgroundColor: "lightgrey",
    height: 42,
    borderRadius: 22.5,
    marginTop: 15,
    marginLeft: 40,
  },
  textButton: {
    fontSize: 15,
    color: "white",
  },
  textError: {
    fontSize: 14,
    color: "red",
    textAlign: "left",
    padding: 10,
  },
});
export default holidays;
