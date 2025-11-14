# Conference-Management-System
A complete Conference Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). This project manages the full workflow of an academic/technical conference including paper submission, review process, scheduling, payments, and participant management.

🚀 Features
👤 Author Module

Register & login

Submit research papers

Upload updated versions

Track review status

Make conference payment

📝 Reviewer Module

View assigned papers

Download submissions

Provide scores & comments

Submit final decision (Accept/Reject)

🎓 Chair / Admin Module

Manage users (Authors, Reviewers, Participants)

Assign reviewers to papers

Approve/Reject papers

Generate conference schedule

Manage payment details

Publish final list of accepted papers

🎟️ Participant Module

Register for the conference

Make payment

View conference schedule

🛠️ Tech Stack (MERN)
Frontend

React.js

React Router

Axios

Bootstrap / Material UI (optional)

Backend

Node.js

Express.js

JWT Authentication

Multer (for file uploads)

Database

MongoDB (Mongoose ODM)

📁 Project Structure
/client
   ├── src
   │   ├── components
   │   ├── pages
   │   ├── context
   │   └── services

/server
   ├── config
   ├── controllers
   ├── models
   ├── routes
   ├── middleware
   └── uploads

🔐 Authentication

JWT-based secure login

Role-based access: Admin | Reviewer | Author | Participant

📦 Installation
1️⃣ Clone Repo
git clone https://github.com/your-username/conference-management-mern.git
cd conference-management-mern

2️⃣ Install Server Dependencies
cd server
npm install

3️⃣ Install Client Dependencies
cd ../client
npm install

4️⃣ Create .env in server folder
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_KEY=optional

5️⃣ Run Server
npm start

6️⃣ Run Client
npm run dev

📌 Modules Implemented

User Management

Paper Management

Review Management

Payment Integration (Razorpay/Stripe optional)

Conference Scheduling

Notifications

📚 Future Enhancements

Email notifications

Real-time chat between authors & reviewers

Downloadable certificates

Automated schedule generation

🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

📄 License

MIT License
