import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-orange-background">
        <h2 className="about-us-title">About Us</h2>
      </div>
      <div className="about-us-white-background">
        <div className="about-us-content">
          <img
            src="https://www.freeiconspng.com/thumbs/hd-tickets/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
            alt="Ticket Icon"
            className="about-us-image"
          />
          <p className="about-us-text">
            
          TicketMaster е онлайн платформа, основана през 1996 г., която предоставя обширен каталог от концерти и фестивали от цял ​​свят. Сайтът предлага на потребителите възможността да закупят билети за техните любими събития, като предлага различни опции за места и ценови категории. TicketMaster осигурява лесен и бърз начин за намиране на предстоящи събития, като включва подробна информация за изпълнителите, местоположението и датата на провеждане. Потребителите могат да разглеждат снимки от минали събития, което им предоставя предварителен поглед върху атмосферата и изпълнителските изяви.<br></br>
<br></br>
Сайтът TicketMaster е популярен сред любителите на музиката и събитията, предоставяйки им удобна и сигурна платформа за онлайн пазаруване на билети. С постоянно обновяван каталог и различни партньорства с известни изпълнители, TicketMaster се утвърдил като водеща онлайн дестинация за закупуване на билети за разнообразни събития.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
