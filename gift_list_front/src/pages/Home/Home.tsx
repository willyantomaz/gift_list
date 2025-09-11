import { useEffect } from "react";
import "./Home.css";
import api from "../../services/api";
import type { Gift } from "../../entity/gift";

function Home() {
  let listGifts: Gift[] = [];

  async function getGifts() {
    listGifts = await api.get("/gifts");
  }

  useEffect(() => {
    getGifts();
  }, []);

  const listItems = listGifts.map((gift) => (
    <li key={gift.id}>
      <p>
        <b>{gift.gift_name}:</b>
        {" " + gift.gift_giver + " "}
        categoria {gift.category}
      </p>
    </li>
  ));
  return (
    <>
      <div className="container">
        <h1>Lista de Presentes</h1>
        <h3>Selecione o presente que deseja nos presentear</h3>
      </div>
      <article>
        <h1>Scientists</h1>
        <ul>{listItems}</ul>
      </article>
    </>
  );
}

export default Home;
