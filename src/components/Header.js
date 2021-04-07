import logo from "../images/logo.svg";
import { useLocation, Link, useHistory } from "react-router-dom";

function Header() {
  const location = useLocation();
  const history = useHistory();

  function signOut() {
    
    history.push('/sign-in')
  }

  function headerStatus() {
    if (location.pathname === "/") {
      return (
        <div className="header__status-container">
          <div className="header__status header__status_signed">email</div>
          <div className="header__status header__status_signed" onClick={signOut}>Выйти</div>
        </div>
      );
    }
    if (location.pathname === "/sign-up") {
      return <div className="header__status header__sign-up"><Link to="sign-in">Войти</Link></div>;
    }
    if (location.pathname === "/sign-in") {
      return <div className="header__status header__sign-in"><Link to="sign-up">Регистрация</Link></div>;
    }
  }

  headerStatus();
  return (
    <header className="header">
      <img src={logo} alt="лого сайта" className="header__logo" />
      {headerStatus()}
    </header>
  );
}

export default Header;
