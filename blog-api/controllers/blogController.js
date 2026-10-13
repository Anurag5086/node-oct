const blogData = 
[
  {
    "id": 1,
    "title": "Getting Started with JavaScript",
    "content": "JavaScript is a popular programming language used to build interactive websites and web applications. Beginners can start by learning variables, data types, functions, arrays, and objects. Once these fundamentals are clear, they can move on to asynchronous programming and modern JavaScript features.",
    "author": "Rahul Sharma",
    "topic": "JavaScript"
  },
  {
    "id": 2,
    "title": "Understanding Node.js",
    "content": "Node.js is a JavaScript runtime that allows developers to execute JavaScript outside the browser. It is commonly used to build APIs, real-time applications, and backend services. Its event-driven architecture and non-blocking I/O make it useful for handling many concurrent requests.",
    "author": "Priya Verma",
    "topic": "Node.js"
  },
  {
    "id": 3,
    "title": "Introduction to Express.js",
    "content": "Express.js is a lightweight web framework for Node.js. It simplifies routing, middleware management, and HTTP request handling. Developers can use Express to create REST APIs, serve web pages, validate incoming requests, and organize backend applications into manageable components.",
    "author": "Amit Kumar",
    "topic": "Express.js"
  },
  {
    "id": 4,
    "title": "What Is an API?",
    "content": "An API allows different software applications to communicate with each other. For example, a weather application can request temperature information from a weather API. APIs define how requests should be made, what data can be exchanged, and how responses are returned.",
    "author": "Neha Gupta",
    "topic": "APIs"
  },
  {
    "id": 5,
    "title": "Understanding REST Architecture",
    "content": "REST is an architectural style used to design networked applications. RESTful APIs commonly use HTTP methods such as GET, POST, PUT, PATCH, and DELETE. Resources are identified through URLs, while JSON is frequently used to exchange data between clients and servers.",
    "author": "Vikram Singh",
    "topic": "REST API"
  },
  {
    "id": 6,
    "title": "Introduction to MongoDB",
    "content": "MongoDB is a document-oriented NoSQL database that stores information in flexible BSON documents. It is useful when applications need adaptable data structures and scalable data storage. Developers can organize information into collections and perform queries to retrieve or update documents.",
    "author": "Sneha Patel",
    "topic": "MongoDB"
  },
  {
    "id": 7,
    "title": "Why Developers Use Git",
    "content": "Git is a version control system that helps developers track changes in their code. It supports branching, merging, collaboration, and rollback of previous versions. Platforms such as GitHub make it easier for teams to review code and manage software projects together.",
    "author": "Rohan Mehta",
    "topic": "Git"
  },
  {
    "id": 8,
    "title": "Frontend vs Backend Development",
    "content": "Frontend development focuses on the interface users interact with, while backend development handles application logic, databases, and server-side operations. Both sides communicate through APIs. Understanding their responsibilities helps developers build complete applications with better architecture and maintainability.",
    "author": "Ananya Rao",
    "topic": "Web Development"
  },
  {
    "id": 9,
    "title": "Introduction to React",
    "content": "React is a JavaScript library for building user interfaces using reusable components. It encourages developers to divide complex screens into smaller pieces of UI. Components can receive props, manage state, and respond to user interactions to create dynamic web applications.",
    "author": "Karan Malhotra",
    "topic": "React"
  },
  {
    "id": 10,
    "title": "Understanding HTTP Status Codes",
    "content": "HTTP status codes communicate the outcome of a request. A 200 response indicates success, 201 indicates that a resource was created, 400 represents a bad request, 401 indicates missing or invalid authentication, 404 means a resource was not found, and 500 indicates a server error.",
    "author": "Pooja Mishra",
    "topic": "HTTP"
  },
  {
    "id": 11,
    "title": "Introduction to Databases",
    "content": "Databases provide a structured way to store, retrieve, and manage information. Relational databases organize data into tables, whereas document databases store records as flexible documents. Choosing a database depends on data relationships, query patterns, consistency requirements, and application needs.",
    "author": "Aditya Roy",
    "topic": "Databases"
  },
  {
    "id": 12,
    "title": "How Authentication Works",
    "content": "Authentication verifies the identity of a user or application. Common approaches include session-based authentication, token-based authentication, and OAuth. Secure systems should protect credentials, use HTTPS, validate tokens correctly, and implement appropriate expiration and account recovery mechanisms.",
    "author": "Meera Joshi",
    "topic": "Authentication"
  },
  {
    "id": 13,
    "title": "Introduction to JWT",
    "content": "JSON Web Tokens are compact tokens used to transmit claims between parties. They commonly contain a header, payload, and signature. Applications can use JWTs for authentication and authorization, but must validate signatures, expiration times, and relevant claims before trusting them.",
    "author": "Aditya Roy",
    "topic": "JWT"
  },
  {
    "id": 14,
    "title": "What Is Middleware in Express?",
    "content": "Middleware functions run during the request-response cycle in Express applications. They can inspect requests, modify responses, authenticate users, log activity, and handle errors. Middleware is registered using methods such as app.use() and can be organized into reusable functions.",
    "author": "Ishita Sinha",
    "topic": "Express Middleware"
  },
  {
    "id": 15,
    "title": "Introduction to TypeScript",
    "content": "TypeScript extends JavaScript with static type checking. Developers can define types, interfaces, and generic functions to catch many errors before runtime. It is especially helpful in larger applications where clear contracts and editor tooling improve code quality and maintainability.",
    "author": "Nikhil Bansal",
    "topic": "TypeScript"
  },
  {
    "id": 16,
    "title": "Getting Started with Cloud Computing",
    "content": "Cloud computing provides computing resources such as servers, storage, databases, and networking over the internet. Services can be scaled according to demand, reducing the need to maintain physical infrastructure. Popular cloud platforms offer tools for deployment, monitoring, security, and backup.",
    "author": "Sakshi Jain",
    "topic": "Cloud Computing"
  },
  {
    "id": 17,
    "title": "Introduction to Docker",
    "content": "Docker packages applications and their dependencies into containers. Containers help applications run consistently across development, testing, and production environments. Developers can define images, configure container networking, mount volumes, and use Docker Compose to manage multi-service applications.",
    "author": "Aditya Roy",
    "topic": "Docker"
  },
  {
    "id": 18,
    "title": "Why API Security Matters",
    "content": "API security protects application data and services from unauthorized access and misuse. Important practices include input validation, authentication, authorization, rate limiting, secure secrets management, and HTTPS. Developers should also monitor suspicious activity and avoid exposing sensitive information in error messages.",
    "author": "Aditya Roy",
    "topic": "Cybersecurity"
  },
  {
    "id": 19,
    "title": "Introduction to Asynchronous JavaScript",
    "content": "Asynchronous JavaScript allows applications to handle operations such as network requests without blocking the main execution flow. Promises and async/await make asynchronous code easier to read and maintain. Proper error handling is important when working with asynchronous operations.",
    "author": "Manish Tiwari",
    "topic": "JavaScript"
  },
  {
    "id": 20,
    "title": "Building Your First Blog API",
    "content": "A blog API allows clients to create, read, update, and delete blog posts. A basic Express implementation can expose endpoints for listing posts, retrieving a post by ID, creating a new post, editing existing content, and deleting records. Validation and consistent HTTP responses make the API more reliable.",
    "author": "Aarav Malhotra",
    "topic": "Backend Development"
  }
]

// Route params
exports.getBlogById = (req, res) => {
    const blogId = parseInt(req.params.id)

    const blogPost = blogData.find(blog => blog.id === blogId) // DB Query

    if(!blogPost){
        res.status(404).json({ success: false, message: "Blog post not found!" })
    }

    res.status(200).json({ success: true, message: "Successfully fetched blog!", blog: blogPost })
}

// Query params
exports.getAllBlogs = (req, res) => {
    let filteredBlogs = blogData

    if(req.query.author){
        const author = req.query.author
        filteredBlogs = filteredBlogs.filter(blog => blog.author.toLowerCase() === author.toLowerCase())
    }

    if(req.query.topic){
        const topic = req.query.topic
        filteredBlogs = filteredBlogs.filter(blog => blog.topic.toLowerCase() === topic.toLowerCase())
    }

    if(filteredBlogs.length < 1){
        res.status(404).json({ success: false, message: "Blogs not found!" })
    }

    res.status(200).json({ success: true, message: "Blogs fetched successfully!", blogs: filteredBlogs })
}

