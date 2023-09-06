import React from 'react';
import styles from './Home.module.css'; // Import CSS module

const Home = () => {
  return (
    <div className={styles['home-container']}>
      <h1>Welcome to the Home Page</h1>
      <p>This is a basic home page component.</p>
      <div className={styles['green-rectangle']}>
        <img
          src="https://www.freeiconspng.com/thumbs/hd-tickets/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
          alt="Ticket Master Logo"
        />
        <p>
          Добре дошли в нашия уебсайт за продажба на билети! Независимо дали сте
          страстен любител на концерти, фестивали или фотография, тук ще намерете
          по малко от всичко. Нашата мисия е да ви осигурим най-лесния начин за
          закупуване на билети за вашите любими събития, и то с най-добрите цени.
          С нашия интуитивен интерфейс можете бързо и лесно да намерите билетите,
          които търсите, както и информация за различни фестивали и любителска
          фотография. Ние предлагаме богат избор от концерти и мероприятия в
          цялата страна, за да можете да се насладите на най-доброто, което
          предлага културата и забавлението.
        </p>
      </div>
    </div>
  );
};

export default Home;
