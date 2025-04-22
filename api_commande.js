import axios from "axios";

const API_URL = "https://pfebackend-production.up.railway.app/api";
const updateCommandeState = async (id_commande, newState) => {
  try {
    const url = `${API_URL}/commandes/cuisinier/${id_commande}`;
    const body = { newState };
    const response = await axios.patch(url, body);
    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        console.error("Erreur : État non valide.");
      } else {
        console.error("Erreur serveur :", error.response.data.message);
      }
    }
    throw error;
  }
};

export default updateCommandeState;