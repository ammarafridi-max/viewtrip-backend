const { parse, format } = require('date-fns');

function itineraryTemplate(form) {
  const {
    type,
    from,
    to,
    departureDate,
    returnDate,
    passengers,
    flightDetails: { departureFlight, returnFlight },
    pnr,
  } = form;

  let departureDateText = parse(departureDate, 'yyyy-MM-dd', new Date());
  departureDateText = format(departureDateText, 'dd MMMM yyyy').toUpperCase();

  let returnDateText =
    returnDate && parse(returnDate, 'yyyy-MM-dd', new Date());
  returnDateText =
    returnDate && format(returnDateText, 'dd MMMM yyyy').toUpperCase();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>

          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Nunito', Arial, sans-serif;
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: #fff;
            color: #222;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .viewtrip-logo {
            height: 75px;
            width: 100%;
            background-color: #1e60a6;
            padding: 20px 40px;
            display: flex;
            align-items: center;
          }

          .viewtrip-logo img {
            height: 100%;
            object-fit: contain;
          }

          .viewtrip-logo span {
            border-left: 2px solid white;
            padding-left: 20px;
            margin-left: 20px;
            color: white;
            font-weight: 700;
          }

          .container {
            width: 100%;
            height: 100%;
            padding: 40px;
          }

          .trip-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            background: #eaeaea;
            padding: 10px 0 10px 8px;
            border-bottom: 2px solid #222;
          }

          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px;
          }

          .header-col {
            width: 75%;
            font-size: 12px;
          }

          .header-col-2 {
            width: fit-content;
            font-size: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .qr-code {
            width: 100px;
            object-fit: contain;
          }

          .header-label {
            color: #555;
            font-size: 12px;
            margin-top: 10px;
          }

          .header-value {
            font-weight: 700;
            font-size: 18px;
          }

          .codes-row {
            font-size: 12px;
            margin: 10px 0 8px 0;
          }

          .codes-row span {
            font-weight: 700;
          }

          .section-divider {
            border-bottom: 1px solid #888;
            margin: 12px 0 18px 0;
          }
            
          .segment {
            margin-bottom: 18px;
            border: 1px solid #bbb;
            border-radius: 4px;
            overflow: hidden;
          }

          .segment-header {
            background: #eaeaea;
            font-size: 13px;
            font-weight: 500;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #bbb;
          }

          .segment-header .plane {
            font-size: 18px;
            margin-right: 8px;
            color: #222;
          }

          .segment-header strong {
            margin-left: 5px;
          }

          .segment-header small {
            font-weight: 400;
            color: #666;
            margin-left: 8px;
          }

          .segment-body {
            display: flex;
            flex-wrap: wrap;
            font-size: 12px;
            padding: 12px;
            background: #fff;
          }

          .flight-main {
            flex: 1 1 100px;
            width: 100px;
            margin-right: 16px;
          }

          .flight-main .meta {
            color: #555;
            font-size: 11px;
            margin-bottom: 2px;
          }

          .flight-main .status {
            color: #2a7a2a;
            font-weight: 700;
            font-size: 11px;
          }

          .flight-route {
            flex: 2 1 220px;
            min-width: 200px;
            margin-right: 16px;
            border-left: 1px dashed #bbb;
            padding-left: 16px;
          }

          .airline {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .airline-name {
            font-weight: 700;
            font-size: 13px;
            margin-bottom: 2px;
          }

          .airline-logo {
            width: 50px;
            height: 50px;
            object-fit: contain;
          }

          .route-row {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .route-airport {
            display: block;
            font-weight: 700;
            font-size: 16px;
          }

          .route-arrow {
            margin: 0 8px;
            font-size: 16px;
          }

          .route-meta {
            font-size: 11px;
            color: #555;
          }

          .route-meta strong {
            color: #222;
          }

          .flight-side {
            flex: 1 1 120px;
            min-width: 120px;
            border-left: 1px dashed #bbb;
            padding-left: 16px;
            font-size: 11px;
            color: #555;
          }

          .flight-side .side-label {
            font-weight: 700;
            color: #222;
          }

          .segment-footer {
            background: #f7f7f7;
            font-size: 11px;
            padding: 8px 12px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .segment-footer .passenger {
            font-weight: 700;
          }

          .segment-footer .seats {
            color: #555;
          }

          .segment-footer .contact {
            font-size: 11px;
            color: #222;
            margin-left: 12px;
          }

        </style>
      </head>
      <body>

        <div class='viewtrip-logo'>
          <img src='${process.env.BACKEND_URL}/uploads/view-trip-logo-dark.png' />
          <span>Global Reservation System</span>
        </div>

        <div class='container'>

          <div class="trip-title">
            ${departureDateText} ${type === 'Return' ? `&#9654; ${returnDateText}` : ''}  TRIP TO ${to}
          </div>
        
          <div class="header-row">
            <div class="header-col-1">
              <div class="header-label">PREPARED FOR</div>
              ${passengers.map((passenger) => `<div class="header-value">${passenger.lastName.toUpperCase()}/${passenger.firstName.toUpperCase()} ${passenger.title.toUpperCase()}</div>`)}
              <div class="header-label">RESERVATION CODE/PNR</div>
              <div class='header-value'>${pnr}</div>
            </div>
            <div class="header-col-2">
              <img src="${process.env.BACKEND_URL}/qr-codes/${pnr}-qr.png" alt="QR-Code" class="qr-code" />
              <span>viewtrip.info/${pnr}</span>
            </div>
          </div>

          <div class="section-divider"></div>

          ${departureFlight?.segments
            ?.map(
              (seg) =>
                `<div class="segment">
                <div class="segment-header">
                  <span class="plane">&#9992;</span>
                  DEPARTURE: <strong>${format(parse(seg.departure.date, 'yyyy-MM-dd', new Date()), 'iiii dd MMMM yyyy').toUpperCase()}</strong>
                </div>
                <div class="segment-body">
                  <div class="flight-main">
                    <div class="airline">
                      <img src="${seg.airline.logo}" class="airline-logo" alt="${seg.airline.name}" />
                      <div>
                        <p class="airline-name">${seg.airline.name}</p>
                        <p class="flight">
                          ${seg.carrierCode} ${seg.flightNumber}
                        </p>
                      </div>
                    </div>
                    <div class="meta">Duration: ${seg.duration}</div>
                    <div class="meta">Cabin: Economy / Y</div>
                    <div class="status">Status: Confirmed</div>
                  </div>
                  <div class="flight-route">
                    <div class="route-row">
                      <div class="route-departure">
                        <span class="route-airport">${seg.departure.iataCode}</span>
                      </div>
                      <span class="route-arrow">&#9654;</span>
                      <div class="route-arrival">
                        <span class="route-airport">${seg.arrival.iataCode}</span>
                      </div>
                    </div>
                    <div class="route-row">
                      <span class="route-meta">
                        <strong>Departure Date:</strong> ${format(parse(seg.departure.date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}
                      </span>
                      <span class="route-meta">
                        <strong>Time:</strong> ${seg.departure.time}
                      </span>
                    </div>
                    <div class="route-row">
                      <span class="route-meta">
                        <strong>Arrival Date:</strong> ${format(parse(seg.arrival.date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}
                      </span>
                      <span class="route-meta">
                        <strong>Time:</strong> ${seg.arrival.time}
                      </span>
                    </div>
                  </div>
                  <div class="flight-side">
                    <div>
                      <span class="side-label">Aircraft Code:</span> ${seg.aircraftCode}
                    </div>
                    <div>
                      <span class="side-label">Meals:</span> Not Included
                    </div>
                  </div>
                </div>
                <div class="segment-footer">
                  <div>
                    <span class="passenger">Lead Passenger Name:</span> »
                    ${passengers[0].title.toUpperCase()} ${passengers[0].firstName.toUpperCase()} ${passengers[0].lastName.toUpperCase()}
                  </div>
                  <span class="seats">Seats: Check-In Required</span>
                </div>
              </div>`
            )
            .join('')}

          ${
            type === 'Return'
              ? returnFlight?.segments?.map(
                  (seg) =>
                    `<div class="segment">
              <div class="segment-header">
                <span class="plane">&#9992;</span>
                DEPARTURE: <strong>${format(parse(seg.departure.date, 'yyyy-MM-dd', new Date()), 'iiii dd MMMM yyyy').toUpperCase()}</strong>
              </div>
              <div class="segment-body">
                <div class="flight-main">
                  <div class="airline">
                    <img src="${seg.airline.logo}" class="airline-logo" alt="${seg.airline.name}" />
                    <div>
                      <p class="airline-name">${seg.airline.name}</p>
                      <p class="flight">
                        ${seg.carrierCode} ${seg.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div class="meta">Duration: ${seg.duration}</div>
                  <div class="meta">Cabin: Economy / Y</div>
                  <div class="status">Status: Confirmed</div>
                </div>
                <div class="flight-route">
                  <div class="route-row">
                    <div class="route-departure">
                      <span class="route-airport">${seg.departure.iataCode}</span>
                    </div>
                    <span class="route-arrow">&#9654;</span>
                    <div class="route-arrival">
                      <span class="route-airport">${seg.arrival.iataCode}</span>
                    </div>
                  </div>
                  <div class="route-row">
                    <span class="route-meta">
                      <strong>Departure Date:</strong> ${format(parse(seg.departure.date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}
                    </span>
                    <span class="route-meta">
                      <strong>Time:</strong> ${seg.departure.time}
                    </span>
                  </div>
                  <div class="route-row">
                    <span class="route-meta">
                      <strong>Arrival Date:</strong> ${format(parse(seg.arrival.date, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}
                    </span>
                    <span class="route-meta">
                      <strong>Time:</strong> ${seg.arrival.time}
                    </span>
                  </div>
                </div>
                <div class="flight-side">
                  <div>
                    <span class="side-label">Aircraft Code:</span> ${seg.aircraftCode}
                  </div>
                  <div>
                    <span class="side-label">Distance (in Kilometers):</span>
                  </div>
                  <div>
                    <span class="side-label">Meals:</span> Not Included
                  </div>
                </div>
              </div>
              <div class="segment-footer">
                <div>
                  <span class="passenger">Lead Passenger Name:</span> »
                  ${passengers[0].title.toUpperCase()} ${passengers[0].firstName.toUpperCase()} ${passengers[0].lastName.toUpperCase()}
                </div>
                <span class="seats">Seats: Check-In Required</span>
              </div>
            </div>`
                )
              : ''
          }        

        </div>
      </body>
    </html>
  `;
}

module.exports = itineraryTemplate;
