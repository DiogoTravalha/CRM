import axios from "axios";

// const BASE_API = "https://simioni.herokuapp.com";

const BASE_API = "https://api.devteam.vps-kinghost.net";

//////////////////////////////////////////////////

export default {
  // checkToken: async (token) => {
  //   const response = await fetch(`${BASE_API}/login`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   const jsonData = await response.json();
  //   return jsonData;

  checkToken: async (token) => {
    const response = await axios
      .get(`${BASE_API}/login`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((doc) => {
        return doc;
      })
      .catch((err) => {
        return { erro: true };
      });

    return response;
  },

  checkSchedule: async () => {
    try {
      const response = await fetch("https://simioni.herokuapp.com/schedule", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      console.error(err.message);
    }
  },
  //   signIn: async (email, password) => {
  //     const user_email = email;
  //     const user_password = password;

  //     try {
  //       const res = await axios.post(`${BASE_API}/login`, {
  //         user_email,
  //         user_password,
  //       });
  //       return res;
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  //   signUp: async (name, email, password) => {
  //     const user_name = name;
  //     const user_email = email;
  //     const user_password = password;
  //     const response = await fetch(`${BASE_API}/login`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const jsonData = await response.json();
  //     const dados = jsonData.find((e) => e === user_email);

  //     if (dados === user_email) {
  //       return;
  //     }

  //     if (dados !== user_email) {
  //       try {
  //         const res = await fetch(`${BASE_API}/users/create`, {
  //           method: "POST",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ user_name, user_email, user_password }),
  //         });
  //         return res;
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   },

  //   getBarbers: async (location) => {
  //     const req = await fetch(`${BASE_API}/client`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const json = await req.json();

  //     if (location !== undefined && location !== "") {
  //       const filter = json.filter(
  //         (item) => item.client_city.toLowerCase() === location.toLowerCase()
  //       );
  //       return filter;
  //     } else {
  //       return json;
  //     }
  //   },

  //   getBarber: async (id) => {
  //     const req = await fetch(`${BASE_API}/client`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const json = await req.json();
  //     const filter = json.filter((item) => item.client_id === id);
  //     return filter;
  //   },

  //   getBarberService: async (id) => {
  //     const req = await fetch(`${BASE_API}/service`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const json = await req.json();
  //     const filter = json.filter((item) => item.service_owner === id);
  //     return filter;
  //   },

  //   getBarberTestimonial: async (id) => {
  //     const req = await fetch(`${BASE_API}/testimonials`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const json = await req.json();
  //     const filter = json.filter((item) => item.testimonials_owner === id);
  //     return filter;
  //   },

  //   logout: async () => {
  //     const result = localStorage.removeItem("token");
  //     return result;
  //   },
};
