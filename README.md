# 🏨 MyHotelAssistant
A System Supporting Hotel Services

## About the project

Currently, most hotels offer special services for their guests, such as room service, spa treatments, or additional cleaning. However, using these services is often problematic and time-consuming, which reduces customer interest.
The system proposed in this project will enable access to the hotel's offerings in multiple languages and allow guests to place personalized orders via mobile devices, making the services more accessible. 
Hotel administration will be able to freely modify the available offerings according to any internal changes within the facility.
The system will allow efficient order management, giving hotel staff the ability to accept or reject orders placed by guests. 
If an order is accepted, it will be automatically assigned to the specific guest. 
The system will also allow guests to submit requests to cancel or modify a service, which can then be approved or rejected by the hotel staff.
Access to the application will be granted only to individuals who receive a specially generated access key from the hotel for the duration of their stay, as well as authorized hotel staff.

The creation of this project is the goal of our engineering thesis at AGH University in Kraków, Poland. 😀

### Project Goal

The goal of the project is to create a system that facilitates the use of hotel services in terms of service availability, ordering, and the subsequent execution of services. 
The system's users will be hotel guests and the staff responsible for customer service.

## Technologies

[![tech stack](https://skillicons.dev/icons?i=react,tailwind,ts,redux,kotlin,spring,mongo,docker&theme=dark)](https://skillicons.dev)


## Quick setup
### Prerequisites
- [Docker](https://www.docker.com/get-started/)
- [Node.js](https://nodejs.org/en/download/) (for local frontend development)
- [Npm](https://www.npmjs.com/get-npm) (for local frontend development)
- [Make](https://www.gnu.org/software/make/) (optional, for using Makefile commands)

### Running with Docker
1. Clone the repository
2. To start backend and frontend in project root run:
```bash 
make run
```

Or:
- in project root run:
```bash
docker-compose up
```
- in `frontend` folder run:
```bash
npm install
```
```bash
npm run dev 
```
3. Open your browser and go to `http://localhost:5173` (frontend)

## Useful links
### [📘 API documentation](/backend/docs/README.md)

