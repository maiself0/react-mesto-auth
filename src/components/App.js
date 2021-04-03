import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import { useEffect, useState } from "react";
import ImagePopup from "./ImagePopup";
import api from "../utils/api.js";
import { CurrentUserContext } from "./../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup.js";
import {gsap} from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null??false);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    api
      .getUserInfoAndInitialCards()
      .then(([userInfo, cards]) => {
        setCurrentUser(userInfo);
        setCards(cards);
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.batch(".element", {
          interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
          batchMax: 3,   // maximum batch size (targets)
          onEnter: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
          onLeave: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true}),
          onEnterBack: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
          onLeaveBack: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true})
          // you can also define things like start, end, etc.
        });


        
      })
      .catch((err) => console.log(err));
  }, []);

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
  }

  //поставить лайк карточке
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  //удалениe карточки
  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(link) {
    api
      .setUserAvatar(link)
      .then(
        setCurrentUser({
          name: currentUser.name,
          about: currentUser.about,
          avatar: link.avatar,
        })
      )
      .then(closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(place) {
    api
      .addCard(place)
      .then((newCard) => setCards([newCard, ...cards]))
      .then(closeAllPopups())
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Main
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          onEditProfile={handleEditProfileClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
