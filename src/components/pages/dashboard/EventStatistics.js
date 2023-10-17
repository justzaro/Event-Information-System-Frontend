import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventStatistics.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';

const EventStatistics = () => {
  const [eventsCount, setEventsCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [selectedEventsRange, setSelectedEventsRange] = useState('7 days');
  const [selectedBookedRange, setSelectedBookedRange] = useState('7 days');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuType, setMenuType] = useState('events'); // State to track the menu type

  const [orderData, setOrderData] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceNumberData, setAttendanceNumberData] = useState([]);

  const [attendanceMenuVisible, setAttendanceMenuVisible] = useState(false);
  const [attendanceNumberMenuVisible, setAttendanceNumberMenuVisible] = useState(false);
  const [eventsList, setEventsList] = useState([]);

  const [selectedConcert, setSelectedConcert] = useState(null);
  const [selectedConcertName, setSelectedConcertName] = useState('');

  const [selectedNumberConcert, setSelectedNumberConcert] = useState('');
  const [selectedNumberConcertName, setSelectedNumberConcertName] = useState('');

  const toggleAttendanceMenu = () => {
    setAttendanceMenuVisible(!attendanceMenuVisible);
  };

  const toggleAttendanceNumberMenu = () => {
    setAttendanceNumberMenuVisible(!attendanceNumberMenuVisible);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');

    const fetchData = async () => {
      try {
        // Fetch ticket data
        const ticketsResponse = await axios.get('http://localhost:8080/tickets/sold-per-day-in-last-thirty-days', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setTicketsData(ticketsResponse.data);

        // Fetch order data
        const orderResponse = await axios.get('http://localhost:8080/orders/prices/last-thirty', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        // The orders are expected to be returned in the most recent to the last order, so we need to reverse the order for display.
        const reversedOrderData = orderResponse.data.reverse();

        setOrderData(reversedOrderData);

        // Fetch the list of events
        const eventsResponse = await axios.get('http://localhost:8080/events', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setEventsList(eventsResponse.data);

        if (eventsResponse.data.length > 0) {
          setSelectedConcertName(eventsResponse.data[0].name);
          setSelectedNumberConcertName(eventsResponse.data[0].name);
          handleConcertSelect(eventsResponse.data[0]);
          handleSecondChartConcertSelect(eventsResponse.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSecondChartConcertSelect = (concert) => {
    // Update the selected concert and fetch data for the second chart
    setSelectedNumberConcertName(concert.name);
    setSelectedNumberConcert(concert);
    setAttendanceNumberMenuVisible(false);

    // Make a new request with the selected concert ID for the second chart
    const jwtToken = localStorage.getItem('jwtToken');
    axios
      .get(`http://localhost:8080/events/${concert.id}/attendance`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        // Update attendanceData for the second chart
        setAttendanceNumberData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendance data for the second chart: ', error);
      });
  };  

  const handleConcertSelect = (concert) => {
    setSelectedConcertName(concert.name);
    setSelectedConcert(concert);
    setAttendanceMenuVisible(false);

    // Make a new request with the selected concert ID
    const jwtToken = localStorage.getItem('jwtToken');
    axios.get(`http://localhost:8080/events/${concert.id}/attendance`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => {
        setAttendanceData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendance data: ', error);
      });
  };

  // useEffect(() => {
  //   const jwtToken = localStorage.getItem('jwtToken');

  //   const fetchData = async () => {
  //     try {
  //       const orderResponse = await axios.get('http://localhost:8080/events/2/attendance', {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`,
  //         },
  //       });

  //       setAttendanceData(orderResponse.data);
  //     } catch (error) {
  //       console.error('Error fetching order data: ', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const chartData = orderData.map((order, index) => ({
    day: `${orderData.length - index}`, // Display order number
    price: order, // Assuming the order value represents the price
  }));

  const ticketsChartData = ticketsData.map((order, index) => ({
    day: `${ticketsData.length - index}`, // Display order number
    count: order, // Assuming the order value represents the price
  }));

  const bookedData = [
    { name: 'Booked', value: attendanceData },
    { name: 'Available', value: selectedConcert ? selectedConcert.capacity - attendanceData : 0 }
  ];

  const bookedNumbersData = [
    { name: 'Booked', value: attendanceNumberData },
    { name: 'Available', value: selectedNumberConcert ? selectedNumberConcert.capacity - attendanceNumberData : 0 }
  ];

  const colors = ['#FE6F57', '#119c36'];

  useEffect(() => {
    // Replace 'your_jwt_token' with the actual JWT token
    const jwtToken = localStorage.getItem('jwtToken');

    // Fetch data for the four statistics circles
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get('http://localhost:8080/events/upcoming?type=1', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const bookedResponse = await axios.get('http://localhost:8080/events/booked?type=1', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const activeResponse = await axios.get('http://localhost:8080/events/active', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const inactiveResponse = await axios.get('http://localhost:8080/events/inactive', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setEventsCount(eventsResponse.data);
        setBookedCount(bookedResponse.data);
        setActiveCount(activeResponse.data);
        setInactiveCount(inactiveResponse.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = (type) => {
    setMenuType(type);
    setMenuVisible(!menuVisible);
  };

  const handleMenuClick = (value) => {
    // Determine the type based on the selected value
    let type;
    switch (value) {
      case '7 days':
        type = 1;
        break;
      case '30 days':
        type = 2;
        break;
      case '90 days':
        type = 3;
        break;
      case '180 days':
        type = 4;
        break;
      case '360 days':
        type = 5;
        break;
      default:
        type = 1; // Default to 7 days
    }

    if (menuType === 'events') {
      setSelectedEventsRange(value);
    } else {
      setSelectedBookedRange(value);
    }

    // Make the GET request based on menu type (events or booked)
    const endpoint =
      menuType === 'events'
        ? `http://localhost:8080/events/upcoming?type=${type}`
        : `http://localhost:8080/events/booked?type=${type}`;

    // Replace 'your_jwt_token' with the actual JWT token
    const jwtToken = localStorage.getItem('jwtToken');

    // Fetch data based on the selected type
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        // Update the count based on the response
        if (menuType === 'events') {
          setEventsCount(response.data);
        } else {
          setBookedCount(response.data);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();

    // Close the menu after selection
    setMenuVisible(false);
  };

  return (
    <div>
      <div className="event-statistics-container">
        <div className="event-statistics-item">
          <div className="event-statistics-circle">
            <div className="event-statistics-number">{eventsCount}</div>
          </div>
          <div className="event-statistics-text">
            events
          </div>
          {menuVisible && menuType === 'events' && (
            <div className="event-statistics-menu">
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('7 days')}>
                7 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('30 days')}>
                30 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('90 days')}>
                90 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('180 days')}>
                180 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('360 days')}>
                360 days
              </div>
            </div>
          )}
          <div className="event-statistics-subtext" onClick={() => toggleMenu('events')}>
            in the next {selectedEventsRange} <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>
        <div className="event-statistics-item">
          <div className="event-statistics-circle">
            <div className="event-statistics-number">{bookedCount}</div>
          </div>
          <div className="event-statistics-text">
            booked
          </div>
          {menuVisible && menuType === 'booked' && (
            <div className="event-statistics-menu">
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('7 days')}>
                7 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('30 days')}>
                30 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('90 days')}>
                90 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('180 days')}>
                180 days
              </div>
              <div className="event-statistics-menu-item" onClick={() => handleMenuClick('360 days')}>
                360 days
              </div>
            </div>
          )}
          <div className="event-statistics-subtext" onClick={() => toggleMenu('booked')}>
            in the last {selectedBookedRange} <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>
        <div className="event-statistics-item">
          <div className="event-statistics-circle">
            <div className="event-statistics-number">{activeCount}</div>
          </div>
          <div className="event-statistics-text">active</div>
          <div className="event-statistics-subtext">
            <br></br>
          </div>
        </div>
        <div className="event-statistics-item">
          <div className="event-statistics-circle">
            <div className="event-statistics-number">{inactiveCount}</div>
          </div>
          <div className="event-statistics-text">inactive</div>
          <div className="event-statistics-subtext">
            <br></br>
          </div>
        </div>
      </div>

      <h1 
        className="event-statistics-heading"
      >
        Prices of Last 30 Orders:
      </h1>
      {/* <div className="event-statistics-filter-icon-container">
          <FontAwesomeIcon
            icon={faArrowDownShortWide}
            className="event-statistics-filter-icon"
            onClick={toggleAttendanceMenu}
          />
      </div> */}
      <div>
        <LineChart width={1500} height={400} data={chartData}>
          <XAxis dataKey="day">
            <Label
              value="Day"
              offset={0} position="insideBottom"
              style={{ textAnchor: 'middle', fontSize: '18px', fill: '#333', fontFamily: 'Tahoma' }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Price"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fontSize: '20px', fill: '#333', fontFamily: 'Tahoma' }} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ fontSize: '20px' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#FE6F57"
            strokeWidth={2} // Adjust this value to make the line thicker
            activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      <h1 
        className="event-statistics-heading"
      >
        Tickets Sold Every Day for the Last 30 Days:
      </h1>

      <div>
        <LineChart width={1500} height={400} data={ticketsChartData}>
          <XAxis dataKey="day">
            <Label
              value="Day"
              offset={0} position="insideBottom"
              style={{ textAnchor: 'middle', fontSize: '18px', fill: '#333', fontFamily: 'Tahoma' }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Ticket Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fontSize: '20px', fill: '#333', fontFamily: 'Tahoma' }} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ fontSize: '20px' }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#FE6F57"
            strokeWidth={2} // Adjust this value to make the line thicker
            activeDot={{ r: 8 }} />
        </LineChart>
      </div>

      <h1 
        className="event-statistics-heading"
      >
        Event Booking Statistics in Sold Tickets as Percentage and Numbers:
      </h1>

      <div className="event-statistics-pie-chart">
        <div className="event-statistics-filter-icon-container">
          <FontAwesomeIcon
            icon={faArrowDownShortWide}
            className="event-statistics-filter-icon"
            onClick={toggleAttendanceMenu}
          />
          <div className="selected-concert-name">{selectedConcertName}</div>
          {attendanceMenuVisible && (
            <div className="event-statistics-attendance-menu">
              {eventsList.map((concert) => (
                <div
                  className="event-statistics-attendance-menu-item"
                  key={concert.id}
                  onClick={() => handleConcertSelect(concert)}
                >
                  {concert.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <PieChart width={700} height={440}>
            <Pie
              dataKey="value"
              data={bookedData}
              labelLine={false}
              label={(entry) => {
                const yPosition = entry.y - (entry.name === 'Available' ? -30 : 10); // Adjust the margin for the 'Available' label

                return (
                  <text x={entry.x} y={yPosition} fill={colors[entry.index]} textAnchor="middle">
                    {`${(entry.percent * 100).toFixed(2)}%`}
                    
                  </text>
                );
              }}
            >
              {bookedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: '80px' }}
              contentStyle={{ fontSize: '28px' }}
            />
          </PieChart>
        </div>

        <div className="right-pie-chart">
          <div className="event-statistics-filter-icon-container">
            <FontAwesomeIcon
              icon={faArrowDownShortWide}
              className="event-statistics-filter-icon"
              onClick={toggleAttendanceNumberMenu}
            />
            <div className="selected-concert-name">{selectedNumberConcertName}</div>
            {attendanceNumberMenuVisible && (
              <div className="event-statistics-attendance-menu">
                {eventsList.map((concert) => (
                  <div
                    className="event-statistics-attendance-menu-item"
                    key={concert.id}
                    onClick={() => handleSecondChartConcertSelect(concert)}
                  >
                    {concert.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <PieChart width={700} height={440}>
              <Pie
                dataKey="value"
                data={bookedNumbersData}
                labelLine={false}
                label={(entry) => {
                  const yPosition = entry.y - (entry.name === 'Available' ? -10 : -5); // Adjust the margin for the 'Available' label

                  return (
                    <text x={entry.x} y={yPosition} fill={colors[entry.index]} textAnchor="middle">
                      {entry.value}
                    </text>
                  );
                }}
              >
                {bookedNumbersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ right: '80px' }}
                contentStyle={{ fontSize: '28px' }}
              />
            </PieChart>
          </div>  
        </div>
        <br />
      </div>
    </div>
  );
};

export default EventStatistics;
