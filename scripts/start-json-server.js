import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/api/health", (req, res) => {
	res.json({ status: "UP" });
});

// Rewrite routes to add /api prefix
server.use(
	jsonServer.rewriter({
		"/api/*": "/$1",
	}),
);

// Use default router
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
	console.log(`JSON Server is running on port ${PORT}`);
	console.log(`API is available at http://localhost:${PORT}/api`);
});
