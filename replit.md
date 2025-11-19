# SpotNow - Smart Parking Management System

## Overview
SpotNow is a comprehensive parking management application designed to connect drivers with available parking spots in urban environments. It enables users to find, book, and pay for parking, while providing multi-role administrative tools for operators, supervisors, and ticket point staff. The system offers real-time availability, AI-powered recommendations, subscription management, and integrated payment processing. Its primary purpose is to enhance urban mobility, optimize parking utilization, and generate revenue for municipalities through an intuitive, map-based interface. The project aims to become a leading solution in smart city infrastructure, offering a scalable and user-friendly platform for efficient parking management.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (November 7, 2025)
- **Violations Map Fullscreen Rendering & Satellite Toggle**: Resolved slow/incomplete map rendering when entering fullscreen and added satellite/roadmap toggle button. **Fullscreen Issue**: Map rendered slowly and incompletely when entering fullscreen due to insufficient invalidateSize() timeouts (100ms → 200/400/600ms) and single invalidation call. **Solution**: (1) Increased timeout delays to 200/400/600ms for enterFullscreen and 200/400ms for exitFullscreen, (2) Added multiple sequential invalidateSize() calls to ensure complete tile rendering across all screen sizes, (3) Saved tile layer reference for dynamic switching. **Satellite Toggle Feature**: Added dedicated toggle button between roadmap (OpenStreetMap) and satellite (Esri World Imagery) views. Implemented `mapType` state, `handleToggleMapType` callback with layer removal/addition logic, and Font Awesome icon toggle (fa-satellite ↔ fa-map). Button positioned in top-right control stack (fullscreen → satellite toggle → recenter) with consistent styling and Italian tooltips. **Files Modified**: OperatorMonitorView.tsx (map initialization lines 247-276, toggle function lines 368-393, UI button lines 659-665). Violations map now renders fully in fullscreen and supports both roadmap and satellite views.
- **Permission Category Enum Extension**: Safely extended PostgreSQL `permission_category` enum to support all permission types. **Problem**: Database enum had only 3 values (resident, disabled, commercial) while frontend required 10 values, causing save failures for categories like 'road_works'. **Solution**: Used safe SQL migration with `ALTER TYPE permission_category ADD VALUE IF NOT EXISTS` for each missing value (road_works, police, magistrates, church, events, authorities, other), avoiding destructive `db:push --force`. **Files Modified**: shared/schema.js (enum definition), executed SQL migrations via execute_sql_tool. All permission categories now save successfully without data loss.
- **StallDetailsModal Fix + Municipality Selector Enhancement**: Resolved critical stall details modal crash and replaced broken municipality selector in subscription plan creation. **StallDetailsModal Issue** (reported 5 times by user): Modal failed to open when clicking stalls in "Editor Layout Stalli" due to PostgreSQL returning lat/lng as strings, causing `.toFixed()` to crash. **Solution**: Added defensive Number() conversion at component level (`const lat = Number(stall.lat)`), comprehensive NaN validation with user-friendly fallback UI ("Coordinate non valide"), and early return in address loading for invalid coordinates. Modal now renders reliably for all stalls regardless of coordinate source. **Municipality Selector Replacement**: Replaced disabled `ItalianMunicipalityMultiSelect` component in subscription plan creation ("Crea Nuovo Piano") with functional cascading selector identical to zone creation. Implemented 3-tier Region → Province → Municipality multi-select with checkbox UI, async state management, and helpful user hints. Users can now select multiple municipalities per subscription plan using the same intuitive interface as zone creation. **Files Modified**: ZoneManagementView.tsx (StallDetailsModal lines 38-91, coordinate validation and UI fallback), SubscriptionsView.tsx (PlanModal lines 33-203, cascading municipality selector).

## Recent Changes (November 7, 2025) - Previous
- **Complete Z-Index & Map UI Overhaul**: Resolved widespread map interaction issues across all views (violations map, zone creation, stall editor, user/admin/supervisor dashboards) by implementing comprehensive z-index hierarchy and pointer-events management. **Root Problem**: Leaflet renders tile/overlay panes at z-400-650, but map controls used z-10 to z-30, causing buttons to be hidden behind map layers. Additionally, dashboard parent containers had z-0, allowing z-[9999] modals to permanently occlude maps. **Solution**: (1) **Z-Index Hierarchy**: Established consistent stacking - Modals at z-[9999], loading overlays at z-[1100-1200], all map controls at z-[1000], Leaflet panes at z-400-650, map containers at z-10, (2) **Pointer-Events Pattern**: Container divs use `pointer-events: none`, interactive buttons use `pointer-events: auto`, allowing clicks to reach map while keeping controls clickable, (3) **Stall Click Handler**: Added single `click` event (in addition to dblclick) to stall polygons, opening StallDetailsModal reliably on tap/click, (4) **Dashboard White Maps Fix**: Increased ParkingDashboard parent container from z-0 to z-10, raised all controls to z-[1000+], ensuring map visibility and preventing modal occlusion. **Files Modified**: OperatorMonitorView.tsx (violations map controls z-10→z-[1000]), ZoneManagementView.tsx (stall editor z-30→z-[1000], added click handler), ZoneMapModal.tsx (overlays z-[1000]→z-[1200]), ParkingDashboard.tsx (parent z-0→z-10, controls z-10→z-[1000]). All map views now have functional, visible controls and reliable interaction handling across desktop and mobile devices.

## System Architecture

### Application Structure
The application employs a multi-page architecture with client-side routing, a component hierarchy, and React portals for modals. It supports English and Italian (Italian as default) and offers Progressive Web App (PWA) capabilities, including offline support, responsive mobile-first design, camera API integration, and high-accuracy geolocation. OpenStreetMap tiles are dynamically loaded via Leaflet.js. PWA is configured for `standalone` display and offline support.

### Authentication & Authorization
SpotNow implements Role-Based Access Control (RBAC) for User, Admin, Supervisor, Operator, and Ticket Point/Seller roles. Authentication uses localStorage for session tokens, Google Sign-In, and session persistence, with municipality-scoped permissions.

### Data Management
SpotNow uses a PostgreSQL database-first architecture for managing:
- User & Profile Management (profiles, vehicles, payment methods, credit transactions)
- Parking Infrastructure (parking spots, zones, stalls)
- Administrative Data (tariffs, permissions, transactions, subscription plans)
- Operator Data (vehicle checks, violation reporting)
- Geographic Data (Italian regions, provinces, municipalities)
User profile data, vehicles, payment methods, credit transactions, and subscriptions are migrated to PostgreSQL.

### Map & Geolocation
The application uses OpenStreetMap via Leaflet.js for all mapping features, including dynamic map rendering, tile layer switching (OpenStreetMap roadmap, Esri World Imagery), custom parking spot markers, user location marker, and interactive controls. Address search is powered by Nominatim, and route planning/distance calculations use OSRM. A dynamic spot loading system uses variable-radius queries and viewport-based loading. Geolocation is enhanced with immediate position updates, continuous tracking, app resume detection, and high accuracy mode. The stall layout editor and zone creation/management now fully utilize Leaflet.js.

### AI-Powered Recommendations
Intelligent parking recommendations are provided by the Google Gemini API (via an Express.js proxy), based on user context, location, time, zone restrictions, and subscription benefits.

### Payment Processing
Supports simulated credit card processing, cash payments via QR code, and credit balance usage. A tariff system defines zone-based pricing and applies subscription discounts.

### Session & Subscription Management
Active parking sessions feature real-time countdowns, extension options, and automatic spot release. A tiered subscription system offers monthly and yearly plans with percentage-based parking discounts.

### Operator & Administrative Tools
Operators perform vehicle checks and report violations. Administrators manage zones, users, and access reports. A comprehensive municipality selector component, including caching and retry logic, is used for subscription plans.

### Backend Infrastructure
A production-ready backend API uses Node.js + Express.js with PostgreSQL. It features JWT authentication, RBAC, CRUD endpoints, pagination, rate limiting, and transaction management.

## External Dependencies

### OpenStreetMap Stack
*   **Leaflet.js**: Interactive map library
*   **Nominatim API**: Geocoding and reverse geocoding
*   **OSRM API**: Routing and distance matrix calculations
*   **OpenStreetMap Tiles**: Standard roadmap
*   **Esri World Imagery**: Satellite imagery

### Google Cloud Platform
*   **Google AI Studio - Gemini API**: For AI parking recommendations (accessed via proxy).
*   **Google Places API**: Used only in `ItalianMunicipalityMultiSelect` (admin component).

### Third-Party Libraries
*   **Mapping**: Leaflet 1.9.4, @types/leaflet
*   **UI & Styling**: Tailwind CSS, Font Awesome 6.5.1
*   **PDF Generation**: jsPDF
*   **QR Codes**: qrcode
*   **Build & Development**: Vite, TypeScript, React 19
*   **Database ORM**: Drizzle ORM

### Browser APIs
*   Geolocation API
*   MediaDevices API (camera access)
*   LocalStorage API
*   Service Worker API
*   Barcode Detection API

### Backend Technology
*   **Node.js + Express.js**
*   **PostgreSQL**
*   **PostgreSQL Driver**: `@neondatabase/serverless`