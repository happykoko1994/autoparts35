import "../styles/store-info.css";

export default function StoreInfo() {
  const mapLink =
    "https://yandex.kz/maps/26081/kolpino/?ll=30.497481%2C59.747399&mode=routes&rtext=~59.747481%2C30.497476&rtt=taxi&ruri=~&z=16.86";
  return (
    <div className="store-info">
      <h1 className="store-info__title">
        Добро пожаловать в наш магазин автозапчастей
      </h1>

      <div className="store-info__section">
        <p className="store-info__text">
          Более 15 лет мы помогаем автолюбителям находить{" "}
          <b>качественные и надёжные запчасти</b>. У нас вы найдёте большой
          выбор деталей для <b>японских автомобилей</b>, а также для{" "}
          <b>европейских авто</b>.
        </p>
      </div>

      {/* Блок с эмблемами */}
      <div
        className="store-info__section store-info__car-logos"
        style={{ backgroundColor: "#f0f0f0" }}
      >
        <div className="store-info__logos-flexbox">
          <div className="store-info__logo">
            <img
              src="nissan.png"
              alt="Logo 1"
              className="store-info__logo-image"
            />
          </div>
          <div className="store-info__logo">
            <img src="vw.png" alt="Logo 2" className="store-info__logo-image" />
          </div>
          <div className="store-info__logo">
            <img
              src="skoda.png"
              alt="Logo 3"
              className="store-info__logo-image"
            />
          </div>
          <div className="store-info__logo">
            <img
              src="mitsubishi.png"
              alt="Logo 4"
              className="store-info__logo-image"
            />
          </div>
          <div className="store-info__logo">
            <img
              src="toyota.png"
              alt="Logo 5"
              className="store-info__logo-image"
            />
          </div>
          <div className="store-info__logo">
            <img
              src="suzuki.png"
              alt="Logo 6"
              className="store-info__logo-image"
            />
          </div>
        </div>
      </div>

      <div className="store-info__contact-map">
        <div className="store-info__contact-left">
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">График работы</h3>
            <p className="store-info__text">
              <span className="workdays">По будням</span>
              <span className="worktime">10:00 - 19:00</span>

              <span className="separator"></span>

              <span className="weekends">Выходные и праздники</span>
              <span className="worktime">10:00 - 18:00</span>
            </p>
          </div>
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">Контакты</h3>
            <p className="store-info__text">
              Для получения дополнительной информации звоните по телефонам:
              <br />
              <span className="store-info__bold">+7 (812) 244-28-73</span>
              <br />
              <span className="store-info__bold">+7 (953) 351-08-50</span>
            </p>

            <p className="store-info__text">
              Мы в социальных сетях:{" "}
              <a
                href="https://vk.com/club78660843"
                target="_blank"
                className="store-info__link"
              >
                ВКонтакте
              </a>
              .
            </p>
          </div>
          <div className="store-info__contact-item">
            <h3 className="store-info__subtitle">Наш адрес</h3>
            <p className="store-info__text">
              Санкт-Петербург, Московская Славянка, 17А, Торговый центр, этаж 2,
              павильон №35
            </p>
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Построить маршрут
          </a>
        </div>

        <div className="store-info__contact-right">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A4ef2b0b675a17372f1d6821672f4d92991af342d296b5bde8d36fb942fb2d254&source=constructor"
            width="100%"
            height="100%"
            frameBorder="0"
            title="map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
