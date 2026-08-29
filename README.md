# Live Map Insights 🌍

A lightweight, responsive geospatial visualization frontend for exploring location-based events across Lebanon through an interactive map.

## 🚀 Overview

**Live Map Insights** is a frontend-focused web application designed to transform structured location-based data into an interactive geographic experience.

The current version provides a lightweight map interface for exploring reported events across Lebanese villages and cities, with location-based statistics, search, detailed information, and community testimonies.

The frontend is designed to communicate with an external REST API while remaining independent from the backend implementation.

## 🧠 Key Features

* 🗺️ **Interactive Map**

  * Leaflet-based map visualization
  * Interactive markers for reported locations
  * Geographic navigation across Lebanon
  * Custom marker sizes and colors based on event counts

* 📍 **Location Explorer**

  * Searchable list of documented villages and cities
  * Locations sorted by number of reported events
  * Click a location to focus the map on it

* 📊 **Live Statistics**

  * Total documented locations
  * Total reported events
  * Automatically refreshed data

* 📰 **Location Details**

  * Arabic location names
  * Number of reported events
  * Latest associated report
  * Location-specific information panel

* 💬 **Community Testimonies**

  * View testimonies associated with a location
  * Submit a new testimony
  * Dynamic testimony loading

* 🔄 **Automatic Updates**

  * Periodically retrieves updated data from the API
  * Updates the map and location list without requiring a manual page refresh

* 📱 **Responsive Design**

  * Desktop map and sidebar layout
  * Mobile-friendly navigation
  * Slide-out location panel on smaller screens
  * Touch-friendly map controls

* ⚡ **Lightweight Frontend**

  * Vanilla JavaScript for application logic
  * No large frontend framework required for the map interface
  * Separated HTML, CSS, and JavaScript
  * Designed for fast static deployment

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Leaflet.js
* OpenStreetMap
* Google Fonts

### API Integration

* REST API
* JSON
* Fetch API

### Deployment

* Cloudflare
* Static frontend deployment

## 🏗️ Frontend Architecture

The application follows a simple client-side architecture:

```text
                    ┌─────────────────────┐
                    │      map.html       │
                    │     UI Structure    │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
        ┌────────▼────────┐        ┌─────────▼────────┐
        │    style.css    │        │      app.js      │
        │   UI / Layout   │        │ Application Logic│
        └─────────────────┘        └─────────┬────────┘
                                             │
                                             │ REST / JSON
                                             ▼
                                  ┌─────────────────────┐
                                  │     External API    │
                                  └─────────────────────┘
```

### UI Layer

`map.html` contains the structure of the application:

* Header
* Statistics
* Sidebar
* Search
* Map container
* Map legend
* Location details
* Testimony interface

### Styling Layer

`style.css` handles:

* Layout
* Responsive behavior
* Arabic typography
* Colors and visual hierarchy
* Map controls
* Sidebar animations
* Detail panels
* Mobile interface

### Application Layer

`app.js` handles:

* Leaflet initialization
* API requests
* Location markers
* Marker clustering logic
* Search
* Statistics
* Location selection
* Testimony loading
* Testimony submission
* Automatic data refresh
* Responsive sidebar behavior

## 📂 Project Structure

```text
Live-Map-Insights/
│
├── map.html
├── style.css
├── app.js
└── README.md
```

The frontend is intentionally kept flat and lightweight, with no required `css/` or `js/` subdirectories.

## 🗺️ Map Visualization

The map uses **Leaflet.js** together with **OpenStreetMap** tiles.

Each documented location is represented by a custom marker.

Marker size and color change according to the number of reported events:

| Events | Visualization               |
| ------ | --------------------------- |
| 1–2    | 🟡 Small yellow marker      |
| 3–9    | 🟠 Orange marker            |
| 10–19  | 🟠 Larger orange-red marker |
| 20–49  | 🔴 Red marker               |
| 50+    | 🔴 Large dark-red marker    |

This provides a quick visual way to identify locations with higher reported activity.

## 🔎 Location Search

The sidebar includes a search interface that allows users to search using:

* Arabic village/city names
* English village/city names

Selecting a result opens the location details and centers the map on the corresponding coordinates.

## 💬 Testimonies

The frontend includes a location-specific testimony interface.

Users can:

1. Select a location.
2. View existing testimonies.
3. Enter a new testimony.
4. Submit it through the REST API.
5. See the updated testimony list.

The frontend performs basic client-side validation before submitting the request.

## 🔄 Data Refresh

The application periodically retrieves updated location data from the configured API.

```text
Frontend
   │
   │ GET /attacks
   ▼
REST API
   │
   ▼
Updated location data
   │
   ▼
Map + Sidebar
```

The current implementation refreshes the map data automatically without requiring the user to reload the page.

## 🔌 API Configuration

The frontend communicates with an external API through a configurable base URL in `app.js`.

Example:

```javascript
const API_BASE = "https://api.shahedlebanon.com";
```

The frontend expects API responses in JSON format.

The API is responsible for providing the data; this repository contains only the frontend visualization layer.

## ☁️ Deployment

The frontend is designed for static deployment and can be deployed through **Cloudflare**.

The application consists of static frontend assets:

```text
map.html
style.css
app.js
```

The API remains separate from the frontend deployment.

This separation allows the frontend to be deployed independently from the backend and data-processing systems.

## 🎯 Purpose

The project explores how geographic information can be presented through a lightweight, interactive frontend.

It demonstrates concepts including:

* Geospatial visualization
* Interactive mapping
* REST API integration
* Dynamic UI updates
* Responsive frontend design
* Arabic-language interfaces
* Location-based data exploration
* Static web deployment

The project can serve as a frontend foundation for applications involving civic monitoring, infrastructure tracking, event mapping, and other location-based data systems.

Future improvements may include:

* [ ] Historical data filtering
* [ ] Date-based map views
* [ ] Advanced geographic filtering
* [ ] Improved marker performance for large datasets
* [ ] More detailed analytics
* [ ] Additional map visualization modes
* [ ] Accessibility improvements
* [ ] Multi-language support

## 👤 Author

Built by **Mariam Sleiman**, a Computer Science graduate interested in backend systems, data-driven applications, cybersecurity, and AI-powered infrastructure tools.

---
