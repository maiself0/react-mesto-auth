import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as auth from "./auth";

export default function Register() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState();
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, email } = userData;

    auth.register(password, email).then((res) => {
      if (res) {
        setMessage("!");
        history.push("/sign-in");
      } else {
        setMessage("Что-то пошло не так!");
      }
    });
  };

  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__top-container">
          <h2 className="register__header">Регистрация</h2>
          <p>{message}</p>
          <input
            className="register__input"
            id="email"
            required
            name="email"
            type="text"
            value={userData.email}
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="register__input"
            id="password"
            required
            name="password"
            type="password"
            value={userData.password}
            placeholder="Пароль"
            onChange={handleChange}
          />
        </div>
        <div className="register__bottom-container">
          <button type="submit" className="register__button">
            Зарегистрироваться
          </button>
          <p>
            Уже зарегистрированы? <Link to="sign-in">Войти</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
